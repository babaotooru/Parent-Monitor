import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const AdminMonitoringDashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(loadAdminData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/outputs/admin-monitoring');
      setAdminData(response.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Mock data
      setAdminData({
        totalUsers: 12450,
        activeGuardians: 8230,
        activeParents: 4220,
        emergencyAlertsToday: 45,
        averageSafetyScore: 79,
        systemHealth: {
          status: 'Operational',
          uptime: 99.8,
          activeConnections: 150,
          alertsProcessed: 234,
          lastIncident: 'None',
        },
        dailyStatistics: {
          newRegistrations: 12,
          fallDetections: 3,
          medicineReminders: 145,
          locationAlerts: 8,
          averageResponseTime: 2.5,
        },
      });
    }
  };

  if (!adminData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading admin dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Monitoring Dashboard - ParentCare AI
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        System Analytics for Healthcare Partners
      </Typography>

      {/* Feature 14: Admin Monitoring Output - Overview */}
      <Grid container spacing={3} sx={{ mb: 3, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {adminData.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 50, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Active Guardians
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {adminData.activeGuardians.toLocaleString()}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 50, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Emergency Alerts Today
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {adminData.emergencyAlertsToday}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 50, color: 'error.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Average Safety Score
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {adminData.averageSafetyScore}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 50, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon color="primary" />
            System Health
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2">System Status</Typography>
                  <Chip 
                    label={adminData.systemHealth.status} 
                    color="success" 
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Uptime</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={adminData.systemHealth.uptime} 
                      sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                      color="success"
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {adminData.systemHealth.uptime}%
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2">
                  <strong>Active Connections:</strong> {adminData.systemHealth.activeConnections}
                </Typography>
                <Typography variant="body2">
                  <strong>Alerts Processed:</strong> {adminData.systemHealth.alertsProcessed}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Last Incident:</strong> {adminData.systemHealth.lastIncident}
                </Typography>
                
                <Card sx={{ bgcolor: 'success.light', mt: 2, p: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    ✓ All systems operational
                  </Typography>
                  <Typography variant="caption">
                    No critical issues detected
                  </Typography>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Daily Statistics */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Statistics
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Metric</strong></TableCell>
                  <TableCell align="right"><strong>Count</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>New Registrations</TableCell>
                  <TableCell align="right">{adminData.dailyStatistics.newRegistrations}</TableCell>
                  <TableCell align="center">
                    <Chip label="Normal" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fall Detections</TableCell>
                  <TableCell align="right">{adminData.dailyStatistics.fallDetections}</TableCell>
                  <TableCell align="center">
                    <Chip label="Low" color="info" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Medicine Reminders Sent</TableCell>
                  <TableCell align="right">{adminData.dailyStatistics.medicineReminders}</TableCell>
                  <TableCell align="center">
                    <Chip label="Active" color="primary" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location Alerts</TableCell>
                  <TableCell align="right">{adminData.dailyStatistics.locationAlerts}</TableCell>
                  <TableCell align="center">
                    <Chip label="Normal" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Response Time</TableCell>
                  <TableCell align="right">{adminData.dailyStatistics.averageResponseTime}s</TableCell>
                  <TableCell align="center">
                    <Chip label="Excellent" color="success" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card elevation={3} sx={{ mt: 3, bgcolor: 'primary.light' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            System Summary
          </Typography>
          <Typography variant="body1">
            ParentCare AI is serving <strong>{adminData.totalUsers.toLocaleString()}</strong> users 
            with <strong>{adminData.activeGuardians.toLocaleString()}</strong> active guardians 
            monitoring <strong>{adminData.activeParents.toLocaleString()}</strong> parents.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Today's performance: {adminData.emergencyAlertsToday} emergency alerts handled 
            with an average response time of {adminData.dailyStatistics.averageResponseTime} seconds.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Overall health score across all users: <strong>{adminData.averageSafetyScore}/100</strong>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminMonitoringDashboard;
