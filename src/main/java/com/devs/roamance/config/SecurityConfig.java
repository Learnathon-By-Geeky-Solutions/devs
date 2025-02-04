package com.devs.roamance.config;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.devs.roamance.security.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${application.frontend.url}")
    private String frontendUrl;

    private final AuthTokenFilter authTokenFilter;

    @Autowired
    public SecurityConfig(AuthTokenFilter authTokenFilter) {

        this.authTokenFilter = authTokenFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        return httpSecurity

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(authorize -> {

                    authorize.requestMatchers("/users/register", "/auth/**").permitAll();

                    authorize.anyRequest().authenticated();
                })

                .headers(headers ->
                        headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))

                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)

                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors -> cors.configurationSource(corsConfigurationSource())).build();
    }

    private CorsConfigurationSource corsConfigurationSource() {

        return request -> {

            CorsConfiguration cfg = new CorsConfiguration();

            cfg.setAllowedOrigins(Collections.singletonList(frontendUrl));
            cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
            cfg.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
            cfg.setExposedHeaders(List.of("Authorization"));
            cfg.setAllowCredentials(true);
            cfg.setMaxAge(3600L);

            return cfg;
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {

        return builder.getAuthenticationManager();
    }
}