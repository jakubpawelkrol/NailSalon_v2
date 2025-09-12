package com.krol.nail.salon.services;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitterService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket createNewBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder().capacity(3).refillIntervally(3, Duration.ofSeconds(30)).build())
                .addLimit(Bandwidth.builder().capacity(30).refillIntervally(30, Duration.ofHours(1)).build())
                .build();
    }

    public Bucket getBucket(String key) {
        return buckets.computeIfAbsent(key, (ignored) -> createNewBucket());
    }

    public boolean tryConsume(String key) {
        return getBucket(key).tryConsume(1);
    }
}
