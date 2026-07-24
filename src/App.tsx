import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { DataProvider } from './lib/DataContext';
import { ToastProvider } from './lib/ToastContext';
import { ProtectedRoute, RootRedirect } from './routes/ProtectedRoute';

import LoginPage from './features/auth/LoginPage';
import OtpPage from './features/auth/OtpPage';
import SignupPage from './features/auth/SignupPage';
import SignupConfirmationPage from './features/auth/SignupConfirmationPage';

import OwnerLayout from './features/owner/OwnerLayout';
import OwnerDashboardPage from './features/owner/DashboardPage';
import PropertiesPage from './features/owner/PropertiesPage';
import ContractsPage from './features/owner/ContractsPage';
import BillingPage from './features/owner/BillingPage';

import TenantLayout from './features/tenant/TenantLayout';
import TenantDashboardPage from './features/tenant/DashboardPage';
import PaymentPage from './features/tenant/PaymentPage';
import ContractSignPage from './features/tenant/ContractSignPage';
import ChamadosListPage from './features/tenant/ChamadosListPage';
import NewTicketPage from './features/tenant/NewTicketPage';
import ProfilePage from './features/tenant/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />

              <Route path="/entrar" element={<LoginPage />} />
              <Route path="/entrar/codigo" element={<OtpPage />} />
              <Route path="/criar-conta" element={<SignupPage />} />
              <Route path="/criar-conta/codigo" element={<OtpPage />} />
              <Route path="/criar-conta/confirmacao" element={<SignupConfirmationPage />} />

              <Route element={<ProtectedRoute role="proprietario" />}>
                <Route path="/painel" element={<OwnerLayout />}>
                  <Route index element={<OwnerDashboardPage />} />
                  <Route path="imoveis" element={<PropertiesPage />} />
                  <Route path="contratos" element={<ContractsPage />} />
                  <Route path="cobrancas" element={<BillingPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute role="inquilino" />}>
                <Route path="/app" element={<TenantLayout />}>
                  <Route index element={<TenantDashboardPage />} />
                  <Route path="pagar" element={<PaymentPage />} />
                  <Route path="contrato" element={<ContractSignPage />} />
                  <Route path="chamados" element={<ChamadosListPage />} />
                  <Route path="chamados/novo" element={<NewTicketPage />} />
                  <Route path="perfil" element={<ProfilePage />} />
                </Route>
              </Route>

              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
