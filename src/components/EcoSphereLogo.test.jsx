import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EcoSphereLogo from './EcoSphereLogo';

describe('EcoSphereLogo', () => {
  it('renders without crashing', () => {
    const { container } = render(<EcoSphereLogo />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox', '0 0 44 44');
  });

  it('applies custom className and size', () => {
    const { container } = render(<EcoSphereLogo className="custom-class" size={32} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveClass('custom-class');
    expect(svgElement).toHaveAttribute('width', '32');
    expect(svgElement).toHaveAttribute('height', '32');
  });
});
