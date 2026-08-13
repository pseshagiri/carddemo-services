/**
 * Reports API — built from transaction-service and account-service data.
 *
 * The new microservices backend does not have a dedicated reports service.
 * This module provides report-like aggregates by composing:
 *   - GET /api/transactions/account/{accountId}/range  (transaction-service)
 *   - GET /api/accounts/{accountId}                    (account-service)
 *
 * The ReportSummary type is computed client-side from live transaction data.
 */
import { getTransactionsByDateRange, type TransactionResponse } from './transactionsApi';
import { getAccountById, type AccountResponse } from './accountsApi';

export interface TransactionTypeSummary {
  count: number;
  totalAmount: number;
}

export interface ReportSummary {
  accountId: number;
  accountNumber: string;
  periodStart: string;
  periodEnd: string;
  currentBalance: number;
  creditLimit: number;
  availableCredit: number;
  transactionCount: number;
  totalDebits: number;
  totalCredits: number;
  summaryByType: Record<string, TransactionTypeSummary>;
  transactions: TransactionResponse[];
}

/**
 * Fetches transactions for an account within the given date range and builds
 * a report summary. Dates must be ISO-8601 date strings (yyyy-MM-dd).
 */
export async function getTransactionReport(
  accountId: number | string,
  startDate: string,
  endDate: string,
): Promise<ReportSummary> {
  // Convert date strings to LocalDateTime format expected by the backend
  const from = `${startDate}T00:00:00`;
  const to = `${endDate}T23:59:59`;

  const [txnPage, account] = await Promise.all([
    getTransactionsByDateRange(accountId, from, to, 0, 200),
    getAccountById(accountId),
  ]);

  const transactions = txnPage.content;

  // Build summary by type
  const summaryByType: Record<string, TransactionTypeSummary> = {};
  let totalDebits = 0;
  let totalCredits = 0;

  for (const txn of transactions) {
    const key = txn.type;
    if (!summaryByType[key]) summaryByType[key] = { count: 0, totalAmount: 0 };
    summaryByType[key].count += 1;
    summaryByType[key].totalAmount += txn.amount;

    // Credits (PAYMENT, REFUND) vs Debits (everything else)
    if (txn.type === 'PAYMENT' || txn.type === 'REFUND') {
      totalCredits += txn.amount;
    } else {
      totalDebits += txn.amount;
    }
  }

  return {
    accountId: account.id,
    accountNumber: account.accountNumber,
    periodStart: startDate,
    periodEnd: endDate,
    currentBalance: account.currentBalance,
    creditLimit: account.creditLimit,
    availableCredit: account.availableCredit,
    transactionCount: transactions.length,
    totalDebits,
    totalCredits,
    summaryByType,
    transactions,
  };
}

/**
 * Convenience: get account summary (balance, limits) without a date range.
 * Uses account-service directly.
 */
export async function getAccountSummaryReport(
  accountId: number | string,
): Promise<AccountResponse> {
  return getAccountById(accountId);
}
