# AWS CardDemo — Frontend ↔ Backend Integration

> **Backend:** Spring Boot 3 · Java 17 · Spring Cloud Gateway · Eureka · Kafka  
> **Frontend:** React 18 · TypeScript · Vite  
> **API Gateway:** `http://localhost:8080`  
> **Frontend Dev Server:** `http://localhost:3000`

---

## Architecture Overview

```
Browser (React / Vite :3000)
       │
       │  /api/*  (proxied by Vite in dev — no CORS)
       ▼
API Gateway (:8080)  ←→  Eureka Server (:8761)
   │
   ├── /api/auth/**         → identity-service   (:8081)
   ├── /api/customers/**    → customer-service   (:8082)
   ├── /api/accounts/**     → account-service    (:8083)
   ├── /api/cards/**        → card-service       (:8084)
   ├── /api/transactions/** → transaction-service (:8085)
   └── /api/payments/**     → payment-service    (:8086)
```

All microservices connect to **PostgreSQL** (each with its own database schema) and communicate asynchronously via **Apache Kafka**.

The API Gateway uses **Eureka service discovery** (`lb://service-name` load-balanced URIs). In the `local` profile the gateway security is permit-all (no JWT enforcement at gateway level — services enforce auth individually).

### Response format

Services return plain DTOs directly — **no `ApiResponse<T>` wrapper envelope**.  
Errors use [RFC 7807 Problem Details](https://www.rfc-editor.org/rfc/rfc7807):

```json
{
  "title": "Resource Not Found",
  "detail": "Customer not found with id: 42",
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "timestamp": "2024-06-15T14:30:00Z"
}
```

---

## Service Port Map

| Service | Port | Database |
|---------|------|----------|
| Eureka Server | 8761 | — |
| API Gateway | 8080 | — |
| identity-service | 8081 | `carddemo_identity` (PostgreSQL) |
| customer-service | 8082 | `carddemo_customer` (PostgreSQL) |
| account-service | 8083 | `carddemo_account` (PostgreSQL) |
| card-service | 8084 | `carddemo_card` (PostgreSQL) |
| transaction-service | 8085 | `carddemo_transaction` (PostgreSQL) |
| payment-service | 8086 | `carddemo_payment` (PostgreSQL) |

---

## Files Changed

### API Layer (`src/api/`)

| File | Change Summary |
|------|----------------|
| `apiClient.ts` | Removed `/api/v1` path prefix; removed `ApiResponse<T>` envelope unwrap; updated `PageResponse<T>` fields (`page`, `last`); single token (no refresh token); proxy target `8082→8080` |
| `authApi.ts` | Endpoint `/api/auth/login`; response fields `accessToken`, `userId`, `roles` (camelCase); removed `refresh_token`/`full_name`; `logout()` is now synchronous (no server call) |
| `accountsApi.ts` | Path `/api/accounts`; all fields camelCase (`id`, `accountNumber`, `creditLimit`, `currentBalance`, etc.); `updateAccount` split into `updateCreditLimit` + `activateAccount` / `suspendAccount` / `closeAccount` PATCH endpoints |
| `cardsApi.ts` | Path `/api/cards`; fields camelCase (`id`, `cardMasked`, `cardHolderName`, `expiryMonth`, `expiryYear`, `dailyLimit`); `getCardsByAccount` returns `CardResponse[]` (not paginated); added `blockCard`, `unblockCard`, `reportLost`, `reportStolen`, `cancelCard`, `updateDailyLimit` |
| `transactionsApi.ts` | Path `/api/transactions`; fields camelCase (`id`, `transactionId`, `type`, `occurredAt`, `cardMasked`, `merchantName`); `CreateTransactionRequest` now requires `accountNumber`, `customerId`, `currency`; date-range uses `from`/`to` ISO LocalDateTime params |
| `customersApi.ts` | Path `/api/customers`; fields camelCase (`id`, `identityUserId`, `firstName`, `mailingAddress`); `CreateCustomerRequest` requires `identityUserId` instead of `ssn`; added `updateCustomer`, `listCustomers`, `activateCustomer`, `suspendCustomer`, `closeCustomer` |
| `reportsApi.ts` | No dedicated reports service in new backend; `getTransactionReport` now composes `getTransactionsByDateRange` + `getAccountById` client-side; returns `ReportSummary` with `summaryByType` breakdown |

### Auth (`src/auth/AuthContext.tsx`)

- `apiLogin` now returns `{ accessToken, userId, username, email, roles }` (camelCase)
- `setTokens(access, refresh)` replaced by `setToken(access)` (no refresh token)
- First/last name derived from `username` field (e.g. `john.doe` → `John Doe`)
- `logout()` clears localStorage only (identity-service has no logout endpoint)

### Config

| File | Change |
|------|--------|
| `vite.config.ts` | Proxy target `http://localhost:8082` → `http://localhost:8080` |

### Screens Updated

| Screen | Key field changes |
|--------|-------------------|
| `AccountListPage` | `account_number`→`accountNumber`, `customer_name`→`customerNumber`, `current_balance`→`currentBalance`, `credit_limit`→`creditLimit`, `account_id`→`id` |
| `AccountDetailPage` | All snake_case fields → camelCase; removed `cash_credit_limit`, `open_date`; added `type`, `currency`, `createdAt` |
| `AccountEditPage` | Uses `updateCreditLimit` + `activateAccount`/`suspendAccount`/`closeAccount` instead of `updateAccount`; removed `cashCreditLimit` field |
| `AccountBalancePage` | Uses `getAccountById` (no separate `/balance` endpoint in new service); shows `currentBalance`, `availableCredit`, `creditLimit`, `interestRate` |
| `CardListPage` | `getCardsByAccount` now returns `CardResponse[]`; fields `cardMasked`, `cardHolderName`, expiry as `MM/YYYY`; navigation uses `id` |
| `CardDetailPage` | Fields `cardMasked`, `cardHolderName`, `cardType`, `network`, `expiryMonth/Year`, `dailyLimit`, `issuedAt` |
| `CardEditPage` | Uses `activateCard`/`blockCard`/`updateDailyLimit` PATCH endpoints; removed expiry date and boolean toggles |
| `TransactionListPage` | Fields `type`, `occurredAt`, `cardMasked`, `merchantName`, `referenceId`, `status` |
| `AddTransactionPage` | Added required `accountNumber`, `customerId`, `currency` fields; `transaction_type`→`type`; removed city/state/zip |
| `TransactionComparePage` | Fields `id`, `transactionId`, `type`, `status`, `cardMasked`, `occurredAt`, `merchantName` |
| `AddCustomerPage` | Replaced `ssn`, address fields with `identityUserId` (required); `phone_number`→`phone`; `fico_score`→`annualIncome` |
| `ReportsPage` | Uses `ReportSummary` type; shows `accountNumber`, `currentBalance`, `creditLimit`, `availableCredit`, per-type breakdown |

---

## Authentication Flow

```
1. POST /api/auth/login  { username, password }
   ← { accessToken, tokenType, expiresIn, userId, username, email, roles }

2. accessToken saved to localStorage["carddemo_access_token"]
   AuthUser (userId, firstName, lastName, role) saved to localStorage["carddemo_user"]

3. All subsequent API calls:
   Authorization: Bearer <accessToken>

4. On logout:
   localStorage cleared, user navigated to /login

5. On page reload:
   localStorage["carddemo_user"] + token existence → user restored
```

**Role mapping:**

| Backend role | Frontend role | Access |
|---|---|---|
| `ADMIN` or `ROLE_ADMIN` | `'A'` | All routes including `/admin`, `/customers/add` |
| `USER` or `ROLE_USER` | `'U'` | Standard routes only |

---

## API Reference (via API Gateway `:8080`)

### Identity — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user → JWT |
| `POST` | `/api/auth/login` | Public | Login → JWT |
| `GET` | `/api/auth/validate-token` | Bearer | Validate token |
| `GET` | `/api/auth/users/{userId}` | Bearer | Get user profile |

### Customers — `/api/customers`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/customers` | Create customer |
| `GET` | `/api/customers` | List/search (paginated) |
| `GET` | `/api/customers/{id}` | Get by ID |
| `PUT` | `/api/customers/{id}` | Update |
| `PATCH` | `/api/customers/{id}/activate` | Activate |
| `PATCH` | `/api/customers/{id}/suspend` | Suspend |
| `PATCH` | `/api/customers/{id}/close` | Close |

### Accounts — `/api/accounts`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/accounts` | Open account |
| `GET` | `/api/accounts` | List (paginated) |
| `GET` | `/api/accounts/{id}` | Get by ID |
| `GET` | `/api/accounts/customer/{customerId}` | Accounts for customer |
| `PATCH` | `/api/accounts/{id}/activate` | Activate |
| `PATCH` | `/api/accounts/{id}/suspend` | Suspend |
| `PATCH` | `/api/accounts/{id}/close` | Close |
| `PATCH` | `/api/accounts/{id}/credit-limit` | Update credit limit |

### Cards — `/api/cards`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/cards` | Issue card |
| `GET` | `/api/cards/{id}` | Get by ID |
| `GET` | `/api/cards/account/{accountId}` | Cards for account |
| `GET` | `/api/cards/customer/{customerId}` | Cards for customer |
| `PATCH` | `/api/cards/{id}/activate` | Activate |
| `PATCH` | `/api/cards/{id}/block` | Block |
| `PATCH` | `/api/cards/{id}/unblock` | Unblock |
| `PATCH` | `/api/cards/{id}/report-lost` | Report lost |
| `PATCH` | `/api/cards/{id}/report-stolen` | Report stolen |
| `PATCH` | `/api/cards/{id}/daily-limit` | Update daily limit |

### Transactions — `/api/transactions`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/transactions` | Post transaction |
| `GET` | `/api/transactions/{id}` | Get by ID |
| `GET` | `/api/transactions/account/{accountId}` | Paginated |
| `GET` | `/api/transactions/account/{accountId}/range` | Date range (`?from=&to=` ISO LocalDateTime) |
| `PATCH` | `/api/transactions/{id}/reverse` | Reverse |

### Payments — `/api/payments`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/payments` | Initiate payment |
| `GET` | `/api/payments/{id}` | Get by ID |
| `GET` | `/api/payments/account/{accountId}` | Paginated |
| `PATCH` | `/api/payments/{id}/cancel` | Cancel |
| `PATCH` | `/api/payments/{id}/reverse` | Reverse |

---

## Vite Dev Proxy (CORS)

`vite.config.ts` forwards all `/api/*` requests to the API Gateway during development:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // API Gateway
      changeOrigin: true,
      secure: false,
    },
  },
},
```

---

## Environment Variables

Create `.env.local` in `aws-carddemo-frontend/`:

```env
# Empty = use Vite proxy (recommended for local dev)
VITE_API_BASE_URL=

