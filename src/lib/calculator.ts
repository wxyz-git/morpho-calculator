/**
 * Morpho APR Calculator
 * This module provides utilities for calculating APR and validating inputs for the Morpho lending protocol.
 * @module calculator
 */

import { CalculatorInputs, CalculatorResults, ValidationError } from '@/types/calculator';

/**
 * Validates calculator inputs against business rules
 * @param inputs - Calculator input values
 * @returns Array of validation errors, empty if all inputs are valid
 */
export function validateInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate deposit amount first as other validations depend on it
  if (!Number.isFinite(inputs.depositAmount) || inputs.depositAmount <= 0) {
    errors.push({
      field: 'depositAmount',
      message: 'Deposit amount must be a positive number'
    });
    return errors; // Return early as other validations depend on deposit amount
  }

  if (!Number.isFinite(inputs.intrinsicApr) || inputs.intrinsicApr < 0 || inputs.intrinsicApr > 100) {
    errors.push({
      field: 'intrinsicApr',
      message: 'Intrinsic APR must be between 0 and 100'
    });
  }

  if (!Number.isFinite(inputs.maxLtv) || inputs.maxLtv < 0 || inputs.maxLtv > 100) {
    errors.push({
      field: 'maxLtv',
      message: 'Max LTV must be between 0 and 100'
    });
  }

  // Validate LTV first as borrow amount depends on it
  if (!Number.isFinite(inputs.ltv) || inputs.ltv < 0 || inputs.ltv > inputs.maxLtv) {
    errors.push({
      field: 'ltv',
      message: `LTV must be between 0 and ${inputs.maxLtv}`
    });
    return errors; // Return early as borrow amount validation depends on LTV
  }

  const maxBorrowAmount = inputs.depositAmount * (inputs.ltv / 100);
  if (!Number.isFinite(inputs.borrowAmount) || inputs.borrowAmount < 0 || inputs.borrowAmount > maxBorrowAmount) {
    errors.push({
      field: 'borrowAmount',
      message: `Borrow amount must be between 0 and ${maxBorrowAmount.toFixed(2)}`
    });
  }

  if (!Number.isFinite(inputs.borrowRate) || inputs.borrowRate < 0 || inputs.borrowRate > 100) {
    errors.push({
      field: 'borrowRate',
      message: 'Borrow rate must be between 0 and 100'
    });
  }

  return errors;
}

/**
 * Calculates APR and related metrics based on input values
 * @param inputs - Calculator input values
 * @returns Object containing calculated results
 */
export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  // Handle edge cases and invalid inputs
  if (!Number.isFinite(inputs.depositAmount) || inputs.depositAmount <= 0) {
    return {
      annualDepositIncome: 0,
      annualBorrowCost: 0,
      netAnnualBenefit: 0,
      effectiveCapitalInvested: 0,
      totalStrategyApr: 0
    };
  }

  const annualDepositIncome = inputs.depositAmount * (inputs.intrinsicApr / 100);
  const annualBorrowCost = inputs.borrowAmount * (inputs.borrowRate / 100);
  const netAnnualBenefit = annualDepositIncome - annualBorrowCost;
  const effectiveCapitalInvested = inputs.depositAmount - inputs.borrowAmount;
  
  // Prevent division by zero and handle edge cases
  const totalStrategyApr = effectiveCapitalInvested > 0 
    ? (netAnnualBenefit / effectiveCapitalInvested) * 100 
    : inputs.intrinsicApr; // If no effective capital invested, APR equals intrinsic APR

  return {
    annualDepositIncome,
    annualBorrowCost,
    netAnnualBenefit,
    effectiveCapitalInvested,
    totalStrategyApr
  };
} 