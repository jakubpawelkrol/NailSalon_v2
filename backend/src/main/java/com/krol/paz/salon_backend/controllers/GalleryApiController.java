package com.krol.paz.salon_backend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200"})
public class GalleryApiController {

    @GetMapping("/api/hello")
    public String helloworld() {
        return "Hello World!";
    }
}
