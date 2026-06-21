import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EnvironmentalInsights from './EnvironmentalInsights';

const mockLedgerEntries = [
  { id: '1', category: 'transport', description: 'Driving', value: 10, unit: 'km', carbonImpact: 2.8, isReduction: false, date: 'Jun 21, 2026' },
  { id: '2', category: 'food', description: 'Beef', value: 1, unit: 'meal', carbonImpact: 7.2, isReduction: false, date: 'Jun 21, 2026' },
];

const mockWeeklyChallenges = [
  { id: 'ch-1', title: 'Meatless Monday Month', description: '...', category: 'food', co2SavedPerDay: 2.2, completed: false, daysDuration: 4, daysSucceeded: 1 }
];

describe('EnvironmentalInsights', () => {
  it('calculates emission percentages correctly', () => {
    render(
      <EnvironmentalInsights
        ledgerEntries={mockLedgerEntries}
        weeklyChallenges={[]}
        onCommitOptInChallenge={vi.fn()}
        onUpdateChallengeProgress={vi.fn()}
        onGrantKarmaBonus={vi.fn()}
      />
    );

    // Total emissions = 2.8 (Transport) + 7.2 (Food) = 10.0 kg
    // Transport percentage = 2.8 / 10 = 28%
    // Food percentage = 7.2 / 10 = 72%
    expect(screen.getByText('28% (2.8 kg)')).toBeInTheDocument();
    expect(screen.getByText('72% (7.2 kg)')).toBeInTheDocument();
  });

  it('allows opting in to a challenge', () => {
    const onCommitMock = vi.fn();
    render(
      <EnvironmentalInsights
        ledgerEntries={[]}
        weeklyChallenges={[]}
        onCommitOptInChallenge={onCommitMock}
        onUpdateChallengeProgress={vi.fn()}
        onGrantKarmaBonus={vi.fn()}
      />
    );

    const optInButtons = screen.getAllByRole('button', { name: /opt-in/i });
    expect(optInButtons.length).toBeGreaterThan(0);
    fireEvent.click(optInButtons[0]);

    expect(onCommitMock).toHaveBeenCalledTimes(1);
    expect(onCommitMock.mock.calls[0][0].title).toBe('Meatless Monday Month');
  });

  it('allows logging progress on active challenge', () => {
    const onUpdateProgressMock = vi.fn();
    render(
      <EnvironmentalInsights
        ledgerEntries={[]}
        weeklyChallenges={mockWeeklyChallenges}
        onCommitOptInChallenge={vi.fn()}
        onUpdateChallengeProgress={onUpdateProgressMock}
        onGrantKarmaBonus={vi.fn()}
      />
    );

    const logProgressBtn = screen.getByRole('button', { name: /log progress/i });
    fireEvent.click(logProgressBtn);

    expect(onUpdateProgressMock).toHaveBeenCalledTimes(1);
    expect(onUpdateProgressMock).toHaveBeenCalledWith('ch-1', 2, false);
  });

  it('completing active challenge triggers karma bonus and displays celebration modal', () => {
    const onUpdateProgressMock = vi.fn();
    const onGrantKarmaMock = vi.fn();
    const activeChallengeNearCompletion = [
      { id: 'ch-1', title: 'Meatless Monday Month', description: '...', category: 'food', co2SavedPerDay: 2.2, completed: false, daysDuration: 4, daysSucceeded: 3 }
    ];

    render(
      <EnvironmentalInsights
        ledgerEntries={[]}
        weeklyChallenges={activeChallengeNearCompletion}
        onCommitOptInChallenge={vi.fn()}
        onUpdateChallengeProgress={onUpdateProgressMock}
        onGrantKarmaBonus={onGrantKarmaMock}
      />
    );

    const logProgressBtn = screen.getByRole('button', { name: /log progress/i });
    fireEvent.click(logProgressBtn);

    expect(onUpdateProgressMock).toHaveBeenCalledWith('ch-1', 4, true);
    expect(onGrantKarmaMock).toHaveBeenCalledWith(50);
    expect(screen.getByText('Achievement Complete!')).toBeInTheDocument();
  });

  it('allows rotating advice in Ember advice bubble', () => {
    render(
      <EnvironmentalInsights
        ledgerEntries={[]}
        weeklyChallenges={[]}
        onCommitOptInChallenge={vi.fn()}
        onUpdateChallengeProgress={vi.fn()}
        onGrantKarmaBonus={vi.fn()}
      />
    );

    const initialAdviceText = screen.getByText(/"Your carbon footprint looks highly efficient today! Perfect clean canvas."/i);
    expect(initialAdviceText).toBeInTheDocument();

    const adviceBubble = screen.getByTitle('Click for next tailored eco-advice!');
    fireEvent.click(adviceBubble);

    const rotatedAdviceText = screen.getByText(/"Perfect biosphere equilibrium! Zero active emissions detected in the atmospheric meters."/i);
    expect(rotatedAdviceText).toBeInTheDocument();
  });
});
