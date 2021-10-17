package ro.tuc.ds2020.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public final class CaregiverAlertDto {

    private String caregiverUsername;

    private String message;
}
