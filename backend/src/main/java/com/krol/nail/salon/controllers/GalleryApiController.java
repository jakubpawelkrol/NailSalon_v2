package com.krol.nail.salon.controllers;

import com.krol.nail.salon.dtos.GalleryItemDto;
import com.krol.nail.salon.services.GalleryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200"})
@RequestMapping("/api/images")
public class GalleryApiController {

    private final GalleryService galleryService;

    public GalleryApiController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getGallery() throws IOException {
        List<GalleryItemDto> resultList = null;
        try {
            resultList = galleryService.list();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error while fetching gallery: " + e.getMessage());
        }
        return ResponseEntity.ok(resultList);
    }
}
