'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalculatorInputs, CalculatorResults } from '@/types/calculator';
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
    // Calculate dependent fields
    const depositAmount = watchedValues.depositAmount;
    const ltv = watchedValues.ltv;
    const maxLtv = watchedValues.maxLtv;

    // Calculate borrow amount
    const borrowAmount = (depositAmount * ltv) / 100;
    form.setValue('borrowAmount', borrowAmount);

    // Calculate health rate
    const healthRate = depositAmount / (borrowAmount / (maxLtv / 100));
    form.setValue('healthRate', healthRate);
  }, [watchedValues.depositAmount, watchedValues.ltv, watchedValues.maxLtv, form]);

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
      <Card>
        <CardHeader>
          <CardTitle>Morpho APR Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="depositAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
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
                    <FormLabel>Intrinsic APR (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
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
                    <FormLabel>Max LTV (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
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
                    <FormLabel>LTV (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="healthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        disabled
                        className="bg-gray-100"
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
                    <FormLabel>Borrow Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled
                        className="bg-gray-100"
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
                    <FormLabel>Borrow Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="mt-8 space-y-2">
            <h3 className="text-lg font-semibold">Results</h3>
            <p>Annual Deposit Income: {formatCurrency(results.annualDepositIncome)}</p>
            <p>Annual Borrow Cost: {formatCurrency(results.annualBorrowCost)}</p>
            <p>Net Annual Benefit: {formatCurrency(results.netAnnualBenefit)}</p>
            <p>Effective Capital Invested: {formatCurrency(results.effectiveCapitalInvested)}</p>
            <p>Total Strategy APR: {formatPercentage(results.totalStrategyApr)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 