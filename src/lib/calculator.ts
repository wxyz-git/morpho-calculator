import { CalculatorInputs, CalculatorResults, ValidationError } from '@/types/calculator';

export function validateInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate deposit amount first as other validations depend on it
  if (inputs.depositAmount <= 0) {
    errors.push({
      field: 'depositAmount',
      message: 'Deposit amount must be greater than 0'
    });
    return errors; // Return early as other validations depend on deposit amount
  }

  if (inputs.intrinsicApr < 0 || inputs.intrinsicApr > 100) {
    errors.push({
      field: 'intrinsicApr',
      message: 'Intrinsic APR must be between 0 and 100'
    });
  }

  if (inputs.maxLtv < 0 || inputs.maxLtv > 100) {
    errors.push({
      field: 'maxLtv',
      message: 'Max LTV must be between 0 and 100'
    });
  }

  if (inputs.ltv < 0 || inputs.ltv > inputs.maxLtv) {
    errors.push({
      field: 'ltv',
      message: `LTV must be between 0 and ${inputs.maxLtv}`
    });
  }

  if (inputs.healthRate <= 1) {
    errors.push({
      field: 'healthRate',
      message: 'Health rate must be greater than 1'
    });
  }

  const maxBorrowAmount = inputs.depositAmount * inputs.ltv / 100;
  if (inputs.borrowAmount < 0 || inputs.borrowAmount > maxBorrowAmount) {
    errors.push({
      field: 'borrowAmount',
      message: `Borrow amount must be between 0 and ${maxBorrowAmount.toFixed(2)}`
    });
  }

  if (inputs.borrowRate < 0 || inputs.borrowRate > 100) {
    errors.push({
      field: 'borrowRate',
      message: 'Borrow rate must be between 0 and 100'
    });
  }

  return errors;
}

export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  const annualDepositIncome = inputs.depositAmount * (inputs.intrinsicApr / 100);
  const annualBorrowCost = inputs.borrowAmount * (inputs.borrowRate / 100);
  const netAnnualBenefit = annualDepositIncome - annualBorrowCost;
  const effectiveCapitalInvested = inputs.depositAmount - inputs.borrowAmount;
  const totalStrategyApr = (netAnnualBenefit / effectiveCapitalInvested) * 100;

  return {
    annualDepositIncome,
    annualBorrowCost,
    netAnnualBenefit,
    effectiveCapitalInvested,
    totalStrategyApr
  };
} 