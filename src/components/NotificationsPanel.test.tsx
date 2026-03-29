import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificationsPanel } from './NotificationsPanel';

describe('NotificationsPanel', () => {
  it('does not render when isOpen is false', () => {
    render(<NotificationsPanel isOpen={false} onClose={vi.fn()} />);

    // The panel should not be visible in the document
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(<NotificationsPanel isOpen={true} onClose={vi.fn()} />);

    // The panel should be visible
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // It should render some initial notifications
    expect(screen.getByText('Critical: Needs your attention before we can continue')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<NotificationsPanel isOpen={true} onClose={handleClose} />);

    // Assuming there's a button with the X icon; we can find it by its SVG, or by querying buttons.
    // The close button is the only button in the header without text. Let's find it.
    // Or simpler, we can just find all buttons and click the one that has no text (the close button).
    // Actually, let's use a selector if possible, or just the first button.
    const buttons = screen.getAllByRole('button');
    // The first button in the panel is the close button
    fireEvent.click(buttons[0]);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('resolves a notification when its action button is clicked', () => {
    render(<NotificationsPanel isOpen={true} onClose={vi.fn()} />);

    // Verify initial unread count text
    expect(screen.getByText('4 items need your attention')).toBeInTheDocument();

    // Find the action button for the first notification
    const actionButton = screen.getByText('Grant Permission');
    expect(actionButton).toBeInTheDocument();

    // Click the action button
    fireEvent.click(actionButton);

    // Verify the unread count text is updated
    expect(screen.getByText('3 items need your attention')).toBeInTheDocument();

    // The action button should disappear
    expect(screen.queryByText('Grant Permission')).not.toBeInTheDocument();

    // The title should still be there
    expect(screen.getByText('Critical: Needs your attention before we can continue')).toBeInTheDocument();
  });
});
