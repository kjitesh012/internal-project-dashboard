/**
 * TaskRepository
 * Spring Data JPA Repository for database operations on Task entities.
 */
package com.dashboard.api.repository;

import com.dashboard.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