# Point directly at deployed gateway for production:
# VITE_API_BASE_URL=https://api.your-domain.com
```

---

## Running Both Applications

### Prerequisites

- Node.js ≥ 18
- Java 17+, Maven 3.8+
- PostgreSQL 15 running (or Docker)
- Eureka server running on `:8761`

### Start Backend (microservices)

```bash
# Navigate to backend root
cd C:\Users\VickyKumarjaiswalJai\Documents\WTC-DWP\backend-app\Mohan\CardDemo_Backend_services

# 1. Start Eureka server (required first — all services register with it)
cd eureka-server
mvn spring-boot:run "-Dspring.profiles.active=local"

# 2. Start each microservice in a separate terminal (local profile = no Kafka, direct DB)
cd identity-service   && mvn spring-boot:run "-Dspring.profiles.active=local"   # :8081
cd customer-service   && mvn spring-boot:run "-Dspring.profiles.active=local"   # :8082
cd account-service    && mvn spring-boot:run "-Dspring.profiles.active=local"   # :8083
cd card-service       && mvn spring-boot:run "-Dspring.profiles.active=local"   # :8084
cd transaction-service && mvn spring-boot:run "-Dspring.profiles.active=local"  # :8085
cd payment-service    && mvn spring-boot:run "-Dspring.profiles.active=local"   # :8086

