import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AIEcoGuardian from './AIEcoGuardian';

// Mock fetch API globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AIEcoGuardian', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders initial state, welcome message and wisdom quote', () => {
    render(<AIEcoGuardian ledgerEntries={[]} onAddChallenge={vi.fn()} />);

    expect(screen.getByText(/Greetings! I'm Ember, your dedicated AI Eco-Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/Planetary Wisdom/i)).toBeInTheDocument();
  });

  it('allows cycling wisdom quotes', () => {
    const { container } = render(<AIEcoGuardian ledgerEntries={[]} onAddChallenge={vi.fn()} />);

    const cycleWisdomBtn = container.querySelector('#btn-rotate-advisor-wisdom-quote');
    expect(cycleWisdomBtn).toBeInTheDocument();

    fireEvent.click(cycleWisdomBtn);
    expect(screen.getByText(/Planetary Wisdom/i)).toBeInTheDocument();
  });

  it('allows toggling sub-tabs to Predictive Future', () => {
    const { container } = render(<AIEcoGuardian ledgerEntries={[]} onAddChallenge={vi.fn()} />);

    const predictionTabBtn = container.querySelector('#subtab-btn-prediction');
    fireEvent.click(predictionTabBtn);

    expect(screen.getByText(/1-Yr Status Quo/i)).toBeInTheDocument();
    expect(screen.getByText(/Projected Savings/i)).toBeInTheDocument();
  });

  it('allows cycling reflection prompts and submitting an answer', () => {
    const { container } = render(<AIEcoGuardian ledgerEntries={[]} onAddChallenge={vi.fn()} />);

    expect(screen.getByText(/Topic: Standby Phantom Power/i)).toBeInTheDocument();

    const cyclePromptBtn = container.querySelector('#btn-cycle-reflection-prompt');
    fireEvent.click(cyclePromptBtn);

    expect(screen.getByText(/Topic: Ultra-HD Video Streaming/i)).toBeInTheDocument();

    const choiceA = container.querySelector('#btn-reflection-opt-0');
    fireEvent.click(choiceA);

    expect(screen.getByText(/Hidden Habit Advice:/i)).toBeInTheDocument();
  });

  it('submits a user message and renders the mocked AI response', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ text: "Hello! This is simulated guidance on transport options." }),
    });

    const { container } = render(<AIEcoGuardian ledgerEntries={[]} onAddChallenge={vi.fn()} />);

    const inputField = container.querySelector('#chat-console-input-str');
    fireEvent.change(inputField, { target: { value: 'How can I save carbon by cycling?' } });

    const sendBtn = container.querySelector('#btn-trigger-ai-chat');
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Hello! This is simulated guidance on transport options\./i)).toBeInTheDocument();
    });
  });
});
