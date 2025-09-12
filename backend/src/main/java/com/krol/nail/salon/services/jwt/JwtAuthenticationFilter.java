package com.krol.nail.salon.services.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.debug("Inside JwtAuthenticationFilter");
        String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            log.debug("authorizationHeader found.");
            jwtToken = authorizationHeader.substring(7);
        } else {
            log.debug("Cookies token approach:");
            if(request.getCookies() != null) {
                log.debug("Cookies found!");
                for(Cookie cookie : request.getCookies()) {
                    if("authToken".equalsIgnoreCase(cookie.getName())) {
                        jwtToken = cookie.getValue();
                        break;
                    }
                }
            }
        }

        try {
            username = jwtUtil.extractUsername(jwtToken);
            log.debug("Extracting username: <{}>", username);
        } catch (Exception e) {
            log.warn("JWT expired or invalid!");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Got authenticated");
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if(jwtUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("UsernamePasswordAuthenticationToken created: {}", authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
