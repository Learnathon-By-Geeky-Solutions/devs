package com.devs.roamance.config;

import com.devs.roamance.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Component
public class AuditorAwareImpl implements AuditorAware<UUID> {
  private final JwtUtils jwtUtils;

  public AuditorAwareImpl(JwtUtils jwtUtils) {
    this.jwtUtils = jwtUtils;
  }

  @Override
  @NonNull
  public Optional<UUID> getCurrentAuditor() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
        || !authentication.isAuthenticated()
        || authentication.getPrincipal().equals("anonymousUser")) {
      log.debug("No authenticated user found, cannot provide UUID auditor");
      return Optional.empty();
    }

    if (authentication.getDetails() != null
        && authentication instanceof UsernamePasswordAuthenticationToken) {
      try {
        String userIdString = authentication.getDetails().toString();
        UUID userId = UUID.fromString(userIdString);
        log.debug("Retrieved user UUID: {} directly from authentication details", userId);
        return Optional.of(userId);
      } catch (IllegalArgumentException e) {
        log.warn(
            "Could not parse UUID from authentication details: {}", authentication.getDetails());
      }
    }

    ServletRequestAttributes attrs =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    if (attrs != null) {
      HttpServletRequest request = attrs.getRequest();
      String token = jwtUtils.getTokenFromHeader(request.getHeader("Authorization"));
      if (token != null) {
        try {
          String userIdString = jwtUtils.getUserIdFromToken(token);
          UUID userId = UUID.fromString(userIdString);
          log.debug("Retrieved user UUID: {} from JWT token", userId);
          return Optional.of(userId);
        } catch (IllegalArgumentException e) {
          log.warn("Could not parse UUID from JWT token: {}", token);
        }
      }
    }

    log.debug("User ID not found in authentication details or token");
    return Optional.empty();
  }
}
