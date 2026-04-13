import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
  it('renders progress correctly based on value', () => {
    const { container } = render(<ProgressBar value={45} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
    
    // Using container query to check internal styling
    const fillElement = container.querySelector('.progress-fill');
    expect(fillElement).toHaveStyle('width: 45%');
  });
});