# 3. Start API Gateway last (needs Eureka to resolve lb:// routes)
cd api-gateway && mvn spring-boot:run "-Dspring.profiles.active=local"          # :8080
```

### Start Frontend (separate terminal)

```bash
cd aws-carddemo-frontend
npm install
npm run dev
# → http://localhost:3000
```

> ⚠️ **Both applications run completely separately.** The frontend is its own IBM Bob workspace (`aws-carddemo-frontend`). The backend is its own Java/Maven project in `CardDemo_Backend_services`. No files are shared between them.

### Production Build

```bash
cd aws-carddemo-frontend
npm run build
# Output in dist/ — deploy to any static host
# Set VITE_API_BASE_URL=https://your-gateway.example.com
```

---

## Key Integration Notes

| Topic | Details |
|-------|---------|
| **No `ApiResponse<T>` envelope** | Services return DTOs directly. `apiClient.ts` no longer unwraps `.data` |
| **RFC 7807 errors** | `GlobalExceptionHandler` returns `ProblemDetail` — error message is in `.detail` field |
| **camelCase fields** | All backend response fields use camelCase (`accountNumber`, not `account_number`) |
| **No refresh token** | `identity-service` only issues an `accessToken`. Token is stored in `localStorage["carddemo_access_token"]` |
| **Pagination shape** | `PageResponse<T>` has `{ content, page, size, totalElements, totalPages, last }` (not `number`) |
| **Cards not paginated** | `GET /api/cards/account/{accountId}` returns `CardResponse[]` directly, not a page |
| **Create transaction** | Now requires `accountNumber`, `customerId`, `currency` in addition to `accountId` |
| **Create customer** | Now requires `identityUserId` (user must exist in identity-service first) |
| **Reports** | No dedicated reports microservice — `reportsApi.ts` composes `transaction-service` + `account-service` calls client-side |

---

*Generated as part of the CardDemo COBOL → Spring Boot microservices modernisation project.*
