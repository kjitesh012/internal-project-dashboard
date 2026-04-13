/**
 * ProjectController
 * Spring Boot REST Controller exposing HTTP endpoints for Project and Task operations.
 */
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

    /**
     * Retrieves a list of all projects.
     * @return List of Project entities.
     */
    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    /**
     * Retrieves a specific project by its ID.
     * @param id The unique identifier of the project.
     * @return The requested Project entity.
     */
    @GetMapping("/projects/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectService.getProject(id);
    }

    /**
     * Updates an existing project's core details.
     * @param id The unique identifier of the project to update.
     * @param updates A Project object containing the modified fields.
     * @return The updated Project entity.
     */
    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updates) {
        return projectService.updateProject(id, updates);
    }

    /**
     * Creates and attaches a new task to a specific project.
     * @param projectId The unique identifier of the parent project.
     * @param newTask A Task object containing the initial task details.
     * @return The newly created Task entity.
     */
    @PostMapping("/projects/{projectId}/tasks")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task newTask) {
        return projectService.createTask(projectId, newTask);
    }

    /**
     * Updates an existing task within a project.
     * @param projectId The unique identifier of the parent project.
     * @param taskId The unique identifier of the task to update.
     * @param updates A Task object containing the modified fields.
     * @return The updated Task entity.
     */
    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    public Task updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody Task updates
    ) {
        return projectService.updateTask(projectId, taskId, updates);
    }

    /**
     * Deletes a specific task from a project.
     * @param projectId The unique identifier of the parent project.
     * @param taskId The unique identifier of the task to remove.
     */
    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public void deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        projectService.deleteTask(projectId, taskId);
    }
}