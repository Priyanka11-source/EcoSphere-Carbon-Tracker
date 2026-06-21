import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActiveEcoGarden from './ActiveEcoGarden';

describe('ActiveEcoGarden', () => {
  it('renders healthy state status correctly', () => {
    render(<ActiveEcoGarden averageFootprint={5.5} totalCarbonSaved={10} ledgerEntries={[]} />);
    
    expect(screen.getByText(/Flourishing Sanctuary/i)).toBeInTheDocument();
    expect(screen.getByText(/System Index: 5.5 kg CO2e \/ day/i)).toBeInTheDocument();
  });

  it('renders moderate state status correctly', () => {
    render(<ActiveEcoGarden averageFootprint={12.0} totalCarbonSaved={10} ledgerEntries={[]} />);
    
    expect(screen.getByText(/Unbalanced Dome/i)).toBeInTheDocument();
  });

  it('renders poor state status correctly', () => {
    render(<ActiveEcoGarden averageFootprint={20.0} totalCarbonSaved={10} ledgerEntries={[]} />);
    
    expect(screen.getByText(/Endangered Eco-Dome/i)).toBeInTheDocument();
  });

  it('toggles views between dome and forest', () => {
    const { container } = render(<ActiveEcoGarden averageFootprint={5.5} totalCarbonSaved={10} ledgerEntries={[]} />);
    
    expect(screen.getByText(/LIVING ATMOSPHERE/i)).toBeInTheDocument();
    
    const forestBtn = container.querySelector('#btn-toggle-viewtype-forest');
    fireEvent.click(forestBtn);
    expect(screen.getByText(/CARBON CO2 SINK/i)).toBeInTheDocument();

    const domeBtn = container.querySelector('#btn-toggle-viewtype-dome');
    fireEvent.click(domeBtn);
    expect(screen.getByText(/LIVING ATMOSPHERE/i)).toBeInTheDocument();
  });

  it('displays detailed cards when clicking interactive dome sectors', () => {
    const { container } = render(<ActiveEcoGarden averageFootprint={5.5} totalCarbonSaved={10} ledgerEntries={[]} />);

    expect(screen.getByText(/Dome Sim Active/i)).toBeInTheDocument();

    const soilPath = container.querySelector('path[d^="M 15,100 C 50,115"]');
    expect(soilPath).toBeInTheDocument();
    fireEvent.click(soilPath);

    expect(screen.getByText('Mycelium Soil Base')).toBeInTheDocument();
    expect(screen.getByText(/Natural underground mycelium networks/i)).toBeInTheDocument();

    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);

    expect(screen.getByText(/Dome Sim Active/i)).toBeInTheDocument();
  });
});
