package ro.tuc.ds2020.entities.util.converters;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.parse;

public final class LocalDateTimeDeserializer extends StdDeserializer<LocalDateTime> {

    protected LocalDateTimeDeserializer() {
        super(LocalDateTime.class);
    }

    @Override
    public LocalDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException {
        String date = jsonParser.getText().replace(' ', 'T');
        return parse(date);
    }
}
