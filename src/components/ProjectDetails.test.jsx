import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProjectDetails from './ProjectDetails';

// Mock child components to isolate ProjectDetails
vi.mock('./ProgressBar', () => ({
  default: ({ value }) => <div data-testid="mock-progress-bar">{value}%</div>
}));

vi.mock('./TaskList', () => ({
  default: ({ tasks }) => <div data-testid="mock-task-list">Tasks: {tasks.length}</div>
}));

vi.mock('./AddTaskForm', () => ({
  default: ({ onCancel }) => (
    <div data-testid="mock-add-task-form">
      <button onClick={onCancel}>Cancel Add</button>
    </div>
  )
}));

vi.mock('./EditProjectModal', () => ({
  default: ({ onClose }) => (
    <div data-testid="mock-edit-modal">
      <button onClick={onClose}>Close Edit</button>
    </div>
  )
}));

describe('ProjectDetails Component', () => {
  const mockProject = {
    id: 1,
    name: 'Atlas Project',
    manager: 'John Smith',
    status: 'In Progress',
    deadline: '2025-12-31',
    description: 'This is a description.',
    progress: 50,
    tasks: [{ id: 1, title: 'Task 1', status: 'Pending' }]
  };

  it('renders empty state when no project is provided', () => {
    render(<ProjectDetails project={null} />);
    expect(screen.getByText('Select a project to view details.')).toBeInTheDocument();
  });

  it('renders project details when provided', () => {
    render(<ProjectDetails project={mockProject} />);
    expect(screen.getByText('Atlas Project')).toBeInTheDocument();
    expect(screen.getByText('Managed by John Smith')).toBeInTheDocument();
    expect(screen.getByText('Deadline 2025-12-31')).toBeInTheDocument();
    expect(screen.getByText('This is a description.')).toBeInTheDocument();
    
    // Child components
    expect(screen.getByTestId('mock-progress-bar')).toHaveTextContent('50%');
    expect(screen.getByTestId('mock-task-list')).toHaveTextContent('Tasks: 1');
  });

  it('toggles edit modal when edit button is clicked', () => {
    render(<ProjectDetails project={mockProject} />);
    
    const editBtn = screen.getByTitle('Edit project');
    fireEvent.click(editBtn);
    expect(screen.getByTestId('mock-edit-modal')).toBeInTheDocument();
    
    const closeBtn = screen.getByText('Close Edit');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('mock-edit-modal')).not.toBeInTheDocument();
  });

  it('toggles add task form', () => {
    render(<ProjectDetails project={mockProject} />);
    
    const addBtn = screen.getByText('+ Task');
    fireEvent.click(addBtn);
    expect(screen.getByTestId('mock-add-task-form')).toBeInTheDocument();
    
    const cancelBtn = screen.getByText('Cancel Add');
    fireEvent.click(cancelBtn);
    expect(screen.queryByTestId('mock-add-task-form')).not.toBeInTheDocument();
  });
});
