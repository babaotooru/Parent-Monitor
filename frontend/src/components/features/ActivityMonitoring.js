import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Card, CardContent, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, LinearProgress, Alert
} from '@mui/material';
import {
  DirectionsRun as ActivityIcon,
  TrendingUp,
  TrendingDown,
  Warning as WarningIcon
} from '@mui/icons-material';
import { outputAPI } from '../../services/ApiService';

const ActivityMonitoring = ({ userId }) => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await outputAPI.getActivityMonitoring(userId);
      setActivityData(response.data);
    } catch (error) {
      console.error('Error loading activity:', error);
      setActivityData({
        dailyActivity: {
          stepsWalked: 4250,
          phoneInteraction: 'Normal',
          morningActivity: 'Detected',
          eveningWalk: 'Not Detected',
          activeMinutes: 180,
          movementLevel: 'Moderate'
        },
        routineAnalysis: {
          expectedWakeTime: '7:00 AM',
          actualActivity: '9:10 AM',
          alert: 'Alert: Possible routine disruption',
          sleepPattern: 'Normal',
          walkingPattern: 'Reduced',
          phoneActivity: 'Low'
        },
        riskLevel: 'Medium'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <ActivityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Activity Monitoring
      </Typography>

      {/* Daily Activity Stats */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Steps Walked</Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {activityData?.dailyActivity?.stepsWalked?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Active Minutes</Typography>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {activityData?.dailyActivity?.activeMinutes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Movement Level</Typography>
              <Typography variant="h5" fontWeight="bold">
                {activityData?.dailyActivity?.movementLevel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Risk Level</Typography>
              <Chip
                label={activityData?.riskLevel}
                color={
                  activityData?.riskLevel === 'Low' ? 'success' :
                  activityData?.riskLevel === 'Medium' ? 'warning' : 'error'
                }
                sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Routine Analysis */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Routine Analysis
            </Typography>

            {activityData?.routineAnalysis?.alert && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {activityData.routineAnalysis.alert}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Expected Wake Time</Typography>
                <Typography variant="h6">{activityData?.routineAnalysis?.expectedWakeTime}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Actual Activity Start</Typography>
                <Typography variant="h6">{activityData?.routineAnalysis?.actualActivity}</Typography>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Sleep Pattern</Typography>
                  <Chip label={activityData?.routineAnalysis?.sleepPattern} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Walking Pattern</Typography>
                  <Chip label={activityData?.routineAnalysis?.walkingPattern} color="warning" />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Phone Activity</Typography>
                  <Chip label={activityData?.routineAnalysis?.phoneActivity} />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ActivityMonitoring;
