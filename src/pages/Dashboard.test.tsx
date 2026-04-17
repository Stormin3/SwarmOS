import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from './Dashboard';

vi.mock('../data/mockAgents', () => ({
  MOCK_AGENTS: [
    {
      id: "1",
      name: "Agent 1",
      role: "Role 1",
      avatarUrl: "url1",
      status: "active",
    },
    {
      id: "2",
      name: "Agent 2",
      role: "Role 2",
      avatarUrl: "url2",
      status: "idle",
    },
    {
      id: "3",
      name: "Agent 3",
      role: "Role 3",
      avatarUrl: "url3",
      status: "offline",
    }
  ]
}));

describe('Dashboard Component', () => {
  it('renders the overview heading', () => {
    render(<Dashboard />);
    expect(screen.getByText('Swarm Overview')).toBeInTheDocument();
  });

  it('calculates and displays correct agent statistics', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Agents')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Active Agents')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders the agent status list', () => {
    render(<Dashboard />);
    expect(screen.getByText('Agent Status')).toBeInTheDocument();
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Role 1')).toBeInTheDocument();
    expect(screen.getByText('Agent 2')).toBeInTheDocument();
    expect(screen.getByText('Agent 3')).toBeInTheDocument();
  });

  it('renders recent swarm activity', () => {
    render(<Dashboard />);
    expect(screen.getByText('Recent Swarm Activity')).toBeInTheDocument();
    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
  });
});
