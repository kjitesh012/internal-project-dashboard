import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EditProjectModal from './EditProjectModal';

describe('EditProjectModal Component', () => {
  const mockProject = {
    id: 1,
    name: 'Test Project',
    manager: 'Mike',
    status: 'In Progress',
    deadline: '2024-01-01',
    description: 'Desc',
    progress: 10
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('populates form with initial project data', () => {
    render(<EditProjectModal project={mockProject} onClose={() => {}} onSave={() => {}} />);
    
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mike')).toBeInTheDocument();
    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Desc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', () => {
    const onCloseMock = vi.fn();
    render(<EditProjectModal project={mockProject} onClose={onCloseMock} onSave={() => {}} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('submits updated project successfully', async () => {
    const onSaveMock = vi.fn();
    const onCloseMock = vi.fn();
    
    const updatedProject = { ...mockProject, name: 'Updated Project' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(updatedProject)
    });

    render(<EditProjectModal project={mockProject} onClose={onCloseMock} onSave={onSaveMock} />);
    
    const nameInput = screen.getByDisplayValue('Test Project');
    fireEvent.change(nameInput, { target: { value: 'Updated Project', name: 'name' } });
    
    fireEvent.click(screen.getByText('Save Changes'));
    
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/projects/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated Project',
        manager: 'Mike',
        status: 'In Progress',
        deadline: '2024-01-01',
        description: 'Desc',
        progress: 10
      })
    });
    
    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith(updatedProject);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
