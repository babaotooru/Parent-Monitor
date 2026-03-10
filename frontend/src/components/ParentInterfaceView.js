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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  LocalHospital as EmergencyIcon,
  LocalPharmacy as MedicationIcon,
  MoodOutlined as MoodIcon,
  DirectionsWalk as WalkIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ParentInterfaceView = () => {
  const [medicines, setMedicines] = useState([]);
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [mood, setMood] = useState(3);
  const [feelings, setFeelings] = useState('');
  const [sosDialog, setSosDialog] = useState(false);
  const [todaySteps, setTodaySteps] = useState(0);
  const [medicineReminder, setMedicineReminder] = useState(null);
  const [dailyCheckInResult, setDailyCheckInResult] = useState(null);
  const [sosStatus, setSosStatus] = useState(null);

  const userId = 1; // Replace with actual user ID

  useEffect(() => {
    loadMedicines();
    checkDailyCheckIn();
    checkMedicineReminders();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/outputs/medicine-log/${userId}`);
      if (response.data && response.data.medicineLog) {
        setMedicines(response.data.medicineLog);
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
      // Mock data
      setMedicines([
        { time: '08:00 AM', medicineName: 'Blood Pressure Tablet', status: 'PENDING', dosage: '1 tablet' },
        { time: '02:00 PM', medicineName: 'Vitamin D Tablet', status: 'TAKEN', dosage: '1 capsule' },
        { time: '09:00 PM', medicineName: 'Diabetes Tablet', status: 'PENDING', dosage: '1 tablet' },
      ]);
    }
  };

  const checkMedicineReminders = () => {
    // Check if any medicine is due
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 8 && currentHour < 9) {
      setMedicineReminder({
        title: 'Medicine Reminder',
        message: 'Time to take Blood Pressure Tablet',
        time: '08:00 AM',
        status: 'pending'
      });
    }
  };

  const checkDailyCheckIn = () => {
    const checkTime = new Date().getHours();
    if (checkTime >= 9 && checkTime < 10) {
      setTimeout(() => setCheckInDialog(true), 3000);
    }
  };

  const handleMedicineTaken = (medicine) => {
    // Update medicine status
    setMedicines(medicines.map(m => 
      m.medicineName === medicine.medicineName ? { ...m, status: 'TAKEN' } : m
    ));
    
    // Show confirmation
    setMedicineReminder({
      ...medicineReminder,
      status: 'taken',
      confirmedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleCheckInSubmit = () => {
    const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
    
    setDailyCheckInResult({
      question: 'How are you feeling today?',
      response: moodLabels[mood - 1],
      moodScore: moodLabels[mood - 1],
      feelings: feelings || 'No additional notes',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
    
    setCheckInDialog(false);
  };

  const handleSOS = () => {
    setSosDialog(true);
    
    // Trigger SOS alert
    setSosStatus({
      type: 'SOS Button Activated',
      status: 'Emergency Message Sent',
      contactsNotified: 3,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      emergencyContacts: ['Guardian', 'Emergency Contact 1', 'Emergency Contact 2']
    });
    
    // Auto-close after showing status
    setTimeout(() => setSosDialog(false), 5000);
  };

  const getMoodLabel = (value) => {
    const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
    return labels[value - 1];
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
              👴
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Good Day, Ramesh!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Stay healthy and active today
              </Typography>
            </Box>
          </Box>
          
          <Chip 
            icon={<WalkIcon />}
            label={`${todaySteps || 4250} Steps Today`} 
            color="primary"
            sx={{ fontSize: '1rem', py: 2, px: 1 }}
          />
        </Box>
      </Paper>

      <Container maxWidth="md">
        {/* Feature 3: Medicine Reminder Output */}
        {medicineReminder && medicineReminder.status === 'pending' && (
          <Alert severity="warning" sx={{ mb: 3, fontSize: '1.1rem' }}>
            <Typography variant="h6" gutterBottom>
              <MedicationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Reminder: Take Blood Pressure Tablet
            </Typography>
            <Typography variant="body1">
              Time: {medicineReminder.time}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => handleMedicineTaken(medicines[0])}
                sx={{ mr: 2 }}
              >
                Mark as Taken
              </Button>
            </Box>
          </Alert>
        )}
        
        {medicineReminder && medicineReminder.status === 'taken' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">Status: Taken ✓</Typography>
            <Typography variant="body2">Confirmed at: {medicineReminder.confirmedAt}</Typography>
          </Alert>
        )}

        {/* Feature 3: Daily Check-in Result */}
        {dailyCheckInResult && (
          <Card elevation={3} sx={{ mb: 3, bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Check-in Output
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                <strong>Question:</strong> {dailyCheckInResult.question}
              </Typography>
              <Typography variant="body1">
                <strong>Response:</strong> {dailyCheckInResult.response}
              </Typography>
              <Typography variant="body1">
                <strong>Mood Score:</strong> {dailyCheckInResult.moodScore}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Recorded at: {dailyCheckInResult.timestamp}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Medicine List */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicationIcon color="primary" />
              Today's Medicines
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <List>
              {medicines.map((med, index) => (
                <ListItem key={index} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {med.medicineName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body1">Time: {med.time}</Typography>
                        <Typography variant="body2">Dosage: {med.dosage}</Typography>
                      </>
                    }
                  />
                  <Chip 
                    label={med.status} 
                    color={
                      med.status === 'TAKEN' ? 'success' :
                      med.status === 'MISSED' ? 'error' : 'warning'
                    }
                    sx={{ fontSize: '1rem', py: 2 }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WalkIcon color="primary" />
              Today's Activity
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Steps</Typography>
                <Typography variant="h4">4,250</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Goal</Typography>
                <Typography variant="h4">5,000</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Actions */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<MoodIcon />}
              onClick={() => setCheckInDialog(true)}
              sx={{ py: 2 }}
            >
              Daily Check-In
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<NotificationIcon />}
              sx={{ py: 2 }}
            >
              View Alerts
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* SOS Button */}
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
        onClick={handleSOS}
      >
        <Box textAlign="center">
          <EmergencyIcon fontSize="large" />
          <Typography variant="caption" fontWeight="bold">SOS</Typography>
        </Box>
      </Fab>

      {/* Daily Check-In Dialog */}
      <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <MoodIcon color="primary" />
            How are you feeling today?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rate your mood
            </Typography>
            <Rating
              name="mood-rating"
              value={mood}
              onChange={(event, newValue) => {
                setMood(newValue);
              }}
              size="large"
              sx={{ fontSize: '3rem' }}
            />
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              {getMoodLabel(mood)}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="How are you feeling? (Optional)"
            value={feelings}
            onChange={(e) => setFeelings(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialog(false)}>Cancel</Button>
          <Button onClick={handleCheckInSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* SOS Dialog */}
      <Dialog open={sosDialog} onClose={() => setSosDialog(false)}>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          🆘 SOS Emergency Alert
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {sosStatus && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {sosStatus.type}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {sosStatus.status}
                </Typography>
                <Typography variant="body2">
                  Contacts Notified: {sosStatus.contactsNotified}
                </Typography>
                <Typography variant="body2">
                  Time: {sosStatus.time}
                </Typography>
              </Alert>
              
              <Typography variant="body2" gutterBottom>
                <strong>Emergency contacts notified:</strong>
              </Typography>
              <List dense>
                {sosStatus.emergencyContacts.map((contact, index) => (
                  <ListItem key={index}>
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                    <ListItemText primary={contact} />
                  </ListItem>
                ))}
              </List>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Help is on the way! Stay calm and wait for assistance.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSosDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentInterfaceView;
