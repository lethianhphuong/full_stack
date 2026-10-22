package com.material.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.material.entity.DocumentContentEntity;

import java.util.UUID;

@Repository
public interface DocumentContentRepo extends JpaRepository<DocumentContentEntity, UUID> {
}
