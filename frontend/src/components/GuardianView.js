import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Badge,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  DirectionsRun as ActivityIcon,
  LocationOn as LocationIcon,
  LocalPharmacy as MedicationIcon,
  TrendingUp as TrendingUpIcon,
  LocalHospital as EmergencyIcon,
  HealthAndSafety as HealthIcon,
  VideoCall as VideoIcon,
  Phone as PhoneIcon,
  Psychology as AIIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import WebSocketService from '../services/WebSocketService';
import { userAPI, emergencyAPI, activityAPI, safetyScoreAPI } from '../services/ApiService';

const GuardianView = () => {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [parents, setParents] = useState([]);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    initializeDashboard();
    connectWebSocket();

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      
      // Fetch parents (users with role PARENT)
      const usersRes = await userAPI.getAll();
      const parentUsers = usersRes.data?.filter(u => u.role === 'PARENT') || [];
      
      // Mock data if empty
      if (parentUsers.length === 0) {
        const mockParent = {
          id: 1,
          username: 'parent1',
          role: 'PARENT',
          age: 75,
          lastActive: new Date(),
          safetyScore: 85,
        };
        setParents([mockParent]);
        setSelectedParent(mockParent);
      } else {
        setParents(parentUsers);
        setSelectedParent(parentUsers[0]);
      }

      // Fetch emergencies
      const emergenciesRes = await emergencyAPI.getPending();
      setEmergencies(emergenciesRes.data || []);

      setLoading(false);
      
      // Load AI insights
      loadAIInsights();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      // Set mock data
      const mockParent = {
        id: 1,
        username: 'Mom',
        role: 'PARENT',
        age: 75,
        lastActive: new Date(),
        safetyScore: 85,
      };
      setParents([mockParent]);
      setSelectedParent(mockParent);
      setLoading(false);
    }
  };

  const loadAIInsights = () => {
    // Mock AI insights
    setAiInsights([
      {
        type: 'SUCCESS',
        message: 'Maintained consistent sleep schedule for 7 days',
        timestamp: new Date(),
      },
      {
        type: 'WARNING',
        message: 'Activity level 20% below normal this week',
        timestamp: new Date(),
      },
      {
        type: 'INFO',
        message: 'Medicine compliance: 95% - Excellent!',
        timestamp: new Date(),
      },
      {
        type: 'ALERT',
        message: 'No movement detected between 7 AM - 9 AM yesterday',
        timestamp: new Date(),
      },
    ]);
  };

  const connectWebSocket = () => {
    WebSocketService.connect(
      () => {
        console.log('Guardian connected to WebSocket');
        setWsConnected(true);

        WebSocketService.subscribeToEvents((event) => {
          console.log('Received event:', event);
          setRealtimeEvents((prev) => [event, ...prev].slice(0, 50));
        });

        WebSocketService.subscribeToEmergencies((event) => {
          console.log('Emergency alert:', event);
          setRealtimeEvents((prev) => [event, ...prev].slice(0, 50));
          setEmergencies((prev) => [event, ...prev]);
          showNotification(event);
        });
      },
      (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      }
    );
  };

  const showNotification = (event) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ParentCare Alert', {
        body: event.message,
        icon: '/logo192.png',
      });
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'error',
      HIGH: 'warning',
      MEDIUM: 'info',
      LOW: 'success',
      SUCCESS: 'success',
      WARNING: 'warning',
      INFO: 'info',
      ALERT: 'error',
    };
    return colors[severity] || 'default';
  };

  const getRiskLevelColor = (score) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Guardian Dashboard
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Family Health Monitoring
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <Chip
              icon={wsConnected ? <CheckCircleIcon /> : <ErrorIcon />}
              label={wsConnected ? 'Connected' : 'Disconnected'}
              color={wsConnected ? 'success' : 'error'}
              size="small"
            />
            <Badge badgeContent={emergencies.length} color="error">
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Badge>
            <Button variant="outlined" onClick={logout} size="small">
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Activity Monitor" />
          <Tab label="AI Insights" />
          <Tab label="Emergency Logs" />
        </Tabs>

        {/* Overview Tab */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {/* Parent Cards */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Monitored Parents
                </Typography>
                <Grid container spacing={2}>
                  {parents.map((parent) => (
                    <Grid item xs={12} sm={6} md={4} key={parent.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          border: selectedParent?.id === parent.id ? 2 : 1,
                          borderColor: selectedParent?.id === parent.id ? 'primary.main' : 'divider',
                        }}
                        onClick={() => setSelectedParent(parent)}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                              {parent.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="h6" fontWeight="bold">
                                {parent.username}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Age: {parent.age || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box mb={2}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2">Safety Score</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {parent.safetyScore || 85}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={parent.safetyScore || 85}
                              color={getRiskLevelColor(parent.safetyScore || 85)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>

                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<VideoIcon />}
                              fullWidth
                            >
                              Call
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<LocationIcon />}
                              fullWidth
                            >
                              Track
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Statistics */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography color="textSecondary" variant="overline">
                        Today's Steps
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        3,500
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        +12% from yesterday
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                      <ActivityIcon fontSize="large" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography color="textSecondary" variant="overline">
                        Medicine Compliance
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        95%
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        Excellent
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                      <MedicationIcon fontSize="large" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography color="textSecondary" variant="overline">
                        Active Alerts
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="error">
                        {emergencies.length}
                      </Typography>
                      <Typography variant="caption">
                        Require attention
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#d32f2f', width: 56, height: 56 }}>
                      <EmergencyIcon fontSize="large" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography color="textSecondary" variant="overline">
                        Safety Score
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        85%
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        Low Risk
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#388e3c', width: 56, height: 56 }}>
                      <HealthIcon fontSize="large" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Real-time Feed */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, height: '500px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  <TimelineIcon sx={{ mr: 1 , verticalAlign: 'middle' }} />
                  Real-time Activity Feed
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {realtimeEvents.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography color="textSecondary">
                      No recent events. System is monitoring...
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {realtimeEvents.map((event, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>
                              {event.type === 'EMERGENCY' ? <EmergencyIcon /> : <ActivityIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {event.userName || `User ${event.userId}`}
                                </Typography>
                                <Chip
                                  label={event.severity}
                                  size="small"
                                  color={getSeverityColor(event.severity)}
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.primary">
                                  {event.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {event.timestamp ? format(new Date(event.timestamp), 'PPpp') : 'Just now'}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < realtimeEvents.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Emergency Alerts */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '500px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="error">
                  🚨 Emergency Alerts
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {emergencies.length === 0 ? (
                  <Alert severity="success">No active emergencies</Alert>
                ) : (
                  <List>
                    {emergencies.map((emergency, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'error.main' }}>
                              <EmergencyIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={emergency.type || emergency.message}
                            secondary={`User: ${emergency.userName || emergency.userId}`}
                          />
                        </ListItem>
                        <Button variant="contained" fullWidth size="small" sx={{ mb: 1 }}>
                          Respond
                        </Button>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Activity Monitor Tab */}
        {selectedTab === 1 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Activity Monitoring - {selectedParent?.username}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Track daily activities, movement patterns, and routine behavior
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Today's Activity</Typography>
                    <Box mt={2}>
                      <Typography>Steps: 3,500 / 5,000</Typography>
                      <LinearProgress variant="determinate" value={70} sx={{ mt: 1 }} />
                    </Box>
                    <Box mt={2}>
                      <Typography>Active Minutes: 45 / 30</Typography>
                      <LinearProgress variant="determinate" value={100} color="success" sx={{ mt: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Routine Status</Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="Wake Time: 7:15 AM" secondary="Normal (usual: 7:00 AM)" />
                        <CheckCircleIcon color="success" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Morning Walk: Completed" secondary="8:30 AM" />
                        <CheckCircleIcon color="success" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Phone Activity: Active" secondary="Last checked: 2 min ago" />
                        <CheckCircleIcon color="success" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* AI Insights Tab */}
        {selectedTab === 2 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <AIIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              AI Health Insights
            </Typography>
            <Alert severity="info" icon={<AIIcon />} sx={{ mb: 3 }}>
              AI continuously learns behavior patterns and detects anomalies
            </Alert>
            <Grid container spacing={2}>
              {aiInsights.map((insight, index) => (
                <Grid item xs={12} key={index}>
                  <Alert severity={getSeverityColor(insight.type)} variant="outlined">
                    <Typography variant="body2">{insight.message}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {format(insight.timestamp, 'PPpp')}
                    </Typography>
                  </Alert>
                </Grid>
              ))}
            </Grid>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Learned Patterns
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Sleep Pattern"
                        secondary="Usually sleeps 10:30 PM - 7:00 AM (8.5 hours)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Activity Pattern"
                        secondary="Morning walk 8:00-8:30 AM, Evening walk 6:00-6:30 PM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Meal Times"
                        secondary="Breakfast: 8:00 AM, Lunch: 1:00 PM, Dinner: 7:30 PM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone Usage"
                        secondary="Average 15 unlocks per day, Most active: 9 AM - 11 AM"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        )}

        {/* Emergency Logs Tab */}
        {selectedTab === 3 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Emergency History
            </Typography>
            {emergencies.length === 0 ? (
              <Alert severity="success">No emergency records</Alert>
            ) : (
              <List>
                {emergencies.map((emergency, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">{emergency.type}</Typography>
                        <Chip label={emergency.status || 'PENDING'} color="error" />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {emergency.message || 'Emergency alert triggered'}
                      </Typography>
                      <Typography variant="caption">
                        {emergency.timestamp ? format(new Date(emergency.timestamp), 'PPpp') : 'Recent'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default GuardianView;
