package com.krol.nail.salon.repositories;

import com.krol.nail.salon.entities.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {
    @Query("select s FROM Services s ORDER BY s.category ASC")
    List<Services> findAllOrderedByCategory();
}
