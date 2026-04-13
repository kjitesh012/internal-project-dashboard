import { statusOptions, statusBadge } from './statusConfig';

describe('statusConfig', () => {
  it('exports expected statusOptions', () => {
    expect(statusOptions).toEqual(['All', 'In Progress', 'Completed', 'On Hold']);
  });

  it('exports expected statusBadge mappings', () => {
    expect(statusBadge['In Progress']).toBe('badge-progress');
    expect(statusBadge['Completed']).toBe('badge-completed');
    expect(statusBadge['On Hold']).toBe('badge-onhold');
  });
});
