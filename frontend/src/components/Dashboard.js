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
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import WebSocketService from '../services/WebSocketService';
import {
  activityAPI,
  emergencyAPI,
  safetyScoreAPI,
  dashboardAPI,
  userAPI,
} from '../services/ApiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [safetyScores, setSafetyScores] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmergencies: 0,
    todayActivities: 0,
    avgSafetyScore: 0,
  });

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
      
      // Fetch initial data
      const [usersRes, emergenciesRes, anomaliesRes] = await Promise.all([
        userAPI.getAll(),
        emergencyAPI.getPending(),
        activityAPI.getAnomalies(),
      ]);

      setUsers(usersRes.data || []);
      setEmergencies(emergenciesRes.data || []);
      setActivities(anomaliesRes.data || []);

      // Calculate statistics
      setStats({
        totalUsers: usersRes.data?.length || 0,
        activeEmergencies: emergenciesRes.data?.filter(e => e.responseStatus === 'PENDING').length || 0,
        todayActivities: anomaliesRes.data?.length || 0,
        avgSafetyScore: 85, // This would come from backend
      });

      setLoading(false);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    WebSocketService.connect(
      () => {
        console.log('Dashboard connected to WebSocket');
        setWsConnected(true);

        // Subscribe to real-time events
        WebSocketService.subscribeToEvents((event) => {
          console.log('Received event:', event);
          setRealtimeEvents((prev) => [event, ...prev].slice(0, 50));
          
          // Update statistics based on event type
          if (event.type === 'ACTIVITY') {
            setStats(prev => ({ ...prev, todayActivities: prev.todayActivities + 1 }));
          }
        });

        // Subscribe to emergency alerts
        WebSocketService.subscribeToEmergencies((event) => {
          console.log('Emergency alert:', event);
          setRealtimeEvents((prev) => [event, ...prev].slice(0, 50));
          setEmergencies((prev) => [...prev, event]);
          setStats(prev => ({ ...prev, activeEmergencies: prev.activeEmergencies + 1 }));
          
          // Play alert sound or show notification
          showNotification(event);
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setWsConnected(false);
      }
    );
  };

  const showNotification = (event) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ParentCare Alert', {
        body: event.message,
        icon: '/logo192.png',
        badge: '/logo192.png',
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'EMERGENCY':
        return <EmergencyIcon color="error" />;
      case 'FALL_DETECTION':
        return <WarningIcon color="warning" />;
      case 'ACTIVITY':
        return <ActivityIcon color="primary" />;
      case 'LOCATION_UPDATE':
        return <LocationIcon color="info" />;
      case 'MEDICINE_REMINDER':
        return <MedicationIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            ParentCare AI Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Real-time Monitoring & Analytics
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Chip
            icon={wsConnected ? <CheckCircleIcon /> : <ErrorIcon />}
            label={wsConnected ? 'Connected' : 'Disconnected'}
            color={wsConnected ? 'success' : 'error'}
            variant="outlined"
          />
          <Badge badgeContent={stats.activeEmergencies} color="error">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Badge>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  <PersonIcon fontSize="large" />
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
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Active Emergencies
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {stats.activeEmergencies}
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
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Today's Activities
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.todayActivities}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#388e3c', width: 56, height: 56 }}>
                  <TrendingUpIcon fontSize="large" />
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
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Avg Safety Score
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {stats.avgSafetyScore}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                  <HealthIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Real-time Events Feed */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '600px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Real-time Activity Feed
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {realtimeEvents.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">
                  No events yet. Waiting for real-time updates...
                </Typography>
              </Box>
            ) : (
              <List>
                {realtimeEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{getEventIcon(event.type)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">
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
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              {event.message}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {event.timestamp ? format(new Date(event.timestamp), 'PPpp') : 'Just now'}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < realtimeEvents.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Emergency Alerts */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '600px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="error">
              Emergency Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {emergencies.length === 0 ? (
              <Alert severity="success">No active emergencies</Alert>
            ) : (
              <List>
                {emergencies.slice(0, 10).map((emergency, index) => (
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
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Users List */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Monitored Users
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {users.map((user) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {user.username}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={user.role === 'PARENT' ? 'Monitored' : 'Guardian'}
                        size="small"
                        color={user.role === 'PARENT' ? 'primary' : 'secondary'}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
