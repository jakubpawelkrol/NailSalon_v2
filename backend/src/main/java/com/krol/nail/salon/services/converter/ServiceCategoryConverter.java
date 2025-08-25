package com.krol.nail.salon.services.converter;

import com.krol.nail.salon.entities.ServiceCategory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ServiceCategoryConverter implements AttributeConverter<ServiceCategory, String> {

    @Override
    public String convertToDatabaseColumn(ServiceCategory serviceCategory) {
        if(serviceCategory == null) {
            throw new NullPointerException("Service category cannot be null!");
        }
        return serviceCategory.getCategory();
    }

    @Override
    public ServiceCategory convertToEntityAttribute(String category) {
        if(category == null) {
            throw new NullPointerException("Service category cannot be null!");
        }
        return ServiceCategory.of(category);
    }
}
