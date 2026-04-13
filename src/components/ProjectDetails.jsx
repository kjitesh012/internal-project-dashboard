/**
 * ProjectDetails Component
 * Displays the comprehensive view of a project, including its tasks and manager info.
 */
import React, { useState, useEffect } from 'react';
import { statusBadge } from './statusConfig';
import ProgressBar from './ProgressBar';
import TaskList from './TaskList';
import EditProjectModal from './EditProjectModal';
import AddTaskForm from './AddTaskForm';

function ProjectDetails({ project, onProjectUpdated }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [projectData, setProjectData] = useState(project);

  // Update projectData when project prop changes
  useEffect(() => {
    setProjectData(project);
    setShowEditModal(false);
    setShowAddTaskForm(false);
  }, [project]);

  /**
   * Pushes the locally updated project structure upward to the App shell.
   * @param {Object} updatedProject - The modified project context.
   */
  const handleProjectSave = (updatedProject) => {
    setProjectData(updatedProject);
    if (onProjectUpdated) {
      onProjectUpdated(updatedProject);
    }
  };

  /**
   * Appends a newly created task to the local component state.
   * @param {Object} newTask - The task returned from the API.
   */
  const handleTaskAdded = (newTask) => {
    setProjectData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    setShowAddTaskForm(false);
  };

  /**
   * Removes a task from tracking bounds upon deletion via the TaskList component.
   * @param {number} taskId - The ID of the task that was deleted.
   */
  const handleTaskDeleted = (taskId) => {
    setProjectData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  /**
   * Updates an internal task in place when its status or details change.
   * @param {Object} updatedTask - The exact task response from the mutation action.
   */
  const handleTaskUpdated = (updatedTask) => {
    setProjectData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  return (
    <section className="panel details-panel">
      <div className="panel-header">
        <h2>Project details</h2>
        {projectData && (
          <div className="header-actions">
            <span className="deadline">Deadline {projectData.deadline}</span>
            <button 
              className="btn-edit" 
              onClick={() => setShowEditModal(true)}
              title="Edit project"
            >
              ✎ Edit
            </button>
          </div>
        )}
      </div>

      {!projectData ? (
        <div className="empty-state">Select a project to view details.</div>
      ) : (
        <div className="details-content">
          <div className="detail-row">
            <div>
              <h3>{projectData.name}</h3>
              <p className="subtitle">Managed by {projectData.manager}</p>
            </div>
            <span className={`badge ${statusBadge[projectData.status]}`}>{projectData.status}</span>
          </div>

          <ProgressBar value={projectData.progress} />

          <p className="project-description">{projectData.description}</p>

          <div className="tasks-section">
            <div className="section-heading">
              <h3>Associated tasks</h3>
              <span>{projectData.tasks.length} items</span>
              <button 
                className="btn-add" 
                onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              >
                {showAddTaskForm ? '−' : '+'} Task
              </button>
            </div>

            {showAddTaskForm && (
              <AddTaskForm 
                projectId={projectData.id}
                onTaskAdded={handleTaskAdded}
                onCancel={() => setShowAddTaskForm(false)}
                existingTasks={projectData.tasks}
              />
            )}

            <TaskList 
              tasks={projectData.tasks}
              projectId={projectData.id}
              onTaskDeleted={handleTaskDeleted}
              onTaskUpdated={handleTaskUpdated}
            />
          </div>
        </div>
      )}

      {showEditModal && projectData && (
        <EditProjectModal
          project={projectData}
          onClose={() => setShowEditModal(false)}
          onSave={handleProjectSave}
        />
      )}
    </section>
  );
}

export default ProjectDetails;

