package com.dashboard.api.model;

import java.util.List;

public class Project {
    public Long id;
    public String name;
    public String manager;
    public String status;
    public String deadline;
    public String description;
    public Integer progress;
    public List<Task> tasks;

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
        this.tasks = tasks;
    }
}
