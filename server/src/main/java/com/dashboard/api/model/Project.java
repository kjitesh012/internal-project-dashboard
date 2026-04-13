/**
 * Project Entity
 * JPA Model representing a Project containing multiple tasks.
 */
package com.dashboard.api.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String name;
    public String manager;
    public String status;
    public String deadline;
    public String description;
    public Integer progress;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    public List<Task> tasks = new ArrayList<>();

    public Project() {}

    public Project(Long id, String name, String manager, String status, String deadline,
                   String description, Integer progress, List<Task> tasks) {
        this.id = id;
        this.name = name;
        this.manager = manager;
        this.status = status;
        this.deadline = deadline;
        this.description = description;
        this.progress = progress;
        if (tasks != null) {
            this.tasks = tasks;
        }
    }
}
