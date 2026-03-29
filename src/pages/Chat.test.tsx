import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import { Chat } from './Chat';
import { MOCK_AGENTS } from '../data/mockAgents';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams()],
}));

// Mock @google/genai Live API
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Mock response from agent',
        }),
      },
      clients: {
        createLiveConnect: vi.fn().mockResolvedValue({
          session: vi.fn().mockResolvedValue({
            close: vi.fn(),
          }),
        }),
      },
    })),
    Modality: {
      TEXT: 'TEXT',
      AUDIO: 'AUDIO',
    },
  };
});

describe('Chat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders the list of agents from MOCK_AGENTS', () => {
    render(<Chat />);
    MOCK_AGENTS.forEach(agent => {
      expect(screen.getAllByText(agent.name)[0]).toBeInTheDocument();
      expect(screen.getAllByText(agent.role)[0]).toBeInTheDocument();
    });
  });

  it('selects the default agent and displays their name in the header', () => {
    render(<Chat />);
    const defaultAgent = MOCK_AGENTS[0];

    // The header should contain the agent's name
    const headers = screen.getAllByText(defaultAgent.name);
    expect(headers.length).toBeGreaterThan(1); // One in sidebar, one in header

    // Verify department and voice are displayed
    expect(screen.getByText(new RegExp(`${defaultAgent.department} • Voice: ${defaultAgent.voice}`))).toBeInTheDocument();
  });

  it('changes the active agent when clicking on an agent from the sidebar', () => {
    render(<Chat />);
    const newAgent = MOCK_AGENTS[1];

    // Click on the second agent in the sidebar
    // We use getAllByText because the name might be in the list
    const agentButton = screen.getAllByText(newAgent.name)[0].closest('button');
    fireEvent.click(agentButton!);

    // Verify the header updated to the new agent
    expect(screen.getByText(new RegExp(`${newAgent.department} • Voice: ${newAgent.voice}`))).toBeInTheDocument();
  });

  it('allows typing a message and clicking send, updating the UI', async () => {
    render(<Chat />);
    const activeAgent = MOCK_AGENTS[0];

    const input = screen.getByPlaceholderText(`Message ${activeAgent.name}...`);
    const sendButton = input.nextElementSibling as HTMLButtonElement;

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    expect(input).toHaveValue('Hello agent!');

    // Send the message
    fireEvent.click(sendButton);

    // The user's message should appear in the chat
    expect(screen.getByText('Hello agent!')).toBeInTheDocument();

    // The input should be cleared
    expect(input).toHaveValue('');

    // Fast forward the mock timer and wait for state updates
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Wait for the mock agent response
    // Based on the component implementation, the mock response is hardcoded to include the agent name
    await waitFor(() => {
      expect(screen.getByText(`I am ${activeAgent.name}. I received your message: "Hello agent!"`)).toBeInTheDocument();
    });
  });
});
