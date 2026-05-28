import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import ProtectedRoute from './routes/ProtectedRoute';

// Layout
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/auth/Unauthorized';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtocolControl from './pages/admin/AdminProtocolControl';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminProfile from './pages/admin/AdminProfile';

// Lender
import LenderDashboard from './pages/lender/LenderDashboard';
import LenderSupply from './pages/lender/LenderSupply';
import LenderActivity from './pages/lender/LenderActivity';
import LenderProfile from './pages/lender/LenderProfile';

// Borrower
import BorrowerDashboard from './pages/borrower/BorrowerDashboard';
import BorrowerLoans from './pages/borrower/BorrowerLoans';
import BorrowerRisk from './pages/borrower/BorrowerRisk';
import BorrowerProfile from './pages/borrower/BorrowerProfile';

// Liquidator
import LiquidatorDashboard from './pages/liquidator/LiquidatorDashboard';
import LiquidationCenter from './pages/liquidator/LiquidationCenter';
import LiquidationHistory from './pages/liquidator/LiquidationHistory';
import LiquidatorProfile from './pages/liquidator/LiquidatorProfile';

// DAO
import GovernanceDashboard from './pages/dao/GovernanceDashboard';
import CreateProposal from './pages/dao/CreateProposal';
import ProposalDetails from './pages/dao/ProposalDetails';
import DaoProfile from './pages/dao/DaoProfile';

// Auditor
import AuditorDashboard from './pages/auditor/AuditorDashboard';
import AuditEvents from './pages/auditor/AuditEvents';
import SystemHealth from './pages/auditor/SystemHealth';
import AuditorProfile from './pages/auditor/AuditorProfile';

// Shared
import Markets from './pages/shared/Markets';
import CrossChain from './pages/shared/CrossChain';
import FlashLoanSimulation from './pages/shared/FlashLoanSimulation';
import TraceHistory from './pages/shared/TraceHistory';

const App = () => {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="flex bg-[#0a0b0d] min-h-screen">
            {/* Sidebar logic */}
            <Routes>
                <Route path="/login" element={null} />
                <Route path="/register" element={null} />
                <Route path="*" element={<Sidebar />} />
            </Routes>

            <div className="flex-1 flex flex-col">
              {/* Navbar logic */}
              <Routes>
                  <Route path="/login" element={null} />
                  <Route path="/register" element={null} />
                  <Route path="*" element={<Navbar />} />
              </Routes>

              <main className="flex-1 p-8">
                <Routes>
                  {/* Public Access */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* 👑 ADMIN ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/control" element={<AdminProtocolControl />} />
                    <Route path="/admin/logs" element={<AdminAuditLogs />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />
                  </Route>

                  {/* 💰 LENDER ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['lender', 'super_admin']} />}>
                    <Route path="/lender/dashboard" element={<LenderDashboard />} />
                    <Route path="/lender/supply" element={<LenderSupply />} />
                    <Route path="/lender/activity" element={<LenderActivity />} />
                    <Route path="/lender/profile" element={<LenderProfile />} />
                  </Route>

                  {/* 🏦 BORROWER ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['borrower', 'super_admin']} />}>
                    <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
                    <Route path="/borrower/loans" element={<BorrowerLoans />} />
                    <Route path="/borrower/risk" element={<BorrowerRisk />} />
                    <Route path="/borrower/profile" element={<BorrowerProfile />} />
                  </Route>

                  {/* ⚔ LIQUIDATOR ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['liquidator', 'super_admin']} />}>
                    <Route path="/liquidator/dashboard" element={<LiquidatorDashboard />} />
                    <Route path="/liquidator/center" element={<LiquidationCenter />} />
                    <Route path="/liquidator/history" element={<LiquidationHistory />} />
                    <Route path="/liquidator/profile" element={<LiquidatorProfile />} />
                  </Route>

                  {/* 🗳 DAO ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['dao_member', 'super_admin']} />}>
                    <Route path="/dao/dashboard" element={<GovernanceDashboard />} />
                    <Route path="/dao/create" element={<CreateProposal />} />
                    <Route path="/dao/proposal/:id" element={<ProposalDetails />} />
                    <Route path="/dao/profile" element={<DaoProfile />} />
                  </Route>

                  {/* 🕵 AUDITOR ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['auditor', 'super_admin']} />}>
                    <Route path="/auditor/dashboard" element={<AuditorDashboard />} />
                    <Route path="/auditor/events" element={<AuditEvents />} />
                    <Route path="/auditor/health" element={<SystemHealth />} />
                    <Route path="/auditor/profile" element={<AuditorProfile />} />
                  </Route>

                  {/* 🌍 SHARED GLOBAL ROUTES */}
                  <Route element={<ProtectedRoute allowedRoles={['borrower', 'lender', 'liquidator', 'super_admin', 'auditor', 'dao_member']} />}>
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/bridge" element={<CrossChain />} />
                    <Route path="/flash-loan" element={<FlashLoanSimulation />} />
                    <Route path="/trace" element={<TraceHistory />} />
                  </Route>

                  {/* Default Redirect */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
};

export default App;