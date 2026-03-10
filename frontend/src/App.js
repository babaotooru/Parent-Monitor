import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ParentView from './components/ParentView';
import GuardianView from './components/GuardianView';
import Dashboard from './components/Dashboard';
import GuardianDashboardView from './components/GuardianDashboardView';
import ParentInterfaceView from './components/ParentInterfaceView';
import AdminMonitoringDashboard from './components/AdminMonitoringDashboard';
import FeatureDashboard from './components/features/FeatureDashboard';

// Create professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'PARENT' ? '/parent' : '/guardian'} replace />;
  }

  return children;
};

function AppContent() {
  // Request notification permission
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* New comprehensive feature dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <FeatureDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Original views - kept for compatibility */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute requiredRole="PARENT">
            <ParentView />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/guardian"
        element={
          <ProtectedRoute requiredRole="GUARDIAN">
            <GuardianView />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* New comprehensive output views */}
      <Route
        path="/guardian-dashboard"
        element={
          <ProtectedRoute requiredRole="GUARDIAN">
            <GuardianDashboardView />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/parent-interface"
        element={
          <ProtectedRoute requiredRole="PARENT">
            <ParentInterfaceView />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminMonitoringDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
