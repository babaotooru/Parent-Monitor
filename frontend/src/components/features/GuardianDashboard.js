import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Button, Card, CardContent,
  Avatar, Chip, LinearProgress, Alert, CircularProgress, IconButton,
  Badge, List, ListItem, ListItemText, ListItemAvatar, Divider, Select,
  MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  LocalPharmacy as MedicineIcon,
  DirectionsRun as ActivityIcon,
  ReportProblem as EmergencyIcon,
  TrendingUp,
  TrendingDown,
  VideoCall as VideoIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { outputAPI, userAPI, communicationHelper, videoAPI } from '../../services/ApiService';
import WebSocketService from '../../services/WebSocketService';

const GuardianDashboard = ({ userId, onNavigate }) => {
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeUpdate, setRealtimeUpdate] = useState(null);

  useEffect(() => {
    loadParents();
  }, [userId]);

  useEffect(() => {
    if (selectedParent) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [selectedParent]);

  const loadParents = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      const parentList = response.data?.filter(u => u.role === 'PARENT') || [];
      
      // Mock parent if none exist
      if (parentList.length === 0) {
        parentList.push({
          id: 1,
          username: 'parent1',
          fullName: 'John Doe',
          role: 'PARENT',
          age: 75,
          active: true
        });
      }
      
      setParents(parentList);
      if (parentList.length > 0) {
        setSelectedParent(parentList[0].id);
      }
    } catch (error) {
      console.error('Error loading parents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    if (!selectedParent) return;
    
    try {
      setRefreshing(true);
      const response = await outputAPI.getGuardianDashboard(selectedParent);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set mock data
      setDashboardData({
        parentStatus: {
          status: 'Active',
          lastActivity: '5 minutes ago',
          minutesSinceActivity: 5
        },
        safetyScore: {
          score: 82,
          maxScore: 100,
          level: 'Good',
          trend: 'Stable'
        },
        medicineStatus: {
          medicines: [
            { time: '08:00 AM', name: 'Blood Pressure Med', status: 'TAKEN' },
            { time: '02:00 PM', name: 'Vitamin D', status: 'MISSED' },
            { time: '08:00 PM', name: 'Heart Med', status: 'PENDING' }
          ],
          takenCount: 1,
          missedCount: 1,
          complianceRate: 50.0
        },
        fallDetection: {
          status: 'No fall detected',
          lastCheck: 'Just now',
          incidents: 0
        },
        locationStatus: {
          location: 'Home',
          coordinates: '28.6139° N, 77.2090° E',
          inSafeZone: true,
          lastUpdate: '5 minutes ago'
        },
        recentAlerts: [
          {
            type: 'MEDICINE_MISSED',
            description: 'Missed afternoon vitamin',
            time: '02:30 PM',
            severity: 'MEDIUM'
          }
        ]
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedParentData = parents.find(p => p.id === selectedParent);
  const data = dashboardData;

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Guardian Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring for your loved ones
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Parent</InputLabel>
            <Select
              value={selectedParent || ''}
              label="Select Parent"
              onChange={(e) => setSelectedParent(e.target.value)}
            >
              {parents.map(parent => (
                <MenuItem key={parent.id} value={parent.id}>
                  {parent.fullName || parent.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <IconButton
            onClick={loadDashboardData}
            disabled={refreshing}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {realtimeUpdate && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setRealtimeUpdate(null)}>
          {realtimeUpdate}
        </Alert>
      )}

      {/* Parent Info Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
          >
            {selectedParentData?.fullName?.[0] || 'P'}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h5" fontWeight="bold">
              {selectedParentData?.fullName || 'Parent'}
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              <Chip
                icon={<PersonIcon />}
                label={`Age: ${selectedParentData?.age || 'N/A'}`}
                size="small"
              />
              <Chip
                icon={data?.parentStatus?.status === 'Active' ? <CheckIcon /> : <WarningIcon />}
                label={data?.parentStatus?.status || 'Unknown'}
                color={data?.parentStatus?.status === 'Active' ? 'success' : 'warning'}
                size="small"
              />
              <Chip
                label={`Last active: ${data?.parentStatus?.lastActivity || 'N/A'}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<VideoIcon />}
              color="success"
              onClick={() => {
                const roomId = `${userId}-${selectedParent}-${Date.now()}`;
                communicationHelper.openVideoCall(roomId);
              }}
            >
              Video Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<WhatsAppIcon />}
              color="success"
              onClick={() => {
                const phone = selectedParentData?.phoneNumber || selectedParentData?.emergencyContact1;
                if (phone) {
                  communicationHelper.openWhatsApp(phone, `Hi ${selectedParentData?.fullName || 'there'}, how are you doing today?`);
                } else {
                  alert('No phone number available for this parent. Please update their profile.');
                }
              }}
            >
              WhatsApp
            </Button>
            <Button
              variant="outlined"
              startIcon={<PhoneIcon />}
              onClick={() => {
                const phone = selectedParentData?.phoneNumber || selectedParentData?.emergencyContact1;
                if (phone) {
                  communicationHelper.makePhoneCall(phone);
                } else {
                  alert('No phone number available for this parent. Please update their profile.');
                }
              }}
            >
              Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              color="info"
              onClick={() => {
                const email = selectedParentData?.email;
                if (email) {
                  const subject = `Health Update - ${selectedParentData?.fullName || 'Parent'}`;
                  const body = `Health Report for ${selectedParentData?.fullName || 'Parent'}\n\n` +
                    `Safety Score: ${data?.safetyScore?.score || 'N/A'}/100 (${data?.safetyScore?.level || 'N/A'})\n` +
                    `Status: ${data?.parentStatus?.status || 'Unknown'}\n` +
                    `Last Activity: ${data?.parentStatus?.lastActivity || 'N/A'}\n` +
                    `Location: ${data?.locationStatus?.location || 'Unknown'}\n` +
                    `Medicine Compliance: ${Math.round(data?.medicineStatus?.complianceRate || 0)}%\n` +
                    `Medicines Taken: ${data?.medicineStatus?.takenCount || 0}, Missed: ${data?.medicineStatus?.missedCount || 0}\n` +
                    `Fall Incidents: ${data?.fallDetection?.incidents || 0}\n\n` +
                    `Report generated on ${new Date().toLocaleString()}`;
                  communicationHelper.sendEmail(email, subject, body);
                } else {
                  alert('No email address available for this parent. Please update their profile.');
                }
              }}
            >
              Email
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Safety Score */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Safety Score
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" my={3}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={data?.safetyScore?.score || 0}
                    size={120}
                    thickness={8}
                    color={
                      (data?.safetyScore?.score || 0) >= 80
                        ? 'success'
                        : (data?.safetyScore?.score || 0) >= 60
                        ? 'warning'
                        : 'error'
                    }
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="h3" fontWeight="bold">
                      {data?.safetyScore?.score || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box textAlign="center">
                <Chip
                  label={data?.safetyScore?.level || 'Unknown'}
                  color={
                    (data?.safetyScore?.score || 0) >= 80
                      ? 'success'
                      : (data?.safetyScore?.score || 0) >= 60
                      ? 'warning'
                      : 'error'
                  }
                  sx={{ fontWeight: 'bold' }}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Trend: {data?.safetyScore?.trend || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medicine Status */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <MedicineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Medicine Status
              </Typography>
              
              <Box my={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Compliance Rate
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data?.medicineStatus?.complianceRate || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                  color={
                    (data?.medicineStatus?.complianceRate || 0) >= 80
                      ? 'success'
                      : (data?.medicineStatus?.complianceRate || 0) >= 50
                      ? 'warning'
                      : 'error'
                  }
                />
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {Math.round(data?.medicineStatus?.complianceRate || 0)}%
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {data?.medicineStatus?.takenCount || 0}
                  </Typography>
                  <Typography variant="caption">Taken</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {data?.medicineStatus?.missedCount || 0}
                  </Typography>
                  <Typography variant="caption">Missed</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {(data?.medicineStatus?.medicines?.length || 0) -
                      (data?.medicineStatus?.takenCount || 0) -
                      (data?.medicineStatus?.missedCount || 0)}
                  </Typography>
                  <Typography variant="caption">Pending</Typography>
                </Box>
              </Box>

              <Button variant="outlined" fullWidth size="small" onClick={() => onNavigate && onNavigate('medicine')}>
                View Detailed Log
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Location & Fall Detection */}
        <Grid item xs={12} md={12} lg={4}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <LocationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Location & Safety
              </Typography>

              <Box my={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {data?.locationStatus?.inSafeZone ? (
                    <CheckIcon color="success" />
                  ) : (
                    <WarningIcon color="warning" />
                  )}
                  <Typography variant="h6">
                    {data?.locationStatus?.location || 'Unknown'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {data?.locationStatus?.coordinates || 'No coordinates'}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Updated: {data?.locationStatus?.lastUpdate || 'N/A'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Fall Detection
              </Typography>
              <Alert
                severity={data?.fallDetection?.incidents === 0 ? 'success' : 'error'}
                icon={data?.fallDetection?.incidents === 0 ? <CheckIcon /> : <WarningIcon />}
              >
                {data?.fallDetection?.status || 'No data'}
              </Alert>

              <Button variant="outlined" fullWidth size="small" sx={{ mt: 2 }} onClick={() => onNavigate && onNavigate('location')}>
                View Location History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <EmergencyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Recent Alerts
              </Typography>

              {data?.recentAlerts?.length > 0 ? (
                <List>
                  {data.recentAlerts.map((alert, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                alert.severity === 'HIGH'
                                  ? 'error.main'
                                  : alert.severity === 'MEDIUM'
                                  ? 'warning.main'
                                  : 'info.main',
                            }}
                          >
                            <WarningIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={alert.description}
                          secondary={`${alert.type} • ${alert.time}`}
                        />
                        <Chip
                          label={alert.severity}
                          size="small"
                          color={
                            alert.severity === 'HIGH'
                              ? 'error'
                              : alert.severity === 'MEDIUM'
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </ListItem>
                      {index < data.recentAlerts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="success">No recent alerts - All systems normal</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GuardianDashboard;
