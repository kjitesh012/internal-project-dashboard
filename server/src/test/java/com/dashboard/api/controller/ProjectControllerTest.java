package com.dashboard.api.controller;

import com.dashboard.api.model.Project;
import com.dashboard.api.model.Task;
import com.dashboard.api.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ProjectControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        objectMapper = new ObjectMapper();
        
        // Manual stub to avoid Mockito concrete class limitations on JDK 25
        ProjectService stubService = new ProjectService(null, null, null) {
            @Override
            public List<Project> getAllProjects() {
                Project p = new Project();
                p.id = 1L;
                p.name = "Test Project";
                return Collections.singletonList(p);
            }

            @Override
            public Project updateProject(Long id, Project updates) {
                Project result = new Project();
                result.id = id;
                result.name = updates.name != null ? updates.name : "Updated";
                return result;
            }
        };

        ProjectController controller = new ProjectController(stubService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testGetAllProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Project"));
    }

    @Test
    public void testUpdateProject() throws Exception {
        Project update = new Project();
        update.name = "Updated";

        mockMvc.perform(put("/api/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));
    }
}
