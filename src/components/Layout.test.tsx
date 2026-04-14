import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';

describe('Layout component', () => {
  it('renders the layout with sidebar and static text', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByText('SwarmOS')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Agentic Orchestra')).toBeInTheDocument();
  });

  it('opens and closes the mobile menu', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const sidebar = screen.getByText('SwarmOS').closest('aside');
    expect(sidebar).toHaveClass('-translate-x-full');

    const openMenuButton = screen.getByLabelText('Open menu');
    fireEvent.click(openMenuButton);

    expect(sidebar).toHaveClass('translate-x-0');

    const closeMenuButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeMenuButton);

    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('highlights the active navigation item', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Layout />
      </MemoryRouter>
    );
    const projectsLink = screen.getByRole('link', { name: /Projects/i });
    expect(projectsLink).toHaveClass('bg-indigo-50');
    expect(projectsLink).toHaveClass('text-indigo-700');

    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    expect(dashboardLink).not.toHaveClass('bg-indigo-50');
  });

  it('opens notifications panel when bell icon is clicked', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();

    const notificationsBtn = screen.getByLabelText('Open notifications');
    fireEvent.click(notificationsBtn);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div data-testid="outlet-content">Outlet Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });
});
