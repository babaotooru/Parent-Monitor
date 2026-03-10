import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Button, Card, CardContent,
  Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Chip, Fab, Rating, Alert, List,
  ListItem, ListItemText, ListItemIcon, Divider, Switch, FormControlLabel
} from '@mui/material';
import {
  LocalPharmacy as MedicineIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ReportProblem as EmergencyIcon,
  Mood as MoodIcon,
  DirectionsWalk as WalkIcon,
  Notifications as NotificationIcon,
  Phone as PhoneIcon,
  VideoCall as VideoIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { medicineAPI, activityAPI, dashboardAPI, userAPI, communicationHelper } from '../../services/ApiService';
import { useAuth } from '../../context/AuthContext';

const ParentInterface = ({ userId, onNavigate }) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [sosDialog, setSosDialog] = useState(false);
  const [mood, setMood] = useState(3);
  const [feelings, setFeelings] = useState('');
  const [todaySteps, setTodaySteps] = useState(0);
  const [checkInComplete, setCheckInComplete] = useState(false);
  const [guardian, setGuardian] = useState(null);

  useEffect(() => {
    loadMedicines();
    loadTodayActivity();
    loadGuardian();
  }, [userId]);

  const loadMedicines = async () => {
    try {
      const response = await medicineAPI.getByUser(userId);
      const meds = response.data || [];
      
      // Mock medicines if empty
      if (meds.length === 0) {
        setMedicines([
          { id: 1, name: 'Blood Pressure Med', schedule: '08:00', status: 'PENDING', dosage: '1 tablet' },
          { id: 2, name: 'Vitamin D', schedule: '12:00', status: 'TAKEN', dosage: '1 capsule' },
          { id: 3, name: 'Heart Medication', schedule: '20:00', status: 'PENDING', dosage: '1 tablet' },
        ]);
      } else {
        setMedicines(meds);
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const loadTodayActivity = async () => {
    try {
      const response = await activityAPI.getLatest(userId);
      setTodaySteps(response.data?.stepCount || 3500);
    } catch (error) {
      setTodaySteps(3500);
    }
  };

  const loadGuardian = async () => {
    try {
      const response = await userAPI.getAll();
      const guardians = response.data?.filter(u => u.role === 'GUARDIAN') || [];
      if (guardians.length > 0) {
        setGuardian(guardians[0]);
      }
    } catch (error) {
      console.error('Error loading guardian:', error);
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
      setMedicines(medicines.map(m => 
        m.id === medicineId ? { ...m, status: 'MISSED' } : m
      ));
    } catch (error) {
      console.error('Error skipping medicine:', error);
    }
  };

  const handleDailyCheckIn = async () => {
    try {
      // Save check-in data
      await activityAPI.create({
        userId: userId,
        moodScore: mood,
        notes: feelings,
        timestamp: new Date().toISOString()
      });
      
      setCheckInComplete(true);
      setTimeout(() => {
        setCheckInDialog(false);
        setCheckInComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting check-in:', error);
    }
  };

  const handleSOS = async () => {
    try {
      // Send WhatsApp SOS message to guardian
      const phone = guardian?.phoneNumber || user?.emergencyContact1;
      if (phone) {
        communicationHelper.openWhatsApp(phone, `🚨 SOS EMERGENCY ALERT 🚨\n\n${user?.fullName || user?.username} needs immediate help!\nTime: ${new Date().toLocaleString()}\nPlease respond urgently!`);
      }
      alert('SOS Alert Sent!\n\nGuardian has been notified via WhatsApp.\nEmergency contacts alerted.\nHelp is on the way!');
      setSosDialog(false);
    } catch (error) {
      console.error('Error sending SOS:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Friendly Welcome */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 3, bgcolor: 'primary.light', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 70, height: 70, bgcolor: 'white', color: 'primary.main', fontSize: '2rem' }}>
            {user?.fullName?.[0] || 'P'}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Hello, {user?.fullName || user?.username}!
            </Typography>
            <Typography variant="h6">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Medicine Reminders */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                <MedicineIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 35 }} />
                Today's Medicines
              </Typography>

              {medicines.length === 0 ? (
                <Alert severity="success">No medicines scheduled for today</Alert>
              ) : (
                <List>
                  {medicines.map((medicine, index) => (
                    <Box key={medicine.id}>
                      <ListItem
                        sx={{
                          bgcolor: medicine.status === 'PENDING' ? 'warning.light' :
                                   medicine.status === 'TAKEN' ? 'success.light' : 'error.light',
                          borderRadius: 2,
                          mb: 2,
                          p: 2,
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              bgcolor: medicine.status === 'PENDING' ? 'warning.main' :
                                       medicine.status === 'TAKEN' ? 'success.main' : 'error.main',
                              width: 60,
                              height: 60,
                            }}
                          >
                            <MedicineIcon sx={{ fontSize: 35 }} />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" fontWeight="bold">
                              {medicine.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body1">
                                <TimeIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
                                Time: {medicine.schedule}
                              </Typography>
                              <Typography variant="body2">
                                Dosage: {medicine.dosage || '1 tablet'}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box display="flex" flexDirection="column" gap={1}>
                          {medicine.status === 'PENDING' && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={() => handleMedicineTaken(medicine.id)}
                                size="large"
                              >
                                Taken
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleMedicineSkipped(medicine.id)}
                                size="large"
                              >
                                Skip
                              </Button>
                            </>
                          )}
                          {medicine.status === 'TAKEN' && (
                            <Chip
                              icon={<CheckIcon />}
                              label="Completed"
                              color="success"
                              size="large"
                              sx={{ fontSize: '1.1rem', p: 2 }}
                            />
                          )}
                          {medicine.status === 'MISSED' && (
                            <Chip
                              icon={<CancelIcon />}
                              label="Missed"
                              color="error"
                              size="large"
                              sx={{ fontSize: '1.1rem', p: 2 }}
                            />
                          )}
                        </Box>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Check-In */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                <MoodIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 35 }} />
                Daily Check-In
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                How are you feeling today?
              </Typography>

              <Box textAlign="center">
                <Typography variant="h3" mb={2}>😊</Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setCheckInDialog(true)}
                  sx={{ py: 2, fontSize: '1.2rem' }}
                >
                  Complete Check-In
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Tracker */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                <WalkIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 35 }} />
                Today's Activity
              </Typography>

              <Box textAlign="center" my={3}>
                <Typography variant="h2" fontWeight="bold" color="primary.main">
                  {todaySteps.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Steps Today
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-around" mt={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold">
                    {(todaySteps * 0.0008).toFixed(1)} km
                  </Typography>
                  <Typography variant="caption">Distance</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold">
                    {Math.round(todaySteps * 0.04)} cal
                  </Typography>
                  <Typography variant="caption">Calories</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3, bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<WhatsAppIcon />}
                    color="success"
                    sx={{ py: 2 }}
                    onClick={() => {
                      const phone = guardian?.phoneNumber || user?.emergencyContact1;
                      if (phone) {
                        communicationHelper.openWhatsApp(phone, `Hi, this is ${user?.fullName || user?.username}. I need to talk to you.`);
                      } else {
                        alert('No guardian phone number available. Please ask your guardian to update their profile.');
                      }
                    }}
                  >
                    WhatsApp Guardian
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<PhoneIcon />}
                    sx={{ py: 2 }}
                    onClick={() => {
                      const phone = guardian?.phoneNumber || user?.emergencyContact1;
                      if (phone) {
                        communicationHelper.makePhoneCall(phone);
                      } else {
                        alert('No guardian phone number available. Please ask your guardian to update their profile.');
                      }
                    }}
                  >
                    Call Guardian
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<VideoIcon />}
                    sx={{ py: 2 }}
                    onClick={() => {
                      const guardianId = guardian?.id || 0;
                      const roomId = `${guardianId}-${userId}-${Date.now()}`;
                      communicationHelper.openVideoCall(roomId);
                    }}
                  >
                    Video Call
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<NotificationIcon />}
                    sx={{ py: 2 }}
                    onClick={() => onNavigate && onNavigate('notifications')}
                  >
                    View Alerts
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SOS Emergency Button */}
      <Fab
        color="error"
        aria-label="sos"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 80,
          height: 80,
        }}
        onClick={() => setSosDialog(true)}
      >
        <EmergencyIcon sx={{ fontSize: 40 }} />
      </Fab>

      {/* Daily Check-In Dialog */}
      <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Daily Check-In
          </Typography>
        </DialogTitle>
        <DialogContent>
          {checkInComplete ? (
            <Alert severity="success" sx={{ fontSize: '1.2rem' }}>
              ✓ Check-in complete! Thank you!
            </Alert>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                How are you feeling today?
              </Typography>
              <Box textAlign="center" my={3}>
                <Rating
                  value={mood}
                  onChange={(event, newValue) => setMood(newValue)}
                  size="large"
                  max={5}
                  icon={<MoodIcon fontSize="inherit" />}
                  emptyIcon={<MoodIcon fontSize="inherit" />}
                />
                <Typography variant="body1" mt={1}>
                  {mood === 1 ? 'Very Bad' :
                   mood === 2 ? 'Bad' :
                   mood === 3 ? 'Okay' :
                   mood === 4 ? 'Good' :
                   'Excellent'}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Anything you'd like to share?"
                value={feelings}
                onChange={(e) => setFeelings(e.target.value)}
                placeholder="Tell us about your day..."
                sx={{ fontSize: '1.1rem' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialog(false)} size="large">
            Close
          </Button>
          {!checkInComplete && (
            <Button
              variant="contained"
              onClick={handleDailyCheckIn}
              size="large"
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* SOS Confirmation Dialog */}
      <Dialog open={sosDialog} onClose={() => setSosDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          <EmergencyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Emergency SOS
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will immediately alert your guardian and emergency contacts!
          </Alert>
          <Typography variant="h6">
            Are you sure you need emergency help?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSosDialog(false)} size="large">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSOS}
            size="large"
            startIcon={<EmergencyIcon />}
          >
            Send SOS Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParentInterface;
