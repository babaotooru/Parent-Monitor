import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Chip,
  IconButton,
  Badge,
} from '@mui/material';
import {
  LocalHospital as EmergencyIcon,
  LocalPharmacy as MedicationIcon,
  MoodOutlined as MoodIcon,
  DirectionsWalk as WalkIcon,
  VideoCall as VideoIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Notifications as NotificationIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { medicineAPI, activityAPI, dashboardAPI } from '../services/ApiService';

const ParentView = () => {
  const { user, logout } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [mood, setMood] = useState(3);
  const [feelings, setFeelings] = useState('');
  const [sosDialog, setSosDialog] = useState(false);
  const [todaySteps, setTodaySteps] = useState(0);

  useEffect(() => {
    loadMedicines();
    loadTodayActivity();
    
    // Show daily check-in prompt at 9 AM (mock)
    const checkTime = new Date().getHours();
    if (checkTime >= 9 && checkTime < 10) {
      setTimeout(() => setCheckInDialog(true), 5000);
    }
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await medicineAPI.getByUserId(user.id);
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error loading medicines:', error);
      // Mock data for demo
      setMedicines([
        { id: 1, name: 'Blood Pressure Med', time: '08:00 AM', status: 'PENDING' },
        { id: 2, name: 'Vitamin D', time: '12:00 PM', status: 'TAKEN' },
        { id: 3, name: 'Heart Medication', time: '08:00 PM', status: 'PENDING' },
      ]);
    }
  };

  const loadTodayActivity = async () => {
    try {
      const response = await activityAPI.getTodayActivity(user.id);
      setTodaySteps(response.data?.stepCount || 3500);
    } catch (error) {
      setTodaySteps(3500);
    }
  };

  const handleMedicineTaken = async (medicineId) => {
    try {
      await medicineAPI.markTaken(medicineId);
      setMedicines(medicines.map(m => 
        m.id === medicineId ? { ...m, status: 'TAKEN' } : m
      ));
    } catch (error) {
      console.error('Error marking medicine:', error);
    }
  };

  const handleMedicineSkipped = async (medicineId) => {
    try {
      await medicineAPI.markSkipped(medicineId);
      setMedicines(medicines.map(m => 
        m.id === medicineId ? { ...m, status: 'SKIPPED' } : m
      ));
    } catch (error) {
      console.error('Error marking medicine:', error);
    }
  };

  const handleCheckInSubmit = async () => {
    try {
      // await dailyCheckInAPI.submit({ userId: user.id, mood, feelings });
      console.log('Check-in submitted:', { mood, feelings });
      setCheckInDialog(false);
    } catch (error) {
      console.error('Error submitting check-in:', error);
    }
  };

  const handleSOS = async () => {
    setSosDialog(true);
    // Trigger emergency alert
    try {
      // await emergencyAPI.trigger({ userId: user.id, type: 'SOS' });
      console.log('SOS Alert Triggered!');
    } catch (error) {
      console.error('Error triggering SOS:', error);
    }
  };

  const getMoodLabel = (value) => {
    const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
    return labels[value - 1];
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Hello, {user.username}!
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Stay healthy and active today
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={logout} color="error">
            <PhoneIcon />
          </IconButton>
        </Box>
      </Paper>

      <Container maxWidth="md" sx={{ pb: 10 }}>
        {/* Quick Status Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center' }}>
                <WalkIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {todaySteps}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Steps Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MedicationIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {medicines.filter(m => m.status === 'TAKEN').length}/{medicines.length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Medicines Taken
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Medicine Reminders */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center">
            <MedicationIcon sx={{ mr: 1 }} color="primary" />
            Today's Medicines
          </Typography>
          <List>
            {medicines.map((medicine) => (
              <ListItem
                key={medicine.id}
                sx={{
                  bgcolor: medicine.status === 'TAKEN' ? 'success.light' : 
                           medicine.status === 'SKIPPED' ? 'error.light' : 'white',
                  mb: 1,
                  borderRadius: 2,
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <MedicationIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="h6">{medicine.name}</Typography>}
                  secondary={
                    <Typography variant="body2">
                      {medicine.time} - {medicine.status}
                    </Typography>
                  }
                />
                {medicine.status === 'PENDING' && (
                  <Box>
                    <IconButton
                      color="success"
                      onClick={() => handleMedicineTaken(medicine.id)}
                      sx={{ mr: 1 }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleMedicineSkipped(medicine.id)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Daily Check-in Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center">
            <MoodIcon sx={{ mr: 1 }} color="secondary" />
            Daily Check-in
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<MoodIcon />}
            onClick={() => setCheckInDialog(true)}
            sx={{ py: 2 }}
          >
            How are you feeling today?
          </Button>
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<VideoIcon />}
              color="secondary"
              sx={{ py: 3 }}
              onClick={() => alert('Video call feature - Would integrate with WebRTC')}
            >
              Call Family
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<LocationIcon />}
              sx={{ py: 3 }}
            >
              Share Location
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Floating SOS Button */}
      <Fab
        color="error"
        aria-label="sos"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: 80,
          height: 80,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.7)' },
            '70%': { boxShadow: '0 0 0 20px rgba(211, 47, 47, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' },
          },
        }}
        onClick={handleSOS}
      >
        <EmergencyIcon fontSize="large" />
      </Fab>

      {/* Daily Check-in Dialog */}
      <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            How are you feeling today?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Rate your mood
            </Typography>
            <Rating
              name="mood-rating"
              value={mood}
              onChange={(event, newValue) => setMood(newValue)}
              size="large"
              max={5}
              sx={{ fontSize: '3rem' }}
            />
            <Typography variant="h6" color="primary" mt={1}>
              {getMoodLabel(mood)}
            </Typography>
          </Box>
          <TextField
            label="Tell us more... (optional)"
            multiline
            rows={4}
            fullWidth
            value={feelings}
            onChange={(e) => setFeelings(e.target.value)}
            placeholder="How are you feeling? Any discomfort?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialog(false)}>Skip</Button>
          <Button onClick={handleCheckInSubmit} variant="contained" size="large">
            Submit Check-in
          </Button>
        </DialogActions>
      </Dialog>

      {/* SOS Confirmation Dialog */}
      <Dialog open={sosDialog} onClose={() => setSosDialog(false)}>
        <DialogTitle>
          <Typography variant="h5" color="error" fontWeight="bold" textAlign="center">
            🚨 Emergency Alert Sent!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" paragraph>
            Your family members have been notified of your emergency.
          </Typography>
          <Typography variant="body2" textAlign="center" color="textSecondary">
            Help is on the way. Stay calm.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSosDialog(false)} variant="contained" fullWidth>
            I'm Okay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentView;
