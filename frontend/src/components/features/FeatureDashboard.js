import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Button, Card, CardContent,
  CardActions, Avatar, Chip, IconButton, Badge, Tabs, Tab, AppBar,
  Toolbar, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocalPharmacy as MedicineIcon,
  DirectionsRun as ActivityIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  HealthAndSafety as SafetyIcon,
  Assessment as ReportIcon,
  Psychology as AIIcon,
  Timeline as TimelineIcon,
  ReportProblem as EmergencyIcon,
  Mood as MoodIcon,
  FallDetection as FallDetectionIcon,
  VideoCall as VideoIcon,
  AdminPanelSettings as AdminIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import WebSocketService from '../../services/WebSocketService';

// Import all feature components
import LoginAuthentication from './LoginAuthentication';
import GuardianDashboard from './GuardianDashboard';
import ParentInterface from './ParentInterface';
import MedicineReminder from './MedicineReminder';
import ActivityMonitoring from './ActivityMonitoring';
import FallDetection from './FallDetection';
import EmergencyAlert from './EmergencyAlert';
import LocationTracking from './LocationTracking';
import AIBehaviorMonitoring from './AIBehaviorMonitoring';
import SafetyScore from './SafetyScore';
import AlertNotifications from './AlertNotifications';
import HealthReport from './HealthReport';
import GuardianAnalytics from './GuardianAnalytics';
import AdminMonitoring from './AdminMonitoring';
import EmergencyResponse from './EmergencyResponse';
import UserProfile from './UserProfile';

const FeatureDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Feature list based on user role
  const features = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon />, roles: ['GUARDIAN', 'PARENT', 'ADMIN'] },
    { id: 'profile', name: 'User Profile', icon: <PersonIcon />, roles: ['GUARDIAN', 'PARENT', 'ADMIN'] },
    { id: 'medicine', name: 'Medicine Reminder', icon: <MedicineIcon />, roles: ['GUARDIAN', 'PARENT'] },
    { id: 'activity', name: 'Activity Monitoring', icon: <ActivityIcon />, roles: ['GUARDIAN', 'PARENT'] },
    { id: 'fall-detection', name: 'Fall Detection', icon: <WarningIcon />, roles: ['GUARDIAN', 'PARENT'] },
    { id: 'emergency', name: 'Emergency Alerts', icon: <EmergencyIcon />, roles: ['GUARDIAN', 'PARENT', 'ADMIN'] },
    { id: 'location', name: 'Location Tracking', icon: <LocationIcon />, roles: ['GUARDIAN', 'PARENT'] },
    { id: 'ai-behavior', name: 'AI Behavior Analysis', icon: <AIIcon />, roles: ['GUARDIAN'] },
    { id: 'safety-score', name: 'Safety Score', icon: <SafetyIcon />, roles: ['GUARDIAN'] },
    { id: 'notifications', name: 'Notifications', icon: <NotificationsIcon />, roles: ['GUARDIAN', 'PARENT'] },
    { id: 'health-report', name: 'Health Reports', icon: <ReportIcon />, roles: ['GUARDIAN'] },
    { id: 'analytics', name: 'Guardian Analytics', icon: <TimelineIcon />, roles: ['GUARDIAN'] },
    { id: 'admin', name: 'Admin Monitoring', icon: <AdminIcon />, roles: ['ADMIN'] },
    { id: 'emergency-response', name: 'Emergency Response', icon: <EmergencyIcon />, roles: ['GUARDIAN', 'ADMIN'] },
  ].filter(f => f.roles.includes(user?.role));

  useEffect(() => {
    connectWebSocket();
    return () => WebSocketService.disconnect();
  }, []);

  const connectWebSocket = () => {
    try {
      WebSocketService.connect();
      
      WebSocketService.subscribe('/topic/emergencies', (message) => {
        addNotification({
          type: 'emergency',
          message: message.description,
          severity: 'error',
          timestamp: new Date()
        });
      });

      WebSocketService.subscribe(`/user/${user?.username}/queue/notifications`, (message) => {
        addNotification(message);
      });

      setWsConnected(true);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50));
    
    // Show browser notification if permissions granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Parent Care Alert', {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/logo192.png'
      });
    }
  };

  const handleNavigate = (featureId) => {
    setSelectedFeature(featureId);
  };

  const renderFeature = () => {
    switch (selectedFeature) {
      case 'dashboard':
        return user?.role === 'GUARDIAN' ? <GuardianDashboard userId={user.id} onNavigate={handleNavigate} /> :
               user?.role === 'PARENT' ? <ParentInterface userId={user.id} onNavigate={handleNavigate} /> :
               <AdminMonitoring />;
      case 'profile':
        return <UserProfile userId={user.id} />;
      case 'medicine':
        return <MedicineReminder userId={user.id} />;
      case 'activity':
        return <ActivityMonitoring userId={user.id} />;
      case 'fall-detection':
        return <FallDetection userId={user.id} />;
      case 'emergency':
        return <EmergencyAlert userId={user.id} />;
      case 'location':
        return <LocationTracking userId={user.id} />;
      case 'ai-behavior':
        return <AIBehaviorMonitoring userId={user.id} />;
      case 'safety-score':
        return <SafetyScore userId={user.id} />;
      case 'notifications':
        return <AlertNotifications userId={user.id} notifications={notifications} />;
      case 'health-report':
        return <HealthReport userId={user.id} />;
      case 'analytics':
        return <GuardianAnalytics userId={user.id} />;
      case 'admin':
        return <AdminMonitoring />;
      case 'emergency-response':
        return <EmergencyResponse userId={user.id} />;
      default:
        return <Typography>Feature not found</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? 280 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: '#1976d2',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight="bold">
            ParentCare
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
              {user?.fullName?.[0] || user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.fullName || user?.username}
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: wsConnected ? '#4caf50' : '#f44336',
              }}
            />
            <Typography variant="caption">
              {wsConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <List sx={{ flexGrow: 1, px: 1 }}>
          {features.map((feature) => (
            <ListItem
              button
              key={feature.id}
              selected={selectedFeature === feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={feature.name}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: selectedFeature === feature.id ? 'bold' : 'normal',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <List sx={{ px: 1, pb: 2 }}>
          <ListItem button onClick={logout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', overflow: 'auto' }}>
        {/* Top Bar */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar>
            {!drawerOpen && (
              <IconButton
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {features.find(f => f.id === selectedFeature)?.name || 'Dashboard'}
            </Typography>

            <IconButton color="inherit">
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Feature Content */}
        <Box sx={{ p: 3 }}>
          {renderFeature()}
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureDashboard;
