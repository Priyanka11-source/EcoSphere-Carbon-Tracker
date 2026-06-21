import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DailyLedger from './DailyLedger';

describe('DailyLedger', () => {
  it('renders presets for transport by default', () => {
    render(<DailyLedger onAddEntry={vi.fn()} entries={[]} onRemoveEntry={vi.fn()} />);
    
    expect(screen.getByText('Petrol Car Commute')).toBeInTheDocument();
    expect(screen.getByText('EV Commute (Clean Grid)')).toBeInTheDocument();
  });

  it('allows switching categories and updates presets', () => {
    render(<DailyLedger onAddEntry={vi.fn()} entries={[]} onRemoveEntry={vi.fn()} />);
    
    // Switch to food category using button id
    const foodTabButton = screen.getByRole('button', { name: /food/i });
    fireEvent.click(foodTabButton);
    
    expect(screen.queryByText('Petrol Car Commute')).not.toBeInTheDocument();
    expect(screen.getByText('Beef or Lamb Dinner')).toBeInTheDocument();
  });

  it('triggers onAddEntry with correct parameters on logging action', () => {
    const onAddEntryMock = vi.fn();
    const { container } = render(<DailyLedger onAddEntry={onAddEntryMock} entries={[]} onRemoveEntry={vi.fn()} />);

    // Custom entry description
    const descInput = container.querySelector('#ledger-label-input');
    fireEvent.change(descInput, { target: { value: 'My Custom Ride' } });

    // Custom quantity
    const quantityInput = container.querySelector('#ledger-quantity-input');
    fireEvent.change(quantityInput, { target: { value: '10' } });

    // Submit button
    const submitButton = container.querySelector('#btn-log-adventure-ledger');
    fireEvent.click(submitButton);

    expect(onAddEntryMock).toHaveBeenCalledTimes(1);
    const addedEntry = onAddEntryMock.mock.calls[0][0];
    
    expect(addedEntry.description).toBe('My Custom Ride');
    expect(addedEntry.value).toBe(10);
    expect(addedEntry.category).toBe('transport');
    expect(addedEntry.carbonImpact).toBe(2.8); // 10 * 0.28 = 2.80
    expect(addedEntry.isReduction).toBe(false);
  });

  it('correctly calculates reduction/offset presets', () => {
    const onAddEntryMock = vi.fn();
    const { container } = render(<DailyLedger onAddEntry={onAddEntryMock} entries={[]} onRemoveEntry={vi.fn()} />);

    // Click "Bicycle or Walking Trip" preset (Preset index 3 in CategoryPresets.transport)
    const bicyclePresetButton = screen.getByText('Bicycle or Walking Trip');
    fireEvent.click(bicyclePresetButton);

    // Custom quantity
    const quantityInput = container.querySelector('#ledger-quantity-input');
    fireEvent.change(quantityInput, { target: { value: '5' } });

    const submitButton = container.querySelector('#btn-log-adventure-ledger');
    fireEvent.click(submitButton);

    expect(onAddEntryMock).toHaveBeenCalledTimes(1);
    const addedEntry = onAddEntryMock.mock.calls[0][0];
    
    expect(addedEntry.description).toBe('Bicycle or Walking Trip');
    expect(addedEntry.value).toBe(5);
    expect(addedEntry.carbonImpact).toBe(1.2); // 5 * 0.24 = 1.2
    expect(addedEntry.isReduction).toBe(true);
  });
});
