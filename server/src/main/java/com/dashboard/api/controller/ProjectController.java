package com.dashboard.api.controller;

import com.dashboard.api.model.Project;
import com.dashboard.api.model.Task;
import com.dashboard.api.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/projects/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectService.getProject(id);
    }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updates) {
        return projectService.updateProject(id, updates);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task newTask) {
        return projectService.createTask(projectId, newTask);
    }

    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    public Task updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody Task updates
    ) {
        return projectService.updateTask(projectId, taskId, updates);
    }

    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public void deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        projectService.deleteTask(projectId, taskId);
    }
}