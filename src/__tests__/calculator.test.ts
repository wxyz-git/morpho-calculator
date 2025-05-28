import { validateInputs, calculateResults } from '@/lib/calculator';
import { CalculatorInputs } from '@/types/calculator';

describe('Calculator Validation', () => {
  const validInputs: CalculatorInputs = {
    depositAmount: 10000,
    intrinsicApr: 4.25,
    maxLtv: 91.5,
    ltv: 45,
    healthRate: 2.03,
    borrowAmount: 4500,
    borrowRate: 5
  };

  test('validates valid inputs', () => {
    const errors = validateInputs(validInputs);
    expect(errors).toHaveLength(0);
  });

  test('validates deposit amount', () => {
    const inputs = { ...validInputs, depositAmount: 0 };
    const errors = validateInputs(inputs);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('depositAmount');
  });

  test('validates ltv against maxLtv', () => {
    const inputs = { ...validInputs, ltv: 92 };
    const errors = validateInputs(inputs);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('ltv');
  });

  test('validates borrow amount against ltv', () => {
    const inputs = { ...validInputs, borrowAmount: 5000 };
    const errors = validateInputs(inputs);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('borrowAmount');
  });
});

describe('Calculator Results', () => {
  const testInputs: CalculatorInputs = {
    depositAmount: 10000,
    intrinsicApr: 4.25,
    maxLtv: 91.5,
    ltv: 45,
    healthRate: 2.03,
    borrowAmount: 4500,
    borrowRate: 5
  };

  test('calculates results correctly', () => {
    const results = calculateResults(testInputs);
    
    expect(results.annualDepositIncome).toBeCloseTo(425, 2);
    expect(results.annualBorrowCost).toBeCloseTo(225, 2);
    expect(results.netAnnualBenefit).toBeCloseTo(200, 2);
    expect(results.effectiveCapitalInvested).toBeCloseTo(5500, 2);
    expect(results.totalStrategyApr).toBeCloseTo(3.64, 2);
  });

  test('handles zero borrow amount', () => {
    const inputs = { ...testInputs, borrowAmount: 0, borrowRate: 0 };
    const results = calculateResults(inputs);
    
    expect(results.annualBorrowCost).toBe(0);
    expect(results.netAnnualBenefit).toBe(results.annualDepositIncome);
    expect(results.effectiveCapitalInvested).toBe(inputs.depositAmount);
    expect(results.totalStrategyApr).toBeCloseTo(inputs.intrinsicApr, 2);
  });
}); 