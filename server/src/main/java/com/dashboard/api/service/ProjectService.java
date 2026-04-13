/**
 * ProjectService
 * Business logic layer mapping repository data to the API controllers, handling custom validation and initialization.
 */
package com.dashboard.api.service;

import com.dashboard.api.model.Project;
import com.dashboard.api.model.Task;
import com.dashboard.api.repository.ProjectRepository;
import com.dashboard.api.repository.TaskRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ObjectMapper objectMapper;

    public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository, ObjectMapper objectMapper) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Initialization hook that runs after bean creation. 
     * Migrates legacy JSON data to the H2 database on the first run.
     */
    @PostConstruct
    public void init() {
        if (projectRepository.count() == 0) {
            File legacyFile = new File("data/projects.json");
            if (!legacyFile.exists()) {
                legacyFile = new File("./server/data/projects.json");
            }
            if (!legacyFile.exists()) {
                legacyFile = new File("../data/projects.json"); // fallback
            }

            if (legacyFile.exists()) {
                try {
                    List<Project> initialProjects = objectMapper.readValue(legacyFile, new TypeReference<List<Project>>() {});
                    for (Project p : initialProjects) {
                        p.id = null; // Let H2 auto-generate ID
                        if (p.tasks != null) {
                            for (Task t : p.tasks) {
                                t.id = null; // Let H2 auto-generate ID
                            }
                        }
                    }
                    projectRepository.saveAll(initialProjects);
                } catch (IOException e) {
                    System.err.println("Could not load initial data: " + e.getMessage());
                }
            }
        }
    }

    /**
     * Fetches all projects from the database.
     * @return List of all projects.
     */
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    /**
     * Fetches a single project by ID.
     * @param id The project ID.
     * @return The project entity.
     * @throws ResponseStatusException if not found.
     */
    public Project getProject(Long id) {
        return findProjectOrThrow(id);
    }

    /**
     * Updates an existing project dynamically based on non-null fields in the updates payload.
     * @param id The project ID.
     * @param updates Project payload with fields to update.
     * @return The updated project entity.
     * @throws ResponseStatusException if not found.
     */
    public Project updateProject(Long id, Project updates) {
        Project project = findProjectOrThrow(id);

        if (updates.name != null) project.name = updates.name;
        if (updates.manager != null) project.manager = updates.manager;
        if (updates.status != null) project.status = updates.status;
        if (updates.deadline != null) project.deadline = updates.deadline;
        if (updates.description != null) project.description = updates.description;
        if (updates.progress != null) project.progress = updates.progress;

        return projectRepository.save(project);
    }

    /**
     * Creates a new task and associates it with the matching project.
     * @param projectId The parent project ID.
     * @param newTask Task payload to create.
     * @return The saved Task entity.
     * @throws ResponseStatusException if the parent project is not found.
     */
    public Task createTask(Long projectId, Task newTask) {
        Project project = findProjectOrThrow(projectId);

        if (project.tasks == null) {
            project.tasks = new ArrayList<>();
        }

        Task task = new Task();
        task.title = newTask.title;
        task.status = newTask.status;
        
        project.tasks.add(task);
        projectRepository.save(project);

        // find the newly saved task via the project list reference (the last one usually, or let UI deal with lack of true ID until fetch)
        return project.tasks.get(project.tasks.size() - 1);
    }

    /**
     * Updates an existing task's fields dynamically.
     * @param projectId The parent project ID.
     * @param taskId The task ID to update.
     * @param updates Task payload with fields to update.
     * @return The updated and saved Task entity.
     * @throws ResponseStatusException if the project or task is not found.
     */
    public Task updateTask(Long projectId, Long taskId, Task updates) {
        findProjectOrThrow(projectId); // verify project holds this task

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (updates.title != null) task.title = updates.title;
        if (updates.status != null) task.status = updates.status;
        
        return taskRepository.save(task);
    }

    /**
     * Deletes a task from the database after verifying the parent project structure.
     * @param projectId The parent project ID.
     * @param taskId The task ID to delete.
     * @throws ResponseStatusException if the project or task is not found.
     */
    public void deleteTask(Long projectId, Long taskId) {
        Project project = findProjectOrThrow(projectId);
        
        boolean removed = project.tasks.removeIf(task -> task.id.equals(taskId));
        
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        
        projectRepository.save(project);
    }

    /**
     * Helper method to lookup a project or throw a 404 NOT_FOUND exception.
     * @param id The project ID.
     * @return The resolved Project.
     * @throws ResponseStatusException if the project doesn't exist.
     */
    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }
}