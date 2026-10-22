package com.material.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.material.dto.UserCreateDTO;
import com.material.dto.UserFilterDTO;
import com.material.dto.UserUpdateDTO;
import com.material.entity.UserEntity;
import com.material.event.UserCreatedEvent;
import com.material.exception.AppException;
import com.material.exception.ResourceNotFoundException;
import com.material.exporter.UserExcelExporter;
import com.material.mapper.UserMapper;
import com.material.repo.UserRepo;
import com.material.service.UserService;
import com.material.vo.PageVO;
import com.material.vo.UserVO;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final UserExcelExporter userExcelExporter;

    @Override
    @Transactional(readOnly = true)
    public PageVO<UserVO> getUsers(UserFilterDTO filterDTO) {
        String[] sortParts = filterDTO.getSort().split(",");
        String sortProperty = sortParts[0];
        Sort.Direction sortDirection = sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1]) 
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(filterDTO.getPage(), filterDTO.getSize(), Sort.by(sortDirection, sortProperty));

        Specification<UserEntity> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (filterDTO.getSearch() != null && !filterDTO.getSearch().isBlank()) {
                String pattern = "%" + filterDTO.getSearch().trim().toLowerCase() + "%";
                var searchPredicate = cb.or(
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern)
                );
                predicates = cb.and(predicates, searchPredicate);
            }

            if (filterDTO.getRole() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("role"), filterDTO.getRole()));
            }

            if (filterDTO.getStatus() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("status"), filterDTO.getStatus()));
            }

            return predicates;
        };

        Page<UserEntity> page = userRepo.findAll(spec, pageable);
        return PageVO.from(page.map(userMapper::toVO));
    }

    @Override
    @Transactional(readOnly = true)
    public UserVO getUserById(UUID id) {
        UserEntity entity = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", id));
        return userMapper.toVO(entity);
    }

    @Override
    @Transactional
    public UserVO createUser(UserCreateDTO createDTO) {
        if (userRepo.existsByEmail(createDTO.email())) {
            throw new AppException(400, "Email đã được sử dụng trong hệ thống");
        }

        UserEntity entity = userMapper.toEntity(createDTO);
        entity.setPassword(passwordEncoder.encode(createDTO.password()));
        if (createDTO.role() != null) entity.setRole(createDTO.role());
        if (createDTO.status() != null) entity.setStatus(createDTO.status());
        if (createDTO.isVerified() != null) entity.setVerified(createDTO.isVerified());

        UserEntity saved = userRepo.save(entity);

        // Bắn sự kiện bất đồng bộ
        eventPublisher.publishEvent(new UserCreatedEvent(
                saved.getId(), saved.getEmail(), saved.getLastName() + " " + saved.getFirstName()
        ));

        return userMapper.toVO(saved);
    }

    @Override
    @Transactional
    public UserVO updateUser(UUID id, UserUpdateDTO updateDTO) {
        UserEntity entity = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", id));

        if (!entity.getEmail().equalsIgnoreCase(updateDTO.email()) && userRepo.existsByEmail(updateDTO.email())) {
            throw new AppException(400, "Email đã được sử dụng bởi người dùng khác");
        }

        userMapper.updateEntityFromDTO(updateDTO, entity);
        return userMapper.toVO(userRepo.save(entity));
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepo.existsById(id)) {
            throw new ResourceNotFoundException("Người dùng", id);
        }
        userRepo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportUsersToExcel() throws IOException {
        List<UserEntity> allUsers = userRepo.findAll();
        List<UserVO> userVOs = allUsers.stream().map(userMapper::toVO).toList();
        return userExcelExporter.exportToExcel(userVOs);
    }
}
