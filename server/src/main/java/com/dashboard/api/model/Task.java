package com.dashboard.api.model;

public class Task {
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
