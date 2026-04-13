package com.dashboard.api.service;

import com.dashboard.api.model.Project;
import com.dashboard.api.model.Task;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ProjectFileStore {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Path DATA_FILE = Paths.get("data", "projects.json");

    public List<Project> loadProjects() {
        try {
            if (Files.notExists(DATA_FILE)) {
                Files.createDirectories(DATA_FILE.getParent());
                List<Project> defaultProjects = getDefaultProjects();
                saveProjects(defaultProjects);
                return defaultProjects;
            }

            CollectionType listType = OBJECT_MAPPER.getTypeFactory()
                    .constructCollectionType(List.class, Project.class);

            return OBJECT_MAPPER.readValue(DATA_FILE.toFile(), listType);

        } catch (IOException e) {
            throw new RuntimeException("Failed to load project data", e);
        }
    }

    public void saveProjects(List<Project> projects) {
        try {
            OBJECT_MAPPER.writerWithDefaultPrettyPrinter()
                    .writeValue(DATA_FILE.toFile(), projects);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save project data", e);
        }
    }

    private List<Project> getDefaultProjects() {
        return Arrays.asList(
                new Project(
                        1L,
                        "Edwar Jones",
                        "Ranjat Srivastava",
                        "In Progress",
                        "2026-06-15",
                        "Migrating the legacy HR platform to a new cloud-native architecture.",
                        65,
                        new ArrayList<>(Arrays.asList(
                                new Task(1L, "Requirement review", "Done"),
                                new Task(2L, "Architecture design", "In Progress"),
                                new Task(3L, "Cloud deployment", "Pending")
                        ))
                ),
                new Project(
                        2L,
                        "Q2 Marketing Campaign Analytics",
                        "Priya Sharma",
                        "Completed",
                        "2026-04-30",
                        "Analyze the performance of all digital marketing campaigns from the second quarter.",
                        100,
                        new ArrayList<>(Arrays.asList(
                                new Task(4L, "Data collection", "Done"),
                                new Task(5L, "Report generation", "Done"),
                                new Task(6L, "Stakeholder review", "Done")
                        ))
                ),
                new Project(
                        3L,
                        "Customer Support AI Chatbot",
                        "Sushant Mishra",
                        "On Hold",
                        "2026-09-01",
                        "Develop a new AI-powered chatbot to handle initial customer support queries.",
                        30,
                        new ArrayList<>(Arrays.asList(
                                new Task(7L, "Model evaluation", "In Progress"),
                                new Task(8L, "UI prototype", "Pending"),
                                new Task(9L, "Integration plan", "Pending")
                        ))
                )
        );
    }
}