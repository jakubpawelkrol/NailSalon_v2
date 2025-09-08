package com.krol.nail.salon.services.jwt;

import com.krol.nail.salon.services.RateLimitterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {
    private final RateLimitterService rateLimitterService;

    public RateLimitingFilter(RateLimitterService rateLimitterService) {
        this.rateLimitterService = rateLimitterService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !(request.getRequestURI().matches("^/api/auth/(login|signup|logout)$") && request.getMethod().matches("POST"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String clientIP = getClientIP(request);

        if(!rateLimitterService.tryConsume(clientIP)) {
            log.warn("Filtering ratio for IP [{}] exceeded", clientIP);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Rate limit exceeded\",\"retryAfter\":\"30 seconds\"}");
            return;
        }
        log.info("Filtering ratio for IP[{}], {} attempts left.", clientIP, rateLimitterService.getBucket(clientIP).getAvailableTokens());
        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if(xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIP = request.getHeader("X-Real-IP");
        if(xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }

        return request.getRemoteAddr();
    }
}
