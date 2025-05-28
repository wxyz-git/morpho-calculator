import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorForm } from '../CalculatorForm';
import userEvent from '@testing-library/user-event';

describe('CalculatorForm', () => {
  it('renders all form fields', () => {
    render(<CalculatorForm />);
    
    expect(screen.getByLabelText(/Deposit Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Intrinsic APR/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max LTV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^LTV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Health Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Borrow Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Borrow Rate/i)).toBeInTheDocument();
  });

  it('shows calculated fields as disabled', () => {
    render(<CalculatorForm />);
    
    const healthRateInput = screen.getByLabelText(/Health Rate/i) as HTMLInputElement;
    const borrowAmountInput = screen.getByLabelText(/Borrow Amount/i) as HTMLInputElement;
    
    expect(healthRateInput.disabled).toBe(true);
    expect(borrowAmountInput.disabled).toBe(true);
  });

  it('automatically updates calculated fields when inputs change', async () => {
    render(<CalculatorForm />);
    
    const depositInput = screen.getByLabelText(/Deposit Amount/i);
    const ltvInput = screen.getByLabelText(/^LTV/i);
    
    fireEvent.change(depositInput, { target: { value: '10000' } });
    fireEvent.change(ltvInput, { target: { value: '50' } });

    await waitFor(() => {
      const borrowAmountInput = screen.getByLabelText(/Borrow Amount/i) as HTMLInputElement;
      expect(parseFloat(borrowAmountInput.value)).toBeCloseTo(5000, 2);
    });
  });

  it('automatically updates results when inputs change', async () => {
    render(<CalculatorForm />);
    
    const depositInput = screen.getByLabelText(/Deposit Amount/i);
    const intrinsicAprInput = screen.getByLabelText(/Intrinsic APR/i);
    const borrowRateInput = screen.getByLabelText(/Borrow Rate/i);
    
    fireEvent.change(depositInput, { target: { value: '10000' } });
    fireEvent.change(intrinsicAprInput, { target: { value: '4.25' } });
    fireEvent.change(borrowRateInput, { target: { value: '5' } });

    await waitFor(() => {
      const results = screen.getByText(/Results/i).parentElement;
      expect(results).toHaveTextContent('Annual Deposit Income: $425.00');
      expect(results).toHaveTextContent('Annual Borrow Cost: $225.00');
      expect(results).toHaveTextContent('Net Annual Benefit: $200.00');
      expect(results).toHaveTextContent('Effective Capital Invested: $5,500.00');
      expect(results).toHaveTextContent('Total Strategy APR: 3.64%');
    });
  });

  it('handles zero borrow amount correctly', async () => {
    render(<CalculatorForm />);
    
    const depositInput = screen.getByLabelText(/Deposit Amount/i);
    const ltvInput = screen.getByLabelText(/^LTV/i);
    const borrowRateInput = screen.getByLabelText(/Borrow Rate/i);
    
    fireEvent.change(depositInput, { target: { value: '10000' } });
    fireEvent.change(ltvInput, { target: { value: '0' } });
    fireEvent.change(borrowRateInput, { target: { value: '0' } });

    await waitFor(() => {
      const results = screen.getByText(/Results/i).parentElement;
      expect(results).toHaveTextContent('Annual Deposit Income: $425.00');
      expect(results).toHaveTextContent('Annual Borrow Cost: $0.00');
      expect(results).toHaveTextContent('Net Annual Benefit: $425.00');
      expect(results).toHaveTextContent('Effective Capital Invested: $10,000.00');
      expect(results).toHaveTextContent('Total Strategy APR: 4.25%');
    });
  });
}); 