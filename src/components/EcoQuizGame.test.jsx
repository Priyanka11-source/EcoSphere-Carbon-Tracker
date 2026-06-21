import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EcoQuizGame from './EcoQuizGame';

describe('EcoQuizGame', () => {
  it('renders the initial quiz state', () => {
    render(<EcoQuizGame />);
    expect(screen.getByText(/EcoSphere Climate Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Under equal product weights, which of the following foods releases the highest aggregate greenhouse emissions\?/i)).toBeInTheDocument();
    expect(screen.getByText('Q: 1 / 4')).toBeInTheDocument();
  });

  it('navigates through questions and tallies score', () => {
    const { container } = render(<EcoQuizGame />);

    // Q1 Correct: Grass-Fed Beef Herding
    let choiceButton = screen.getByText('Grass-Fed Beef Herding');
    fireEvent.click(choiceButton);
    expect(screen.getByText(/Fact Check:/i)).toBeInTheDocument();

    // Click Continue
    let continueBtn = container.querySelector('#btn-quiz-advance');
    fireEvent.click(continueBtn);

    // Q2 Correct: Around 400 grams
    expect(screen.getByText(/How much carbon dioxide does an average standard passenger car release per mile driven globally\?/i)).toBeInTheDocument();
    choiceButton = screen.getByText('Around 400 grams');
    fireEvent.click(choiceButton);
    
    continueBtn = container.querySelector('#btn-quiz-advance');
    fireEvent.click(continueBtn);

    // Q3 Correct: Leaving device accessories plugged in standby
    choiceButton = screen.getByText('Leaving device accessories plugged in standby');
    fireEvent.click(choiceButton);

    continueBtn = container.querySelector('#btn-quiz-advance');
    fireEvent.click(continueBtn);

    // Q4 Correct: High-Speed Passenger Train
    choiceButton = screen.getByText('High-Speed Passenger Train');
    fireEvent.click(choiceButton);

    continueBtn = container.querySelector('#btn-quiz-advance');
    fireEvent.click(continueBtn);

    // Should show results page
    expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
    expect(screen.getByText('100 / 100 PTS')).toBeInTheDocument();

    // Test retry/reset
    const retryBtn = container.querySelector('#btn-quiz-reset');
    fireEvent.click(retryBtn);

    expect(screen.getByText(/Under equal product weights, which of the following foods releases the highest aggregate greenhouse emissions\?/i)).toBeInTheDocument();
  });
});
