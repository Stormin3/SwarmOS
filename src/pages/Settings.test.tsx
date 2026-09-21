import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Settings } from './Settings';

describe('Settings Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders the settings header and default general tab', () => {
    render(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Workspace Details')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    render(<Settings />);

    // Switch to Notifications
    fireEvent.click(screen.getByText('Notifications'));
    expect(screen.getByText('Alert Preferences')).toBeInTheDocument();

    // Switch to Security & Access
    fireEvent.click(screen.getByText('Security & Access'));
    expect(screen.getByText('Authentication')).toBeInTheDocument();

    // Switch to Billing & Usage
    fireEvent.click(screen.getByText('Billing & Usage'));
    expect(screen.getByText('Current Plan')).toBeInTheDocument();

    // Switch to Advanced Settings
    fireEvent.click(screen.getByText('Advanced Settings'));
    expect(screen.getByText('Advanced Configuration')).toBeInTheDocument();
  });

  it('handles save changes button state', () => {
    render(<Settings />);
    const saveButton = screen.getByText('Save Changes');

    fireEvent.click(saveButton);
    expect(screen.getByText('Saved')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('toggles switches in NotificationSettings', () => {
    render(<Settings />);
    fireEvent.click(screen.getByText('Notifications'));

    // System Alerts is defaultChecked={true}
    const systemAlertsToggle = screen.getByText('System Alerts').closest('div')?.nextElementSibling;
    expect(systemAlertsToggle).toHaveClass('bg-indigo-600');

    if (systemAlertsToggle) {
      fireEvent.click(systemAlertsToggle);
      expect(systemAlertsToggle).toHaveClass('bg-neutral-200');
    } else {
      throw new Error('Toggle button not found');
    }
  });
});
