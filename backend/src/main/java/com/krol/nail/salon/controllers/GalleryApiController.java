package com.krol.nail.salon.controllers;

import com.krol.nail.salon.dtos.GalleryItem;
import com.krol.nail.salon.services.GalleryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200"})
public class GalleryApiController {

    private final GalleryService galleryService;

    public GalleryApiController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping("/api/images/get")
    public ResponseEntity<List<GalleryItem>> getGallery() throws IOException {
        return ResponseEntity.ok(galleryService.list());
    }

    @GetMapping("/api/auth/hello")
    public String helloworld() {
        return "Hello World!";
    }
}
