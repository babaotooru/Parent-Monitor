import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  Fingerprint,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginOutput, setLoginOutput] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginOutput(null);
    
    const result = await login(username, password);
    
    if (result.success) {
      // Display login output for 2 seconds before redirecting
      setLoginOutput({
        status: 'Successful',
        userRole: result.user?.role || 'Guardian',
        sessionId: result.sessionId || '934857394',
        lastLogin: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        otpVerified: true,
        biometricEnabled: false,
        authMethod: 'Password'
      });
    } else {
      setError(result.error || 'Login failed');
      setLoginOutput({
        status: 'Failed',
        message: result.error || 'Invalid credentials'
      });
    }
  };

  const handleBiometricLogin = () => {
    // Mock biometric authentication output
    setLoginOutput({
      status: 'Successful',
      userRole: 'Guardian',
      sessionId: '934857395',
      lastLogin: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      otpVerified: true,
      biometricEnabled: true,
      authMethod: 'Biometric',
      biometricConfirmation: 'Fingerprint verified successfully'
    });
    
    // Simulate login after showing output
    setTimeout(() => {
      login('guardian1', 'any');
    }, 2000);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64 }}>
              <LockIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
              ParentCare AI
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Secure Family Monitoring
            </Typography>
          </Box>

          {/* Login Output Display */}
          {loginOutput && (
            <Card sx={{ mt: 3, bgcolor: loginOutput.status === 'Successful' ? 'success.light' : 'error.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {loginOutput.status === 'Successful' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <LockIcon color="error" />
                  )}
                  Login Status: {loginOutput.status}
                </Typography>
                
                {loginOutput.status === 'Successful' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>User Role:</strong> {loginOutput.userRole}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Session ID:</strong> {loginOutput.sessionId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Login:</strong> {loginOutput.lastLogin}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Authentication Method:</strong> {loginOutput.authMethod}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={loginOutput.otpVerified ? "OTP Verified" : "OTP Pending"} 
                        color={loginOutput.otpVerified ? "success" : "warning"}
                        size="small"
                      />
                      <Chip 
                        label={loginOutput.biometricEnabled ? "Biometric Enabled" : "Biometric Disabled"} 
                        color={loginOutput.biometricEnabled ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    {loginOutput.biometricConfirmation && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        {loginOutput.biometricConfirmation}
                      </Alert>
                    )}
                  </Box>
                )}
                
                {loginOutput.status === 'Failed' && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {loginOutput.message}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {error && !loginOutput && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              size="large"
            >
              Sign In
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Fingerprint />}
              onClick={handleBiometricLogin}
              sx={{ mb: 2 }}
            >
              Biometric Login
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.dark">
                🔑 Test Credentials
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <strong>Guardian:</strong> guardian1 / password123
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Parent:</strong> parent1 / password123
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Admin:</strong> admin1 / admin123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
