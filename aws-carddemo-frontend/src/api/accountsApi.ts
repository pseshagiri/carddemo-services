/**
 * Accounts API — account-service routed via API Gateway
 *
 * GET    /api/accounts              → PageResponse<AccountResponse>
 * GET    /api/accounts/{id}         → AccountResponse
 * GET    /api/accounts/customer/{customerId} → AccountResponse[]
 * POST   /api/accounts              → AccountResponse (create)
 * PATCH  /api/accounts/{id}/activate
 * PATCH  /api/accounts/{id}/suspend
 * PATCH  /api/accounts/{id}/close
 * PATCH  /api/accounts/{id}/credit-limit
 */
import { apiRequest, PageResponse } from './apiClient';

/** Matches AccountResponse from account-service */
export interface AccountResponse {
  id: number;
  accountNumber: string;
  customerNumber: string;
  customerId: number;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'SUSPENDED';
  creditLimit: number;
  availableCredit: number;
  currentBalance: number;
  currency: string;
  interestRate: number;
  paymentDueDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpenAccountRequest {
  customerId: number;
  accountType: string;
  currency: string;
  creditLimit: number;
}

export interface UpdateCreditLimitRequest {
  newLimit: number;
}

/** GET /api/accounts — paginated list */
export function getAllAccounts(page = 0, size = 50): Promise<PageResponse<AccountResponse>> {
  return apiRequest<PageResponse<AccountResponse>>(
    `/api/accounts?page=${page}&size=${size}`,
  );
}

/** GET /api/accounts/{id} */
export function getAccountById(id: number | string): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/api/accounts/${id}`);
}

/** GET /api/accounts/number/{accountNumber} */
export function getAccountByNumber(accountNumber: string): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/api/accounts/number/${accountNumber}`);
}

/** GET /api/accounts/customer/{customerId} */
export function getAccountsByCustomer(customerId: number | string): Promise<AccountResponse[]> {
  return apiRequest<AccountResponse[]>(`/api/accounts/customer/${customerId}`);
}

/** POST /api/accounts */
export function openAccount(data: OpenAccountRequest): Promise<AccountResponse> {
  return apiRequest<AccountResponse>('/api/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** PATCH /api/accounts/{id}/activate */
export function activateAccount(id: number | string): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/api/accounts/${id}/activate`, { method: 'PATCH' });
}

/** PATCH /api/accounts/{id}/suspend */
export function suspendAccount(id: number | string): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/api/accounts/${id}/suspend`, { method: 'PATCH' });
}

/** PATCH /api/accounts/{id}/close */
export function closeAccount(id: number | string): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/api/accounts/${id}/close`, { method: 'PATCH' });
}

/** PATCH /api/accounts/{id}/credit-limit */
export function updateCreditLimit(
  id: number | string,
  newLimit: number,
): Promise<AccountResponse> {
  return apiRequest<AccountResponse>(`/api/accounts/${id}/credit-limit`, {
    method: 'PATCH',
    body: JSON.stringify({ newLimit }),
  });
}
