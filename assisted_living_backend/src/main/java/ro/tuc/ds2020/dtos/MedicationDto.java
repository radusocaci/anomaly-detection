package ro.tuc.ds2020.dtos;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
public final class MedicationDto implements Serializable {

    private UUID id;

    private String name;

    private String sideEffects;

    private String dosage;
}
