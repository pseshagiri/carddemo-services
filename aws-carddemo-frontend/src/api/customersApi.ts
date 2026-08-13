/**
 * Customers API — customer-service routed via API Gateway
 *
 * POST  /api/customers              → CustomerResponse (create)
 * PUT   /api/customers/{id}         → CustomerResponse (update)
 * GET   /api/customers/{id}         → CustomerResponse
 * GET   /api/customers/number/{customerNumber} → CustomerResponse
 * GET   /api/customers/user/{identityUserId}   → CustomerResponse
 * GET   /api/customers              → PageResponse<CustomerResponse>
 * PATCH /api/customers/{id}/activate
 * PATCH /api/customers/{id}/suspend
 * PATCH /api/customers/{id}/close
 */
import { apiRequest, PageResponse } from './apiClient';

/** Nested address DTO */
export interface AddressDto {
  streetLine1: string;
  streetLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/** Matches CustomerResponse from customer-service */
export interface CustomerResponse {
  id: number;
  identityUserId: number;
  customerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  mailingAddress: AddressDto | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  tier: string;
  creditScore: number | null;
  annualIncome: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Matches CreateCustomerRequest from customer-service */
export interface CreateCustomerRequest {
  identityUserId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationalId?: string;
  annualIncome?: number;
}

/** Matches UpdateCustomerRequest from customer-service */
export interface UpdateCustomerRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  mailingAddress?: AddressDto;
  annualIncome?: number;
}

/** POST /api/customers */
export function createCustomer(data: CreateCustomerRequest): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** PUT /api/customers/{id} */
export function updateCustomer(
  id: number | string,
  data: UpdateCustomerRequest,
): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** GET /api/customers/{id} */
export function getCustomerById(id: number | string): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(`/api/customers/${id}`);
}

/** GET /api/customers/number/{customerNumber} */
export function getCustomerByNumber(customerNumber: string): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(`/api/customers/number/${customerNumber}`);
}

/** GET /api/customers/user/{identityUserId} */
export function getCustomerByUserId(identityUserId: number | string): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(`/api/customers/user/${identityUserId}`);
}

/** GET /api/customers — paginated list with optional search/status filter */
export function listCustomers(
  page = 0,
  size = 50,
  status?: string,
  query?: string,
): Promise<PageResponse<CustomerResponse>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set('status', status);
  if (query) params.set('query', query);
  return apiRequest<PageResponse<CustomerResponse>>(`/api/customers?${params.toString()}`);
}

/** PATCH /api/customers/{id}/activate */
export function activateCustomer(id: number | string): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(`/api/customers/${id}/activate`, { method: 'PATCH' });
}

/** PATCH /api/customers/{id}/suspend */
export function suspendCustomer(
  id: number | string,
  reason = 'Suspended by administrator',
): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(
    `/api/customers/${id}/suspend?reason=${encodeURIComponent(reason)}`,
    { method: 'PATCH' },
  );
}

/** PATCH /api/customers/{id}/close */
export function closeCustomer(id: number | string): Promise<CustomerResponse> {
  return apiRequest<CustomerResponse>(`/api/customers/${id}/close`, { method: 'PATCH' });
}
