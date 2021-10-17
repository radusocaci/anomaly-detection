package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.SensorDataFlaskDto;
import ro.tuc.ds2020.entities.AnomalyData;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class SensorDataFlaskDtoToAnomalyDataMapper {

    private final static DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm[:ss]");

    public static AnomalyData sensorDataFlaskDtoToAnomalyData(SensorDataFlaskDto sensorDataFlaskDto) {
        AnomalyData anomalyData = new AnomalyData();
        anomalyData.setActivity(sensorDataFlaskDto.getName());
        anomalyData.setStartTime(LocalDateTime.parse(sensorDataFlaskDto.getStartTime(), DATE_TIME_FORMATTER));
        anomalyData.setEndTime(LocalDateTime.parse(sensorDataFlaskDto.getEndTime(), DATE_TIME_FORMATTER));
        anomalyData.setAnomaly(sensorDataFlaskDto.isAnomaly());
        anomalyData.setOrderAnomaly(sensorDataFlaskDto.isOrderAnomaly());
        return anomalyData;
    }
}
