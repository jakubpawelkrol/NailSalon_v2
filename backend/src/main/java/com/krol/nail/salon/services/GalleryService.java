package com.krol.nail.salon.services;

import com.krol.nail.salon.dtos.GalleryItemDto;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class GalleryService {
    private static final Path ROOT = Path.of("/opt/app/images");
    private static final Path THUMBS = ROOT.resolve(".thumbs");
    private static final Set<String> ALLOWED = Set.of("jpg", "jpeg", "png", "webp");
    private static final int THUMB_SIZE = 150;

    public GalleryService() throws IOException {
        Files.createDirectories(THUMBS);
    }

    public List<GalleryItemDto> list() throws IOException {
        try(Stream<Path> files = Files.list(ROOT)) {
            return files.filter(Files::isRegularFile)
                    .filter(this::isAllowedImage)
                    .map(this::toItem)
                    .collect(Collectors.toList());
        }
    }

    private boolean isAllowedImage(Path p) {
        String name = p.getFileName().toString();
        int dot = name.lastIndexOf('.');
        if(dot < 0) return false;
        return ALLOWED.contains(name.substring(dot + 1).toLowerCase());
    }

    private GalleryItemDto toItem(Path file) {
        String filename = file.getFileName().toString();
        String baseName = filename.replaceAll("\\.[^.]+$", "");

        Path thumbPath = THUMBS.resolve(baseName + ".jpg");
        if(!Files.exists(thumbPath)) {
            try {
                Thumbnails.of(file.toFile())
                        .crop(Positions.CENTER)
                        .size(THUMB_SIZE, THUMB_SIZE)
                        .outputFormat("jpg")
                        .toFile(thumbPath.toFile());

                try {
                    Files.setLastModifiedTime(thumbPath, Files.getLastModifiedTime(file));
                } catch(Exception ignored) { }
            } catch (IOException e) {
                throw new RuntimeException("Failed to create thumbnail for " + filename, e);
            }
        }
        String imageUrl = UriComponentsBuilder.fromPath("/images/{name}")
                .buildAndExpand(filename).toUriString();
        String thumbnailUrl = UriComponentsBuilder.fromPath("/thumbnails/{name}.jpg")
                .buildAndExpand(baseName).toUriString();

        return new GalleryItemDto(imageUrl, thumbnailUrl, baseName, baseName);
    }
}
