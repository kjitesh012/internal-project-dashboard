import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AddTaskForm from './AddTaskForm';

describe('AddTaskForm Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the form fields', () => {
    render(<AddTaskForm projectId={1} onTaskAdded={() => {}} onCancel={() => {}} />);
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('submits a new task successfully', async () => {
    const newTask = { id: 3, title: 'New Task', status: 'Pending' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newTask)
    });
    
    const onTaskAddedMock = vi.fn();
    render(<AddTaskForm projectId={1} onTaskAdded={onTaskAddedMock} onCancel={() => {}} />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value: 'New Task' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/projects/1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Task', status: 'Pending' })
    });
    
    await waitFor(() => {
      expect(onTaskAddedMock).toHaveBeenCalledWith(newTask);
      // form should be reset
      expect(screen.getByPlaceholderText('Task title').value).toBe('');
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancelMock = vi.fn();
    render(<AddTaskForm projectId={1} onTaskAdded={() => {}} onCancel={onCancelMock} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancelMock).toHaveBeenCalled();
  });
});
