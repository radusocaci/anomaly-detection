package ro.tuc.ds2020.dtos.mappers;

import ro.tuc.ds2020.dtos.SensorDataDto;
import ro.tuc.ds2020.dtos.SensorDataFlaskDto;

public final class SensorDataDtoToSensorDataFlaskDtoMapper {

    public static SensorDataFlaskDto sensorDataDtoToSensorDataFlaskDto(final SensorDataDto sensorDataDto) {
        final SensorDataFlaskDto sensorDataFlaskDto = new SensorDataFlaskDto();
        sensorDataFlaskDto.setName(sensorDataDto.getActivity());
        sensorDataFlaskDto.setStartTime(sensorDataDto.getStartTime().toString());
        sensorDataFlaskDto.setEndTime(sensorDataDto.getEndTime().toString());
        return sensorDataFlaskDto;
    }
}
