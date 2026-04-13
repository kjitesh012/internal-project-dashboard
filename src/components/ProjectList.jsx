import React from 'react';
import ProjectCard from './ProjectCard';

function ProjectList({ loading, projects, selectedProject, onSelectProject }) {
  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return <div className="empty-state">No projects found.</div>;
  }

  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={project.id === selectedProject?.id}
          onSelect={onSelectProject}
        />
      ))}
    </div>
  );
}

export default ProjectList;
