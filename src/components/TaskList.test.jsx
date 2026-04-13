import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', status: 'Pending' },
    { id: 2, title: 'Task 2', status: 'In Progress' }
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the list of tasks', () => {
    render(<TaskList tasks={mockTasks} projectId={1} onTaskDeleted={() => {}} onTaskUpdated={() => {}} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('handles task deletion successfully', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    const onTaskDeletedMock = vi.fn();
    
    render(<TaskList tasks={mockTasks} projectId={1} onTaskDeleted={onTaskDeletedMock} onTaskUpdated={() => {}} />);
    
    const deleteButtons = screen.getAllByTitle('Delete task');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/projects/1/tasks/1', {
      method: 'DELETE'
    });
    
    await waitFor(() => {
      expect(onTaskDeletedMock).toHaveBeenCalledWith(1);
    });
  });

  it('handles status updates successfully', async () => {
    global.fetch.mockResolvedValueOnce({ 
      ok: true, 
      json: () => Promise.resolve({ id: 1, title: 'Task 1', status: 'Done' }) 
    });
    const onTaskUpdatedMock = vi.fn();
    
    render(<TaskList tasks={mockTasks} projectId={1} onTaskDeleted={() => {}} onTaskUpdated={onTaskUpdatedMock} />);
    
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Done' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/projects/1/tasks/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Done' })
      });
      expect(onTaskUpdatedMock).toHaveBeenCalled();
    });
  });
});
