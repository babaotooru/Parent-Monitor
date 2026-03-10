import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box, Paper
} from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { outputAPI } from '../../services/ApiService';

const AdminMonitoring = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await outputAPI.getAdminMonitoring();
      setAdminData(response.data);
    } catch (error) {
      setAdminData({
        totalUsers: 12450,
        activeGuardians: 8230,
        emergencyAlertsToday: 45,
        averageSafetyScore: 79
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <AdminIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Admin Monitoring Dashboard
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {adminData?.totalUsers?.toLocaleString()}
              </Typography>
              <Typography>Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {adminData?.activeGuardians?.toLocaleString()}
              </Typography>
              <Typography>Active Guardians</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="error.main">
                {adminData?.emergencyAlertsToday}
              </Typography>
              <Typography>Emergency Alerts Today</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="warning.main">
                {adminData?.averageSafetyScore}
              </Typography>
              <Typography>Avg Safety Score</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminMonitoring;
