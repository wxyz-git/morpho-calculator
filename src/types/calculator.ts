/**
 * Represents the input parameters for the Morpho APR calculator
 */
export interface CalculatorInputs {
  /** Amount of money deposited in USD */
  depositAmount: number;
  /** Annual Percentage Rate of the intrinsic deposit yield (0-100) */
  intrinsicApr: number;
  /** Maximum Loan-to-Value ratio allowed by the protocol (0-100) */
  maxLtv: number;
  /** Current Loan-to-Value ratio for the position (0-maxLtv) */
  ltv: number;
  /** Health factor of the position (calculated) */
  healthRate: number;
  /** Amount borrowed against the deposit (calculated) */
  borrowAmount: number;
  /** Annual Percentage Rate for borrowing (0-100) */
  borrowRate: number;
}

/**
 * Represents the calculated results from the Morpho APR calculator
 */
export interface CalculatorResults {
  /** Annual income from the deposit in USD */
  annualDepositIncome: number;
  /** Annual cost of borrowing in USD */
  annualBorrowCost: number;
  /** Net annual benefit (income - cost) in USD */
  netAnnualBenefit: number;
  /** Effective capital invested (deposit - borrow) in USD */
  effectiveCapitalInvested: number;
  /** Total strategy APR as a percentage */
  totalStrategyApr: number;
}

/**
 * Represents a validation error for calculator inputs
 */
export interface ValidationError {
  /** The field that failed validation */
  field: keyof CalculatorInputs;
  /** The error message describing the validation failure */
  message: string;
} 