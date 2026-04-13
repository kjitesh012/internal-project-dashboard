/**
 * Task Entity
 * JPA Model representing an individual task within a parent Project.
 */
package com.dashboard.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String title;
    public String status;

    public Task() {}

    public Task(Long id, String title, String status) {
        this.id = id;
        this.title = title;
        this.status = status;
    }
}
