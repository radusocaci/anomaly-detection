package ro.tuc.ds2020.entities.util.converters;

import ro.tuc.ds2020.entities.util.Gender;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public final class GenderConverter implements AttributeConverter<Gender, String> {

    @Override
    public String convertToDatabaseColumn(Gender gender) {
        return gender.getGender();
    }

    @Override
    public Gender convertToEntityAttribute(String gender) {
        return Gender.forGender(gender);
    }
}
