package com.dashboard.api.service;

import com.dashboard.api.model.Project;
import com.dashboard.api.model.Task;
import com.dashboard.api.repository.ProjectRepository;
import com.dashboard.api.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    private ProjectService projectService;

    @BeforeEach
    public void setup() {
        projectService = new ProjectService(projectRepository, taskRepository, objectMapper);
    }

    @Test
    public void testGetProjectFound() {
        Project p = new Project();
        p.id = 1L;
        p.name = "Test";
        Mockito.when(projectRepository.findById(1L)).thenReturn(Optional.of(p));

        Project result = projectService.getProject(1L);
        assertEquals("Test", result.name);
    }

    @Test
    public void testGetProjectNotFound() {
        Mockito.when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> projectService.getProject(1L));
    }

    @Test
    public void testCreateTask() {
        Project p = new Project();
        p.id = 1L;
        p.tasks = new ArrayList<>();

        Mockito.when(projectRepository.findById(1L)).thenReturn(Optional.of(p));

        Task newTask = new Task();
        newTask.title = "New Task";
        newTask.status = "Pending";

        Task result = projectService.createTask(1L, newTask);

        assertEquals("New Task", result.title);
        assertEquals(1, p.tasks.size());
        verify(projectRepository).save(p);
    }

    @Test
    public void testUpdateTask() {
        Project p = new Project();
        p.id = 1L;
        Mockito.when(projectRepository.findById(1L)).thenReturn(Optional.of(p));

        Task t = new Task();
        t.id = 100L;
        t.status = "Pending";
        Mockito.when(taskRepository.findById(100L)).thenReturn(Optional.of(t));

        Task update = new Task();
        update.status = "Done";
        Mockito.when(taskRepository.save(any(Task.class))).thenReturn(t);

        Task result = projectService.updateTask(1L, 100L, update);

        assertEquals("Done", result.status);
    }
}
