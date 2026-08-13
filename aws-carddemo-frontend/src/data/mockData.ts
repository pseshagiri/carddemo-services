export const accounts = [
  {
    accountId: '10000000001',
    customerName: 'John Smith',
    status: 'Y',
    currentBalance: 1250.55,
    creditLimit: 5000,
    cashCreditLimit: 1500
  },
  {
    accountId: '10000000002',
    customerName: 'Jane Doe',
    status: 'N',
    currentBalance: 845.0,
    creditLimit: 3000,
    cashCreditLimit: 1000
  }
];
export const cards = [
  {
    cardNumber: '4111111111111111',
    accountId: '10000000001',
    embossedName: 'JOHN SMITH',
    activeStatus: 'Y',
    expirationDate: '2027-12-31'
  },
  {
    cardNumber: '5555555555554444',
    accountId: '10000000002',
    embossedName: 'JANE DOE',
    activeStatus: 'N',
    expirationDate: '2026-06-30'
  }
];
export const transactions = [
  {
    transactionId: 'TXN0001',
    amount: 120.25,
    typeCode: 'PU',
    originTs: '2026-08-03T10:00:00Z',
    cardNumber: '4111111111111111'
  },
  {
    transactionId: 'TXN0002',
    amount: 45.99,
    typeCode: 'RF',
    originTs: '2026-08-03T12:00:00Z',
    cardNumber: '4111111111111111'
  }
];
export const batchReports = [
  { reportName: 'ACCTOUT', category: 'Account Report', status: 'Available' },
  { reportName: 'INTRPT', category: 'Interest Report', status: 'Available' },
  { reportName: 'DALYRPT', category: 'Daily Processing Report', status: 'Available' },
  { reportName: 'CUSTRPT', category: 'Customer Validation Report', status: 'Available' },
  { reportName: 'STMTOUT', category: 'Statement Output', status: 'Available' }
];