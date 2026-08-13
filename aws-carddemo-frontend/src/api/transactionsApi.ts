/**
 * Transactions API — transaction-service routed via API Gateway
 *
 * POST  /api/transactions                                → TransactionResponse
 * GET   /api/transactions/{id}                          → TransactionResponse
 * GET   /api/transactions/txn/{transactionId}           → TransactionResponse (by UUID)
 * GET   /api/transactions/account/{accountId}           → PageResponse<TransactionResponse>
 * GET   /api/transactions/customer/{customerId}         → PageResponse<TransactionResponse>
 * GET   /api/transactions/account/{accountId}/range     → PageResponse<TransactionResponse>
 * GET   /api/transactions/account/{accountId}/type/{type} → PageResponse<TransactionResponse>
 * PATCH /api/transactions/{id}/reverse                  → TransactionResponse
 */
import { apiRequest, PageResponse } from './apiClient';

export type TransactionType =
  | 'PURCHASE'
  | 'REFUND'
  | 'PAYMENT'
  | 'CASH_ADVANCE'
  | 'FEE'
  | 'INTEREST'
  | 'ADJUSTMENT';

export type TransactionStatus = 'PENDING' | 'POSTED' | 'REVERSED' | 'DECLINED' | 'FAILED';

/** Matches TransactionResponse from transaction-service */
export interface TransactionResponse {
  id: number;
  transactionId: string;
  accountId: number;
  accountNumber: string;
  cardId: number | null;
  cardMasked: string | null;
  customerId: number;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  merchantName: string | null;
  merchantCategory: string | null;
  description: string | null;
  referenceId: string | null;
  occurredAt: string;
  processedAt: string | null;
  createdAt: string;
}

/** Matches CreateTransactionRequest from transaction-service */
export interface CreateTransactionRequest {
  accountId: number;
  accountNumber: string;
  customerId: number;
  cardId?: number;
  cardMasked?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  merchantName?: string;
  merchantCategory?: string;
  description?: string;
  referenceId?: string;
}

/** POST /api/transactions — create a new transaction */
export function createTransaction(data: CreateTransactionRequest): Promise<TransactionResponse> {
  return apiRequest<TransactionResponse>('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** GET /api/transactions/{id} — by internal numeric ID */
export function getTransactionById(id: number | string): Promise<TransactionResponse> {
  return apiRequest<TransactionResponse>(`/api/transactions/${id}`);
}

/** GET /api/transactions/txn/{transactionId} — by UUID string */
export function getTransactionByUuid(transactionId: string): Promise<TransactionResponse> {
  return apiRequest<TransactionResponse>(`/api/transactions/txn/${transactionId}`);
}

/** GET /api/transactions/account/{accountId} — paginated */
export function getTransactionsByAccount(
  accountId: number | string,
  page = 0,
  size = 50,
): Promise<PageResponse<TransactionResponse>> {
  return apiRequest<PageResponse<TransactionResponse>>(
    `/api/transactions/account/${accountId}?page=${page}&size=${size}`,
  );
}

/** GET /api/transactions/customer/{customerId} — paginated */
export function getTransactionsByCustomer(
  customerId: number | string,
  page = 0,
  size = 50,
): Promise<PageResponse<TransactionResponse>> {
  return apiRequest<PageResponse<TransactionResponse>>(
    `/api/transactions/customer/${customerId}?page=${page}&size=${size}`,
  );
}

/**
 * GET /api/transactions/account/{accountId}/range
 * Dates must be ISO-8601 LocalDateTime strings e.g. "2024-01-01T00:00:00"
 */
export function getTransactionsByDateRange(
  accountId: number | string,
  from: string,
  to: string,
  page = 0,
  size = 50,
): Promise<PageResponse<TransactionResponse>> {
  return apiRequest<PageResponse<TransactionResponse>>(
    `/api/transactions/account/${accountId}/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&page=${page}&size=${size}`,
  );
}

/** PATCH /api/transactions/{id}/reverse */
export function reverseTransaction(id: number | string): Promise<TransactionResponse> {
  return apiRequest<TransactionResponse>(`/api/transactions/${id}/reverse`, { method: 'PATCH' });
}
