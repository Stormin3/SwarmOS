import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationsPanel } from './NotificationsPanel';

describe('NotificationsPanel', () => {
  it('renders nothing when isOpen is false', () => {
    render(<NotificationsPanel isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('renders the panel when isOpen is true', () => {
    render(<NotificationsPanel isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays the correct initial unread count', () => {
    render(<NotificationsPanel isOpen={true} onClose={() => {}} />);
    // INITIAL_NOTIFICATIONS has 4 items, none of which are resolved initially
    expect(screen.getByText('4 items need your attention')).toBeInTheDocument();
  });

  it('resolves a notification when the action button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationsPanel isOpen={true} onClose={() => {}} />);

    // Check initial state
    expect(screen.getByText('4 items need your attention')).toBeInTheDocument();

    // Find the first action button
    const actionButton = screen.getByRole('button', { name: /Grant Permission/i });
    expect(actionButton).toBeInTheDocument();

    // Click the action button
    await user.click(actionButton);

    // After clicking, the button should disappear
    expect(screen.queryByRole('button', { name: /Grant Permission/i })).not.toBeInTheDocument();

    // The unread count should decrease to 3
    expect(screen.getByText('3 items need your attention')).toBeInTheDocument();

    // The visual state of the resolved notification should change
    // We can infer this by checking if the action button is gone, which we already did
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onCloseMock = vi.fn();
    render(<NotificationsPanel isOpen={true} onClose={onCloseMock} />);

    // In lucide-react, the X icon is rendered as an SVG.
    // The close button is the only button in the header.
    // Let's find it by looking for the closest button to the "Notifications" heading
    const header = screen.getByText('Notifications').closest('.p-6');
    const closeButton = header?.querySelector('button');

    if (closeButton) {
      await user.click(closeButton);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Close button not found');
    }
  });
});
