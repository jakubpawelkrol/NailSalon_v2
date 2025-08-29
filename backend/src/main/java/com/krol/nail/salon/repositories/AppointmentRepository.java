package com.krol.nail.salon.repositories;

import com.krol.nail.salon.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByAppointmentStartDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT DISTINCT CAST(a.appointmentStartDate as DATE) FROM Appointment a WHERE a.appointmentStartDate >= :startDate AND a.appointmentStartDate <= :endDate")
    List<LocalDateTime> findDistinctAppointmentDatesInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
