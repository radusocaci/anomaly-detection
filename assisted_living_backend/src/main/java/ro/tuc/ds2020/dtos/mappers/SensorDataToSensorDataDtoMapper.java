package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.SensorDataDto;
import ro.tuc.ds2020.entities.SensorData;

public final class SensorDataToSensorDataDtoMapper {

    public static SensorData sensorDataDtoToSensorData(SensorDataDto sensorDataDto) {
        SensorData sensorData = new SensorData();
        sensorData.setActivity(sensorDataDto.getActivity());
        sensorData.setStartTime(sensorDataDto.getStartTime());
        sensorData.setEndTime(sensorDataDto.getEndTime());
        return sensorData;
    }
}
