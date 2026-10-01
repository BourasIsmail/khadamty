package com.employeehub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, 
                         JwtRequestFilter jwtRequestFilter) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/rh/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/employees/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                .requestMatchers("/attendance/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                // Sections accessibles à tous les rôles authentifiés
                .requestMatchers("/annonces/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                .requestMatchers("/documents/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                // Sections employé : demandes et ordres de mission
                .requestMatchers("/demandes/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                .requestMatchers("/ordres-mission/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                // Autres ressources RH/Admin
                .requestMatchers("/structures/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/salaires/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/grades/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/coordinations/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/delegations/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/primes/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/credits/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/notes-annuelles/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/examens/**").hasAnyRole("ADMIN", "RH")
                .requestMatchers("/reclamations/**").hasAnyRole("ADMIN", "RH", "EMPLOYEE")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Accepter tous les ports localhost (Next.js, Flutter web, etc.)
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
