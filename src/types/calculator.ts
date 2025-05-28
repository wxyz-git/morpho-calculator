export interface CalculatorInputs {
  depositAmount: number;
  intrinsicApr: number;
  maxLtv: number;
  ltv: number;
  healthRate: number;
  borrowAmount: number;
  borrowRate: number;
}

export interface CalculatorResults {
  annualDepositIncome: number;
  annualBorrowCost: number;
  netAnnualBenefit: number;
  effectiveCapitalInvested: number;
  totalStrategyApr: number;
}

export interface ValidationError {
  field: keyof CalculatorInputs;
  message: string;
} 