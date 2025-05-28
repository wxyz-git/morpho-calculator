'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalculatorInputs } from '@/types/calculator';
import { calculateResults } from '@/lib/calculator';
import { useEffect } from 'react';

const formSchema = z.object({
  depositAmount: z.number().positive('Number must be greater than 0'),
  intrinsicApr: z.number().min(0).max(100),
  maxLtv: z.number().min(0).max(100),
  ltv: z.number().min(0).max(100),
  healthRate: z.number(),
  borrowAmount: z.number(),
  borrowRate: z.number().min(0).max(100),
});

export function CalculatorForm() {
  const form = useForm<CalculatorInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      depositAmount: 10000,
      intrinsicApr: 4.25,
      maxLtv: 91.5,
      ltv: 45,
      healthRate: 2.03,
      borrowAmount: 4500,
      borrowRate: 5,
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const depositAmount = watchedValues.depositAmount;
    const maxLtv = watchedValues.maxLtv;
    const borrowAmount = watchedValues.borrowAmount;

    // Calculate health rate
    const healthRate = depositAmount / (borrowAmount / (maxLtv / 100));
    if (!isNaN(healthRate) && isFinite(healthRate)) {
      form.setValue('healthRate', healthRate, { shouldValidate: true });
    }
  }, [watchedValues.depositAmount, watchedValues.borrowAmount, watchedValues.maxLtv, watchedValues.ltv, form]);

  // Calculate borrow amount from LTV
  useEffect(() => {
    const depositAmount = watchedValues.depositAmount;
    
    if (depositAmount && watchedValues.ltv) {
      const newBorrowAmount = (depositAmount * watchedValues.ltv) / 100;
      if (!isNaN(newBorrowAmount) && isFinite(newBorrowAmount)) {
        form.setValue('borrowAmount', newBorrowAmount, { shouldValidate: true });
      }
    }
  }, [watchedValues.depositAmount, watchedValues.ltv, form]);

  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  // Calculate results
  const results = calculateResults(watchedValues);

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-gradient-to-br from-[#0E1E3E] to-[#1A2C4E] text-white">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-2xl font-bold text-center">Morpho APR Calculator</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Input Parameters</h3>
                <FormField
                  control={form.control}
                  name="depositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Deposit Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intrinsicApr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Intrinsic APR (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxLtv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Max LTV (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ltv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">LTV (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrowAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Borrow Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrowRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Borrow Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Results</h3>
                <div className="grid gap-3">
                  <div>
                    <div className="text-sm text-white/70">Health Rate</div>
                    <div className="text-xl font-medium">{watchedValues.healthRate.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Annual Deposit Income</div>
                    <div className="text-xl font-medium">{formatCurrency(results.annualDepositIncome)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Annual Borrow Cost</div>
                    <div className="text-xl font-medium">{formatCurrency(results.annualBorrowCost)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Net Annual Benefit</div>
                    <div className="text-xl font-medium">{formatCurrency(results.netAnnualBenefit)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Effective Capital Invested</div>
                    <div className="text-xl font-medium">{formatCurrency(results.effectiveCapitalInvested)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Total Strategy APR</div>
                    <div className="text-xl font-medium">{formatPercentage(results.totalStrategyApr)}</div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 