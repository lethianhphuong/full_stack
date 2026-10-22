package com.material.service.impl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.material.dto.LoginDTO;
import com.material.dto.RegisterDTO;
import com.material.entity.UserEntity;
import com.material.enums.UserRoleEnum;
import com.material.enums.UserStatusEnum;
import com.material.exception.AppException;
import com.material.mapper.UserMapper;
import com.material.repo.UserRepo;
import com.material.service.AuthService;
import com.material.vo.AuthVO;
import com.material.vo.UserVO;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Override
    @Transactional(readOnly = true)
    public AuthVO login(LoginDTO loginDTO) {
        UserEntity user = userRepo.findByEmail(loginDTO.email())
                .orElseThrow(() -> new AppException(400, "Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(loginDTO.password(), user.getPassword())) {
            throw new AppException(400, "Email hoặc mật khẩu không chính xác");
        }

        if (user.getStatus() == UserStatusEnum.BANNED) {
            throw new AppException(403, "Tài khoản của bạn đã bị khóa");
        }

        String token = generateToken(user.getEmail());
        String refreshToken = generateToken(user.getEmail());

        return AuthVO.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toVO(user))
                .build();
    }

    @Override
    @Transactional
    public AuthVO register(RegisterDTO registerDTO) {
        if (userRepo.existsByEmail(registerDTO.email())) {
            throw new AppException(400, "Email đã được sử dụng");
        }

        UserEntity newUser = UserEntity.builder()
                .firstName(registerDTO.firstName())
                .lastName(registerDTO.lastName())
                .email(registerDTO.email())
                .password(passwordEncoder.encode(registerDTO.password()))
                .role(UserRoleEnum.USER)
                .status(UserStatusEnum.ACTIVE)
                .isVerified(false)
                .build();

        UserEntity saved = userRepo.save(newUser);
        String token = generateToken(saved.getEmail());

        return AuthVO.builder()
                .accessToken(token)
                .refreshToken(token)
                .tokenType("Bearer")
                .user(userMapper.toVO(saved))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserVO getCurrentUser() {
        // Mock current user hoặc lấy theo SecurityContext
        return userRepo.findAll().stream().findFirst().map(userMapper::toVO).orElse(null);
    }

    private String generateToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }
}
