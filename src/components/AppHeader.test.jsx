import { render, screen } from '@testing-library/react';
import AppHeader from './AppHeader';

describe('AppHeader Component', () => {
  it('renders the header with correct text', () => {
    render(<AppHeader />);
    expect(screen.getByText('Internal Project Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects at a glance')).toBeInTheDocument();
  });
});
