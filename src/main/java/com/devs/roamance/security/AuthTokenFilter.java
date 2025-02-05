package com.devs.roamance.security;

import com.devs.roamance.constant.ResponseMessage;
import com.devs.roamance.exception.AuthTokenNotFoundException;
import com.devs.roamance.exception.AuthenticationFailedException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

  private final HandlerExceptionResolver exceptionResolver;

  private final JwtUtils jwtUtils;

  @Autowired
  public AuthTokenFilter(
      @Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver,
      JwtUtils jwtUtil) {

    this.exceptionResolver = exceptionResolver;
    this.jwtUtils = jwtUtil;
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    String contextPath = request.getContextPath();

    if (request.getRequestURI().startsWith(contextPath + "/auth")
        || request.getRequestURI().equals(contextPath + "/users/register")) {

      filterChain.doFilter(request, response);

      return;
    }

    try {
      String token = jwtUtils.getTokenFromHeader(request.getHeader("Authorization"));

      if (token != null) {

        String tokenType = jwtUtils.getTokenType(token);

        if (!"access".equals(tokenType)) {

          throw new IllegalArgumentException(ResponseMessage.INVALID_TOKEN_TYPE);
        }

        jwtUtils.validateToken(token);

        authenticateUserFromToken(token);
      } else {

        throw new AuthTokenNotFoundException(ResponseMessage.AUTH_TOKEN_MISSING);
      }
    } catch (Exception e) {

      Exception exception = e;

      if (exception instanceof IllegalArgumentException
          && !ResponseMessage.INVALID_TOKEN_TYPE.equals(exception.getMessage())) {

        exception = new IllegalArgumentException(ResponseMessage.JWT_CLAIMS_EMPTY, exception);
      }

      exceptionResolver.resolveException(request, response, null, exception);

      return;
    }

    filterChain.doFilter(request, response);
  }

  private void authenticateUserFromToken(String token) {
    try {
      String email = jwtUtils.getEmailFromToken(token);

      List<String> roles = jwtUtils.getRolesFromToken(token);

      List<GrantedAuthority> authorities =
          roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

      Authentication authentication =
          new UsernamePasswordAuthenticationToken(email, null, authorities);

      SecurityContextHolder.getContext().setAuthentication(authentication);

    } catch (Exception e) {

      throw new AuthenticationFailedException(ResponseMessage.AUTHENTICATION_FAILED);
    }
  }
}
