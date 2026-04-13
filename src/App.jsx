/**
 * App Component
 * Root component of the React application setting up layout and state management.
 */
import { useEffect, useMemo, useState } from 'react';
import { projects as mockProjects } from './data.js';
import AppHeader from './components/AppHeader';
import ProjectDetails from './components/ProjectDetails';
import ProjectFilters from './components/ProjectFilters';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
        setSelectedId(data[0]?.id ?? null);
        setBackendError(null);
      } catch (error) {
        console.warn('Backend not available, using mock data:', error.message);
        setProjects(mockProjects);
        setSelectedId(mockProjects[0]?.id ?? null);
        setBackendError('Backend not running. Using mock data. Start server on http://localhost:8080');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  /**
   * Pure computational hook that filters the projects array safely without modifying core state.
   * Applies both search term matching and categorical status matching uniformly.
   * @returns {Array} The subset list of projects visible to the user.
   */
  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        project.name.toLowerCase().includes(query) ||
        project.manager.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);
      return matchesStatus && (!query || matchesSearch);
    });
  }, [projects, statusFilter, search]);

  const selectedProject = projects.find((project) => project.id === selectedId) || filtered[0] || null;

  /**
   * Call-back tunnel ensuring deeply nested component mutations safely overwrite the local unified Dashboard state.
   * @param {Object} updatedProject - The synced project context after saves or task modifications.
   */
  const handleProjectUpdated = (updatedProject) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  useEffect(() => {
    if (!selectedProject && filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedProject]);

  return (
    <div className="app-shell">
      <AppHeader />
      
      {backendError && (
        <div style={{ 
          padding: '12px 24px', 
          background: '#fef3c7', 
          borderBottom: '1px solid #fcd34d',
          color: '#92400e',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          ⚠️ {backendError}
        </div>
      )}

      <main className="dashboard-grid">
        <ProjectFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filtered={filtered}
          selectedProject={selectedProject}
          onSelectProject={setSelectedId}
          loading={loading}
        />

        <ProjectDetails project={selectedProject} onProjectUpdated={handleProjectUpdated} />
      </main>
    </div>
  );
}

export default App;
