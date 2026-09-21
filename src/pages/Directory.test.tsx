import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Directory } from './Directory';

vi.mock('../data/mockAgents', () => ({
  MOCK_AGENTS: [
    {
      id: "agent-1",
      name: "Test Agent 1",
      role: "Test Role 1",
      department: "Test Dept 1",
      avatarUrl: "https://example.com/avatar1.png",
      voice: "Voice 1",
      status: "active",
      parameters: { temperature: 0.1 }
    },
    {
      id: "agent-2",
      name: "Test Agent 2",
      role: "Test Role 2",
      department: "Test Dept 2",
      avatarUrl: "https://example.com/avatar2.png",
      voice: "Voice 2",
      status: "idle",
      parameters: { temperature: 0.5 }
    }
  ]
}));

describe('Directory Component', () => {
  it('renders the agent directory heading', () => {
    render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );
    expect(screen.getByText('Agent Directory')).toBeInTheDocument();
    expect(screen.getByText('Manage your AI workforce and their configurations.')).toBeInTheDocument();
  });

  it('renders all mocked agents with their details', () => {
    render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Test Role 1')).toBeInTheDocument();
    expect(screen.getByText('Test Dept 1')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();

    expect(screen.getByText('Test Agent 2')).toBeInTheDocument();
    expect(screen.getByText('Test Role 2')).toBeInTheDocument();
    expect(screen.getByText('Test Dept 2')).toBeInTheDocument();
    expect(screen.getByText('idle')).toBeInTheDocument();
  });

  it('shows and hides the hire beta toast notification', async () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );

    const hireButton = screen.getByRole('button', { name: /\+ Hire New Agent/i });
    fireEvent.click(hireButton);

    expect(screen.getByText('Hiring new agents is currently in beta.')).toBeInTheDocument();

    // The close button is the one with the X icon in the toast
    const allButtons = screen.getAllByRole('button');
    const toastCloseButton = allButtons.find(btn => btn.innerHTML.includes('svg'));

    if (toastCloseButton) {
      fireEvent.click(toastCloseButton);
    }

    expect(screen.queryByText('Hiring new agents is currently in beta.')).not.toBeInTheDocument();

    // Test auto-hide
    fireEvent.click(hireButton);
    expect(screen.getByText('Hiring new agents is currently in beta.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Hiring new agents is currently in beta.')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('contains links to config and chat for each agent', () => {
    render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );

    const configLinks = screen.getAllByRole('link', { name: /Config/i });
    const chatLinks = screen.getAllByRole('link', { name: /Chat/i });

    expect(configLinks).toHaveLength(2);
    expect(chatLinks).toHaveLength(2);

    expect(configLinks[0]).toHaveAttribute('href', '/directory/agent-1');
    expect(chatLinks[0]).toHaveAttribute('href', '/chat?agent=agent-1');
  });
});
