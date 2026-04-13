/**
 * projectService
 * API client functions for fetching and updating project data from the backend.
 */
      return response.ok;
    } catch (error) {
      console.error('deleteTask error:', error);
      throw error;
    }
  },

  /**
   * Get a specific task
   */
  getTask: async (projectId, taskId) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`);
      if (!response.ok) throw new Error(`Failed to fetch task ${taskId}`);
      return await response.json();
    } catch (error) {
      console.error('getTask error:', error);
      throw error;
    }
  }
};

export default projectAPI;
