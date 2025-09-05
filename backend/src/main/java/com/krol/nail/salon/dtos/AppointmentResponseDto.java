package com.krol.nail.salon.dtos;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AppointmentResponseDto {
    private UUID id;
    private String serviceText;
    private String date;
    private String time;
    private Long duration;
    private String name;
    private String notes;
}
