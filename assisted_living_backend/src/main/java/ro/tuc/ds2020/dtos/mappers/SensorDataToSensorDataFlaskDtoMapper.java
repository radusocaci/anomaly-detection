package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.SensorDataFlaskDto;
import ro.tuc.ds2020.entities.SensorData;

public final class SensorDataToSensorDataFlaskDtoMapper {

    public static SensorDataFlaskDto sensorDataToSensorDataFlaskDto(SensorData sensorData) {
        SensorDataFlaskDto sensorDataFlaskDto = new SensorDataFlaskDto();
        sensorDataFlaskDto.setName(sensorData.getActivity());
        sensorDataFlaskDto.setStartTime(sensorData.getStartTime().toString());
        sensorDataFlaskDto.setEndTime(sensorData.getEndTime().toString());
        return sensorDataFlaskDto;
    }
}
