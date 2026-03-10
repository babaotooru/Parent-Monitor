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
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  TrendingUp,
  LocalPharmacy,
  DirectionsRun,
  LocationOn,
  FitnessCenter,
  EmergencyIcon,
} from '@mui/icons-material';
import axios from 'axios';

const GuardianDashboardView = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [medicineLog, setMedicineLog] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [fallDetection, setFallDetection] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [healthReport, setHealthReport] = useState(null);

  const parentId = 1; // Replace with actual parent ID

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const baseURL = 'http://localhost:8080/api/outputs';
      
      // Feature 2: Guardian Dashboard
      const dashboardRes = await axios.get(`${baseURL}/guardian-dashboard/${parentId}`);
      setDashboardData(dashboardRes.data);
      
      // Feature 4: Medicine Log
      const medicineRes = await axios.get(`${baseURL}/medicine-log/${parentId}`);
      setMedicineLog(medicineRes.data);
      
      // Feature 5: Activity Monitoring
      const activityRes = await axios.get(`${baseURL}/activity-monitoring/${parentId}`);
      setActivityData(activityRes.data);
      
      // Feature 6: Fall Detection
      const fallRes = await axios.get(`${baseURL}/fall-detection/${parentId}`);
      setFallDetection(fallRes.data);
      
      // Feature 8: Location Monitoring
      const locationRes = await axios.get(`${baseURL}/location-monitoring/${parentId}`);
      setLocationData(locationRes.data);
      
      // Feature 10: Safety Score
      const scoreRes = await axios.get(`${baseURL}/safety-score/${parentId}`);
      setSafetyScore(scoreRes.data);
      
      // Feature 12: Health Report
      const reportRes = await axios.get(`${baseURL}/health-report/${parentId}`);
      setHealthReport(reportRes.data);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'taken': return 'success';
      case 'missed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Guardian Dashboard - ParentCare AI
      </Typography>
      
      {/* Feature 2: Parent Status & Safety Score */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color={dashboardData.parentStatus?.status === 'Active' ? 'success' : 'error'} />
                Parent Status
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" color={dashboardData.parentStatus?.status === 'Active' ? 'success.main' : 'error.main'}>
                {dashboardData.parentStatus?.status || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last Activity: {dashboardData.parentStatus?.lastActivity || 'N/A'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                ({dashboardData.parentStatus?.minutesAgo || 0} minutes ago)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                Safety Score
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography variant="h3" color="primary">
                  {dashboardData.safetyScore?.score || 0}
                </Typography>
                <Typography variant="h5" color="textSecondary">
                  / {dashboardData.safetyScore?.maxScore || 100}
                </Typography>
              </Box>
              <Chip 
                label={dashboardData.safetyScore?.level || 'N/A'} 
                color="success" 
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Trend: {dashboardData.safetyScore?.trend || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feature 4: Medicine Status */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalPharmacy color="primary" />
            Medicine Status
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {medicineLog && (
            <>
              <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={`Taken: ${medicineLog.totalTaken}`} color="success" />
                <Chip label={`Missed: ${medicineLog.totalMissed}`} color="error" />
                <Chip label={`Pending: ${medicineLog.totalPending}`} color="warning" />
                <Chip label={`Compliance: ${medicineLog.complianceRate?.toFixed(1)}%`} color="info" />
              </Box>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Time</strong></TableCell>
                      <TableCell><strong>Medicine</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Dosage</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicineLog.medicineLog?.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell>{med.time}</TableCell>
                        <TableCell>{med.medicineName}</TableCell>
                        <TableCell>
                          <Chip label={med.status} color={getStatusColor(med.status)} size="small" />
                        </TableCell>
                        <TableCell>{med.dosage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {medicineLog.guardianNotification && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {medicineLog.guardianNotification}
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Feature 5: Activity Monitoring & Feature 10: Detailed Safety Score */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsRun color="primary" />
                Daily Activity
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {activityData?.dailyActivity && (
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Steps Walked" 
                      secondary={`${activityData.dailyActivity.stepsWalked} steps`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Phone Interaction" 
                      secondary={activityData.dailyActivity.phoneInteraction}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Morning Activity" 
                      secondary={activityData.dailyActivity.morningActivity}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Evening Walk" 
                      secondary={activityData.dailyActivity.eveningWalk}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Activity Level" 
                      secondary={activityData.dailyActivity.activityLevel}
                    />
                  </ListItem>
                </List>
              )}
              
              {activityData?.routineAnalysis && activityData.routineAnalysis.alert && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {activityData.routineAnalysis.alert}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FitnessCenter color="primary" />
                Safety Score Breakdown
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {safetyScore?.dailySafetyScore && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Activity Score</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={safetyScore.dailySafetyScore.activityScore} 
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Typography variant="caption">{safetyScore.dailySafetyScore.activityScore}/100</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Medicine Compliance</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={safetyScore.dailySafetyScore.medicineCompliance} 
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      color="success"
                    />
                    <Typography variant="caption">{safetyScore.dailySafetyScore.medicineCompliance}/100</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Sleep Pattern</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={safetyScore.dailySafetyScore.sleepPattern} 
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Typography variant="caption">{safetyScore.dailySafetyScore.sleepPattern}/100</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Mobility</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={safetyScore.dailySafetyScore.mobility} 
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Typography variant="caption">{safetyScore.dailySafetyScore.mobility}/100</Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Overall: {safetyScore.overallScore}/100
                  </Typography>
                  <Chip label={`Trend: ${safetyScore.healthTrend}`} color="info" size="small"/>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feature 6: Fall Detection & Feature 8: Location Monitoring */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color={fallDetection?.status === 'Fall Detected' ? 'error' : 'success'} />
                Fall Detection
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {fallDetection && (
                <>
                  <Typography variant="h5" color={fallDetection.status === 'Fall Detected' ? 'error' : 'success.main'}>
                    {fallDetection.status}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Movement Level: {fallDetection.movementLevel}
                  </Typography>
                  
                  {fallDetection.lastFallEvent && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="body2" fontWeight="bold">Fall Detected!</Typography>
                      <Typography variant="body2">Time: {fallDetection.lastFallEvent.time}</Typography>
                      <Typography variant="body2">Location: {fallDetection.lastFallEvent.location}</Typography>
                      <Typography variant="body2">Severity: {fallDetection.lastFallEvent.severity}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Alerts sent to: {fallDetection.alertsSentTo?.join(', ')}
                      </Typography>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                Location Status
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {locationData?.locationStatus && (
                <>
                  <Typography variant="h6">{locationData.locationStatus.currentLocation}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationData.locationStatus.address}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Coordinates: {locationData.locationStatus.coordinates}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Last Movement: {locationData.locationStatus.lastMovement}
                  </Typography>
                  <Typography variant="caption" display="block">
                    GPS Accuracy: {locationData.locationStatus.gpsAccuracy}
                  </Typography>
                  
                  <Chip 
                    label={locationData.locationStatus.inSafeZone ? "In Safe Zone" : "Outside Safe Zone"} 
                    color={locationData.locationStatus.inSafeZone ? "success" : "warning"}
                    sx={{ mt: 2 }}
                  />
                  
                  {locationData.locationAlert && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2" fontWeight="bold">{locationData.locationAlert.alertType}</Typography>
                      <Typography variant="body2">{locationData.locationAlert.message}</Typography>
                      <Typography variant="body2">Distance: {locationData.locationAlert.distanceFromHome}</Typography>
                      <Typography variant="body2">Time: {locationData.locationAlert.time}</Typography>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feature 12: Health Report */}
      {healthReport && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Health Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Average Safety Score</Typography>
                <Typography variant="h5">{healthReport.weeklySummary?.averageSafetyScore}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Total Steps</Typography>
                <Typography variant="h5">{healthReport.weeklySummary?.totalSteps?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Medicine Compliance</Typography>
                <Typography variant="h5">{healthReport.weeklySummary?.medicineCompliance}%</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Emergency Alerts</Typography>
                <Typography variant="h5">{healthReport.weeklySummary?.emergencyAlerts}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default GuardianDashboardView;
