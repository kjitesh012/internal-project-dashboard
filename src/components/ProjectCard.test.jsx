import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProjectCard from './ProjectCard';

describe('ProjectCard Component', () => {
  const mockProject = {
    id: 1,
    name: 'Apollo Refactoring',
    manager: 'Jane Doe',
    status: 'In Progress'
  };

  it('renders project details correctly', () => {
    render(<ProjectCard project={mockProject} selected={false} onSelect={() => {}} />);
    expect(screen.getByText('Apollo Refactoring')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('applies selected class when selected is true', () => {
    const { container } = render(<ProjectCard project={mockProject} selected={true} onSelect={() => {}} />);
    expect(container.firstChild).toHaveClass('selected');
  });

  it('triggers onSelect with project id when clicked', () => {
    const onSelectMock = vi.fn();
    const { container } = render(<ProjectCard project={mockProject} selected={false} onSelect={onSelectMock} />);
    
    fireEvent.click(container.firstChild);
    expect(onSelectMock).toHaveBeenCalledWith(1);
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });
});
