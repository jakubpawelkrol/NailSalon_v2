package com.krol.nail.salon.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponseDto {
    private UUID id;
    private String serviceText;
    private String date;
    private String time;
    private Long duration;
    private String name;
    private String notes;
}
