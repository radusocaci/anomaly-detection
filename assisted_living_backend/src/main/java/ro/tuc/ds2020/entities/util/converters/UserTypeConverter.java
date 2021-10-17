package ro.tuc.ds2020.entities.util.converters;

import ro.tuc.ds2020.entities.util.UserType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public final class UserTypeConverter implements AttributeConverter<UserType, String> {

    @Override
    public String convertToDatabaseColumn(UserType userType) {
        return userType.getType();
    }

    @Override
    public UserType convertToEntityAttribute(String type) {
        return UserType.forType(type);
    }
}
