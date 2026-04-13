import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProjectFilters from './ProjectFilters';

describe('ProjectFilters Component', () => {
  const defaultProps = {
    search: '',
    setSearch: vi.fn(),
    statusFilter: 'All',
    setStatusFilter: vi.fn(),
    filtered: [],
    loading: false,
    onSelectProject: vi.fn()
  };

  it('renders correctly with given filters', () => {
    render(<ProjectFilters {...defaultProps} />);
    
    expect(screen.getByText('Project Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by project or manager')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('calls setSearch on input change', () => {
    const setSearchMock = vi.fn();
    render(<ProjectFilters {...defaultProps} setSearch={setSearchMock} />);
    
    fireEvent.change(screen.getByPlaceholderText('Search by project or manager'), { target: { value: 'Apollo' } });
    expect(setSearchMock).toHaveBeenCalledWith('Apollo');
  });

  it('calls setStatusFilter when a status button is clicked', () => {
    const setStatusFilterMock = vi.fn();
    render(<ProjectFilters {...defaultProps} setStatusFilter={setStatusFilterMock} />);
    
    fireEvent.click(screen.getByText('Completed'));
    expect(setStatusFilterMock).toHaveBeenCalledWith('Completed');
  });
});
