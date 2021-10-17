package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public final class SensorDataFlaskDto {

    private String name;

    private String startTime;

    private String endTime;

    private boolean anomaly;

    @JsonProperty("order-anomaly")
    private boolean orderAnomaly;
}
