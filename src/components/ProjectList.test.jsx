import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProjectList from './ProjectList';

describe('ProjectList Component', () => {
  const mockProjects = [
    { id: 1, name: 'Project A', manager: 'Alice', status: 'In Progress' },
    { id: 2, name: 'Project B', manager: 'Bob', status: 'Completed' }
  ];

  it('renders loading state', () => {
    render(<ProjectList loading={true} projects={[]} onSelectProject={() => {}} />);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('renders empty state when no projects are provided', () => {
    render(<ProjectList loading={false} projects={[]} onSelectProject={() => {}} />);
    expect(screen.getByText('No projects found.')).toBeInTheDocument();
  });

  it('renders a list of projects', () => {
    render(<ProjectList loading={false} projects={mockProjects} onSelectProject={() => {}} />);
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });
});
