import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LoginPage from '../screens/LoginPage';
import AppLayout from '../shell/AppLayout';
import HomePage from '../screens/HomePage';
import AdminPage from '../screens/AdminPage';
import AddCustomerPage from '../screens/AddCustomerPage';
import CustomerConfirmationPage from '../screens/CustomerConfirmationPage';
import AccountListPage from '../screens/AccountListPage';
import AccountDetailPage from '../screens/AccountDetailPage';
import AccountEditPage from '../screens/AccountEditPage';
import AccountBalancePage from '../screens/AccountBalancePage';
import CardListPage from '../screens/CardListPage';
import CardDetailPage from '../screens/CardDetailPage';
import CardEditPage from '../screens/CardEditPage';
import TransactionListPage from '../screens/TransactionListPage';
import AddTransactionPage from '../screens/AddTransactionPage';
import TransactionComparePage from '../screens/TransactionComparePage';
import ReportsPage from '../screens/ReportsPage';
import BatchReportsPage from '../screens/BatchReportsPage';
import ErrorPage from '../screens/ErrorPage';
import UnauthorizedPage from '../screens/UnauthorizedPage';
import NotFoundPage from '../screens/NotFoundPage';
function Protected({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
function AdminOnly({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'A' ? children : <Navigate to="/unauthorized" replace />;
}
export default function AppRouter() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="accounts" element={<AccountListPage />} />
        <Route path="accounts/:accountId" element={<AccountDetailPage />} />
        <Route path="accounts/:accountId/edit" element={<AccountEditPage />} />
        <Route path="accounts/:accountId/balance" element={<AccountBalancePage />} />
        <Route path="cards" element={<CardListPage />} />
        <Route path="cards/:cardId" element={<CardDetailPage />} />
        <Route path="cards/:cardId/edit" element={<CardEditPage />} />
        <Route path="transactions" element={<TransactionListPage />} />
        <Route path="transactions/add" element={<AddTransactionPage />} />
        <Route path="transactions/compare" element={<TransactionComparePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="batch-reports" element={<BatchReportsPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="admin"
          element={
            <AdminOnly>
              <AdminPage />
            </AdminOnly>
          }
        />
        <Route
          path="customers/add"
          element={
            <AdminOnly>
              <AddCustomerPage />
            </AdminOnly>
          }
        />
        <Route
          path="customers/confirmation"
          element={
            <AdminOnly>
              <CustomerConfirmationPage />
            </AdminOnly>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BrowserRouter>
  );
}