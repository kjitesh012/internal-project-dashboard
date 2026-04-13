import React from 'react';
import { statusOptions } from './statusConfig';
import ProjectList from './ProjectList';

function ProjectFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  filtered,
  selectedProject,
  onSelectProject,
  loading
}) {
  return (
    <section className="panel filters-panel">
      <div className="panel-header">
        <h2>Project Filters</h2>
        <span>{filtered.length} projects</span>
      </div>

      <div className="filter-row">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by project or manager"
        />
      </div>

      <div className="filter-row">
        <label>Status</label>
        <div className="status-buttons">
          {statusOptions.map((value) => (
            <button
              key={value}
              type="button"
              className={value === statusFilter ? 'status active' : 'status'}
              onClick={() => setStatusFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <ProjectList
        loading={loading}
        projects={filtered}
        selectedProject={selectedProject}
        onSelectProject={onSelectProject}
      />
    </section>
  );
}

export default ProjectFilters;
