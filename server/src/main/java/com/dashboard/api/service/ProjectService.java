package com.dashboard.api.service;

import com.dashboard.api.model.Project;
import com.dashboard.api.model.Task;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProjectService {

    private final ProjectFileStore projectFileStore;
    private final Map<Long, Project> projectStorage = new LinkedHashMap<>();
    private long nextTaskId = 1;

    public ProjectService(ProjectFileStore projectFileStore) {
        this.projectFileStore = projectFileStore;
    }

    @PostConstruct
    public void init() {
        List<Project> projects = projectFileStore.loadProjects();
        populateStorage(projects);
    }

    public List<Project> getAllProjects() {
        return new ArrayList<>(projectStorage.values());
    }

    public Project getProject(Long id) {
        return findProjectOrThrow(id);
    }

    public Project updateProject(Long id, Project updates) {
        Project project = findProjectOrThrow(id);

        if (updates.name != null) project.name = updates.name;
        if (updates.manager != null) project.manager = updates.manager;
        if (updates.status != null) project.status = updates.status;
        if (updates.deadline != null) project.deadline = updates.deadline;
        if (updates.description != null) project.description = updates.description;
        if (updates.progress != null) project.progress = updates.progress;

        saveAll();
        return project;
    }

    public Task createTask(Long projectId, Task newTask) {
        Project project = findProjectOrThrow(projectId);

        if (project.tasks == null) {
            project.tasks = new ArrayList<>();
        }

        Task task = new Task(nextTaskId++, newTask.title, newTask.status);
        project.tasks.add(task);
        saveAll();

        return task;
    }

    public Task updateTask(Long projectId, Long taskId, Task updates) {
        Project project = findProjectOrThrow(projectId);

        if (project.tasks == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }

        for (Task task : project.tasks) {
            if (task.id.equals(taskId)) {
                if (updates.title != null) task.title = updates.title;
                if (updates.status != null) task.status = updates.status;
                saveAll();
                return task;
            }
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
    }

    public void deleteTask(Long projectId, Long taskId) {
        Project project = findProjectOrThrow(projectId);

        if (project.tasks == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }

        boolean removed = project.tasks.removeIf(task -> task.id.equals(taskId));

        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }

        saveAll();
    }

    private Project findProjectOrThrow(Long id) {
        Project project = projectStorage.get(id);
        if (project == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        return project;
    }

    private void populateStorage(List<Project> projects) {
        projectStorage.clear();
        nextTaskId = 1;

        for (Project project : projects) {
            if (project.tasks == null) {
                project.tasks = new ArrayList<>();
            } else {
                project.tasks = new ArrayList<>(project.tasks);
            }

            projectStorage.put(project.id, project);

            for (Task task : project.tasks) {
                if (task.id != null) {
                    nextTaskId = Math.max(nextTaskId, task.id + 1);
                }
            }
        }
    }

    private void saveAll() {
        projectFileStore.saveProjects(new ArrayList<>(projectStorage.values()));
    }
}