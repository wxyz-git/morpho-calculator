# Morpho APR Calculator

A web-based calculator for computing APR and related metrics for the Morpho lending protocol. This tool helps users understand and optimize their lending positions by calculating key metrics such as health rate, effective capital invested, and total strategy APR.

## Features

- Real-time calculations as you type
- Automatic computation of health rate and borrow amount based on LTV
- Input validation with helpful error messages
- Responsive design
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/morpho-calculator.git
cd morpho-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the calculator.

## Usage

The calculator accepts the following inputs:

- **Deposit Amount ($)**: The amount of money you want to deposit
- **Intrinsic APR (%)**: The base APR for deposits
- **Max LTV (%)**: Maximum Loan-to-Value ratio allowed by the protocol
- **LTV (%)**: Your desired Loan-to-Value ratio
- **Borrow Rate (%)**: The current borrowing rate

The calculator will automatically compute:

- **Health Rate**: Position health factor
- **Borrow Amount ($)**: Amount you can borrow based on LTV
- **Annual Deposit Income ($)**: Yearly income from your deposit
- **Annual Borrow Cost ($)**: Yearly cost of borrowing
- **Net Annual Benefit ($)**: Total yearly profit
- **Effective Capital Invested ($)**: Net capital in use
- **Total Strategy APR (%)**: Overall strategy performance

## Development

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing
- shadcn/ui for components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Form handling with [React Hook Form](https://react-hook-form.com/)
- Validation with [Zod](https://zod.dev/)
