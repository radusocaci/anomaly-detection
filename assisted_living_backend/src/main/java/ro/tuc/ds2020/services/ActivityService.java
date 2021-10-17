package ro.tuc.ds2020.services;

import net.minidev.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.ActivityBatchDto;
import ro.tuc.ds2020.dtos.SensorDataFlaskDto;
import ro.tuc.ds2020.dtos.mappers.SensorDataDtoToSensorDataFlaskDtoMapper;
import ro.tuc.ds2020.dtos.mappers.SensorDataFlaskDtoToAnomalyDataMapper;
import ro.tuc.ds2020.dtos.mappers.SensorDataToSensorDataDtoMapper;
import ro.tuc.ds2020.dtos.mappers.SensorDataToSensorDataFlaskDtoMapper;
import ro.tuc.ds2020.entities.AnomalyData;
import ro.tuc.ds2020.entities.Patient;
import ro.tuc.ds2020.entities.SensorData;
import ro.tuc.ds2020.repositories.AnomalyDataRepository;
import ro.tuc.ds2020.repositories.PatientRepository;
import ro.tuc.ds2020.repositories.SensorDataRepository;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    public static final String FLASK_SERVER_URL = "https://anomaly-detection-py-module.herokuapp.com/check-anomaly";

    private final SensorDataRepository sensorDataRepository;
    private final PatientRepository patientRepository;
    private final AnomalyDataRepository anomalyDataRepository;

    public ActivityService(SensorDataRepository sensorDataRepository,
                           PatientRepository patientRepository,
                           AnomalyDataRepository anomalyDataRepository) {
        this.sensorDataRepository = sensorDataRepository;
        this.patientRepository = patientRepository;
        this.anomalyDataRepository = anomalyDataRepository;
    }

    public void saveAll(ActivityBatchDto activityBatchDto) {
        List<SensorData> sensorData = activityBatchDto.getActivities()
                .stream()
                .map(SensorDataToSensorDataDtoMapper::sensorDataDtoToSensorData)
                .collect(Collectors.toList());

        Optional<Patient> patientOptional = patientRepository.findById(activityBatchDto.getPatientId());
        patientOptional.ifPresent(patient -> sensorData.forEach(sensorData1 -> sensorData1.setPatient(patient)));

        if (!patientOptional.isPresent()) {
            throw new ResourceNotFoundException("Patient");
        }

        sensorDataRepository.saveAll(sensorData);
    }

    @Transactional
    public void deleteAll(UUID id) {
        patientRepository.findById(id).ifPresent(patient -> {
            sensorDataRepository.deleteAllByPatient(patient);
            anomalyDataRepository.deleteAllByPatient(patient);
        });
    }

    public void checkAll(ActivityBatchDto activityBatchDto) {
        Optional<Patient> patientOptional = patientRepository.findById(activityBatchDto.getPatientId());

        if (!patientOptional.isPresent()) {
            throw new ResourceNotFoundException("Patient");
        }

        Patient patient = patientOptional.get();
        List<SensorData> routineData = sensorDataRepository.getAllByPatient(patient);
        List<SensorDataFlaskDto> routineDataFlaskDtos = routineData
                .stream()
                .map(SensorDataToSensorDataFlaskDtoMapper::sensorDataToSensorDataFlaskDto)
                .collect(Collectors.toList());
        List<SensorDataFlaskDto> anomalyCheckDataFlaskDtos = activityBatchDto.getActivities()
                .stream()
                .map(SensorDataDtoToSensorDataFlaskDtoMapper::sensorDataDtoToSensorDataFlaskDto)
                .collect(Collectors.toList());

        RestTemplate restTemplate = new RestTemplate();

        JSONObject payload = new JSONObject();
        payload.put("routine-data", routineDataFlaskDtos);
        payload.put("anomaly-check-data", anomalyCheckDataFlaskDtos);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(payload.toString(), httpHeaders);
        List<SensorDataFlaskDto> anomalyDetectionResponseDto = Arrays.asList(
                Objects.requireNonNull(restTemplate.postForObject(FLASK_SERVER_URL, request, SensorDataFlaskDto[].class))
        );

        List<AnomalyData> anomalyData = anomalyDetectionResponseDto
                .stream()
                .map(SensorDataFlaskDtoToAnomalyDataMapper::sensorDataFlaskDtoToAnomalyData)
                .peek(anomalyData1 -> anomalyData1.setPatient(patient))
                .collect(Collectors.toList());

        anomalyDataRepository.saveAll(anomalyData);

        //TODO uncomment to activate dynamic routine update
//        List<SensorData> anomalyCheckData = activityBatchDto.getActivities()
//                .stream()
//                .map(SensorDataToSensorDataDtoMapper::sensorDataDtoToSensorData)
//                .peek(sensorData -> sensorData.setPatient(patient))
//                .collect(Collectors.toList());
//
//        sensorDataRepository.saveAll(anomalyCheckData);
    }

    public List<AnomalyData> getAnomaliesForPatient(UUID patientId) {
        Optional<Patient> patientOptional = patientRepository.findById(patientId);

        if (!patientOptional.isPresent()) {
            throw new ResourceNotFoundException("Patient");
        }

        return anomalyDataRepository.getAllByPatient(patientOptional.get());
    }
}
