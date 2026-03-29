import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsPanel } from './NotificationsPanel';

describe('NotificationsPanel', () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<NotificationsPanel isOpen={false} onClose={onCloseMock} />);
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('renders the panel with notifications when isOpen is true', () => {
    render(<NotificationsPanel isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // Check initial unread count based on INITIAL_NOTIFICATIONS (assuming 4 initial unread)
    expect(screen.getByText(/4 items need your attention/i)).toBeInTheDocument();

    // Check for some expected notification titles
    expect(screen.getByText('Critical: Needs your attention before we can continue')).toBeInTheDocument();
    expect(screen.getByText('App Updates Available')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const { container } = render(<NotificationsPanel isOpen={true} onClose={onCloseMock} />);

    const closeBtn = container.querySelector('button.p-2.text-neutral-400');
    expect(closeBtn).toBeInTheDocument();

    if (closeBtn) {
       fireEvent.click(closeBtn);
    }

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('resolves a notification and updates the unread count when action button is clicked', () => {
    render(<NotificationsPanel isOpen={true} onClose={onCloseMock} />);

    // Verify initial count
    expect(screen.getByText(/4 items need your attention/i)).toBeInTheDocument();

    // Find a specific action button, e.g., "Grant Permission"
    const actionButton = screen.getByText('Grant Permission');
    expect(actionButton).toBeInTheDocument();

    // Click the action button
    fireEvent.click(actionButton);

    // After clicking, the button should disappear
    expect(screen.queryByText('Grant Permission')).not.toBeInTheDocument();

    // The unread count should update
    expect(screen.getByText(/3 items need your attention/i)).toBeInTheDocument();
  });

  it('resolves multiple notifications', () => {
    render(<NotificationsPanel isOpen={true} onClose={onCloseMock} />);

    // Find action buttons
    const btn1 = screen.getByText('Grant Permission');
    const btn2 = screen.getByText('View Logs & Fix');

    // Click them
    fireEvent.click(btn1);
    fireEvent.click(btn2);

    // Check updated count
    expect(screen.getByText(/2 items need your attention/i)).toBeInTheDocument();
  });
});
