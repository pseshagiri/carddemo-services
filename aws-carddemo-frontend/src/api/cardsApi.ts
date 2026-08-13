/**
 * Cards API — card-service routed via API Gateway
 *
 * POST   /api/cards                        → CardResponse (issue card)
 * GET    /api/cards/{id}                   → CardResponse
 * GET    /api/cards/account/{accountId}    → CardResponse[]
 * GET    /api/cards/customer/{customerId}  → CardResponse[]
 * GET    /api/cards                        → PageResponse<CardResponse>
 * PATCH  /api/cards/{id}/activate
 * PATCH  /api/cards/{id}/block?reason=
 * PATCH  /api/cards/{id}/unblock
 * PATCH  /api/cards/{id}/report-lost
 * PATCH  /api/cards/{id}/report-stolen
 * PATCH  /api/cards/{id}/cancel
 * PATCH  /api/cards/{id}/daily-limit
 */
import { apiRequest, PageResponse } from './apiClient';

/** Matches CardResponse from card-service */
export interface CardResponse {
  id: number;
  cardMasked: string;
  accountId: number;
  accountNumber: string;
  customerId: number;
  cardHolderName: string;
  cardType: string;
  network: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  expiryMonth: number;
  expiryYear: number;
  dailyLimit: number;
  issuedAt: string;
  createdAt: string;
}

export interface IssueCardRequest {
  accountId: number;
  accountNumber: string;
  customerId: number;
  cardHolderName: string;
  cardType: string;
  network: string;
}

export interface UpdateDailyLimitRequest {
  dailyLimit: number;
}

/** POST /api/cards — issue a new card */
export function issueCard(data: IssueCardRequest): Promise<CardResponse> {
  return apiRequest<CardResponse>('/api/cards', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** GET /api/cards/{id} */
export function getCardById(id: number | string): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}`);
}

/** GET /api/cards/account/{accountId} — list (not paginated in this service) */
export function getCardsByAccount(accountId: number | string): Promise<CardResponse[]> {
  return apiRequest<CardResponse[]>(`/api/cards/account/${accountId}`);
}

/** GET /api/cards/customer/{customerId} */
export function getCardsByCustomer(customerId: number | string): Promise<CardResponse[]> {
  return apiRequest<CardResponse[]>(`/api/cards/customer/${customerId}`);
}

/** GET /api/cards — paginated list */
export function listCards(page = 0, size = 50): Promise<PageResponse<CardResponse>> {
  return apiRequest<PageResponse<CardResponse>>(`/api/cards?page=${page}&size=${size}`);
}

/** PATCH /api/cards/{id}/activate */
export function activateCard(id: number | string): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}/activate`, { method: 'PATCH' });
}

/** PATCH /api/cards/{id}/block */
export function blockCard(id: number | string, reason = 'Blocked by cardholder'): Promise<CardResponse> {
  return apiRequest<CardResponse>(
    `/api/cards/${id}/block?reason=${encodeURIComponent(reason)}`,
    { method: 'PATCH' },
  );
}

/** PATCH /api/cards/{id}/unblock */
export function unblockCard(id: number | string): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}/unblock`, { method: 'PATCH' });
}

/** PATCH /api/cards/{id}/report-lost */
export function reportLost(id: number | string): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}/report-lost`, { method: 'PATCH' });
}

/** PATCH /api/cards/{id}/report-stolen */
export function reportStolen(id: number | string): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}/report-stolen`, { method: 'PATCH' });
}

/** PATCH /api/cards/{id}/cancel */
export function cancelCard(id: number | string): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}/cancel`, { method: 'PATCH' });
}

/** PATCH /api/cards/{id}/daily-limit */
export function updateDailyLimit(
  id: number | string,
  dailyLimit: number,
): Promise<CardResponse> {
  return apiRequest<CardResponse>(`/api/cards/${id}/daily-limit`, {
    method: 'PATCH',
    body: JSON.stringify({ dailyLimit }),
  });
}
