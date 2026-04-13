/**
 * ProjectRepository
 * Spring Data JPA Repository for database operations on Project entities.
 */
package com.dashboard.api.repository;

import com.dashboard.api.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
