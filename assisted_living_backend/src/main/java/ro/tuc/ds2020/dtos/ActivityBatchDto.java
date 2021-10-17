package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public final class ActivityBatchDto {

    @JsonProperty("patient-id")
    private UUID patientId;

    @NotEmpty
    private List<SensorDataDto> activities = new ArrayList<>();
}
