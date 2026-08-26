import { describe, it, expect } from 'vitest';
import { validateSampleContext } from '../utils/validation';

describe('validateSampleContext', () => {
  it('passes for valid inputs', () => {
    const errors = validateSampleContext(11.3, 142.2, 4200, 1.4);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('fails for out of bounds latitude', () => {
    const errors = validateSampleContext(95, 142.2, 4200, 1.4);
    expect(errors.lat).toBeDefined();
  });

  it('fails for negative depth', () => {
    const errors = validateSampleContext(11.3, 142.2, -100, 1.4);
    expect(errors.depth).toBeDefined();
  });

  it('fails for extreme temperature', () => {
    const errors = validateSampleContext(11.3, 142.2, 4200, 50);
    expect(errors.temp).toBeDefined();
  });
});
