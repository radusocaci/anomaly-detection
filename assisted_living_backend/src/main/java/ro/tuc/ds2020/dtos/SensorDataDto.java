package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.converters.LocalDateTimeDeserializer;
import ro.tuc.ds2020.entities.util.converters.LocalDateTimeSerializer;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public final class SensorDataDto {

    private UUID patientId;

    @JsonProperty("Start time")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime startTime;

    @JsonProperty("End time")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime endTime;

    @JsonProperty("Activity name")
    private String activity;
}