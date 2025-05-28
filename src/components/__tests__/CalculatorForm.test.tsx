import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorForm } from '../CalculatorForm';

describe('CalculatorForm', () => {
  it('renders all form fields', () => {
    render(<CalculatorForm />);
    
    expect(screen.getByLabelText(/Deposit Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Intrinsic APR/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max LTV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^LTV/i)).toBeInTheDocument();
    expect(screen.getByText(/Health Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Borrow Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Borrow Rate/i)).toBeInTheDocument();
  });

  it('shows health rate in results', () => {
    render(<CalculatorForm />);
    
    const healthRateSection = screen.getByText(/Health Rate/i).parentElement;
    expect(healthRateSection).toHaveTextContent('2.03');
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
      expect(results).toHaveTextContent('$425.00'); // Annual Deposit Income
      expect(results).toHaveTextContent('$225.00'); // Annual Borrow Cost
      expect(results).toHaveTextContent('$200.00'); // Net Annual Benefit
      expect(results).toHaveTextContent('$5,500.00'); // Effective Capital Invested
      expect(results).toHaveTextContent('3.64%'); // Total Strategy APR
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
      expect(results).toHaveTextContent('$425.00'); // Annual Deposit Income
      expect(results).toHaveTextContent('$0.00'); // Annual Borrow Cost
      expect(results).toHaveTextContent('$425.00'); // Net Annual Benefit
      expect(results).toHaveTextContent('$10,000.00'); // Effective Capital Invested
      expect(results).toHaveTextContent('4.25%'); // Total Strategy APR
    });
  });

  it('updates LTV when borrow amount changes', async () => {
    render(<CalculatorForm />);
    
    const depositInput = screen.getByLabelText(/Deposit Amount/i);
    const borrowAmountInput = screen.getByLabelText(/Borrow Amount/i);
    
    fireEvent.change(depositInput, { target: { value: '10000' } });
    fireEvent.change(borrowAmountInput, { target: { value: '5000' } });

    await waitFor(() => {
      const ltvInput = screen.getByLabelText(/^LTV/i) as HTMLInputElement;
      expect(parseFloat(ltvInput.value)).toBeCloseTo(50, 2);
    });
  });
}); 