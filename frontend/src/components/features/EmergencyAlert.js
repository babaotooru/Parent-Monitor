import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Alert,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Divider, Fab
} from '@mui/material';
import {
  ReportProblem as EmergencyIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { emergencyAPI, userAPI, communicationHelper } from '../../services/ApiService';
import { useAuth } from '../../context/AuthContext';

const EmergencyAlert = ({ userId }) => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);
  const [description, setDescription] = useState('');
  const [guardian, setGuardian] = useState(null);

  useEffect(() => {
    loadEmergencies();
    loadGuardian();
  }, [userId]);

  const loadGuardian = async () => {
    try {
      const response = await userAPI.getAll();
      const guardians = response.data?.filter(u => u.role === 'GUARDIAN') || [];
      if (guardians.length > 0) setGuardian(guardians[0]);
    } catch (error) {
      console.error('Error loading guardian:', error);
    }
  };

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const response = await emergencyAPI.getByUser(userId);
      setEmergencies(response.data || []);
    } catch (error) {
      setEmergencies([
        { id: 1, type: 'FALL', description: 'Minor fall detected in hallway', severity: 'MEDIUM', status: 'RESOLVED', createdAt: '2024-01-15T10:30:00', resolvedAt: '2024-01-15T10:35:00' },
        { id: 2, type: 'MEDICINE_MISSED', description: 'Missed evening medication', severity: 'LOW', status: 'RESOLVED', createdAt: '2024-01-14T20:15:00', resolvedAt: '2024-01-14T20:30:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmergency = async () => {
    try {
      await emergencyAPI.create({
        userId,
        type: 'MANUAL',
        description,
        severity: 'HIGH',
        status: 'PENDING',
      });
      // Notify guardian via WhatsApp
      if (guardian?.phoneNumber) {
        communicationHelper.openWhatsApp(guardian.phoneNumber,
          `🚨 EMERGENCY ALERT from ${user?.fullName || user?.username}!\n\n${description}\n\nTime: ${new Date().toLocaleString()}\nPlease respond immediately!`);
      }
      setCreateDialog(false);
      setDescription('');
      loadEmergencies();
    } catch (error) {
      console.error('Error creating emergency:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': case 'CRITICAL': return 'error';
      case 'MEDIUM': return 'warning';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  const pending = emergencies.filter(e => e.status === 'PENDING' || e.status === 'ACTIVE');
  const resolved = emergencies.filter(e => e.status === 'RESOLVED');

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <EmergencyIcon sx={{ color: 'error.main', mr: 1 }} />
          Emergency Alerts
        </Typography>
        <Box display="flex" gap={1}>
          {guardian?.phoneNumber && (
            <Button variant="contained" color="success" startIcon={<WhatsAppIcon />}
              onClick={() => communicationHelper.openWhatsApp(guardian.phoneNumber, 'I need help!')}>
              Contact Guardian
            </Button>
          )}
          {guardian?.phoneNumber && (
            <Button variant="outlined" startIcon={<PhoneIcon />}
              onClick={() => communicationHelper.makePhoneCall(guardian.phoneNumber)}>
              Call Guardian
            </Button>
          )}
        </Box>
      </Box>

      {pending.length === 0 ? (
        <Alert severity="success" sx={{ mb: 3 }}>No active emergencies — All systems normal</Alert>
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>{pending.length} active emergency alert(s)!</Alert>
      )}

      <Grid container spacing={3}>
        {/* Active Emergencies */}
        {pending.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid', borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="error.main" gutterBottom>
                  Active Emergencies
                </Typography>
                <List>
                  {pending.map((emergency) => (
                    <ListItem key={emergency.id} sx={{ bgcolor: 'error.light', borderRadius: 2, mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'error.main' }}><WarningIcon /></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography fontWeight="bold">{emergency.description}</Typography>}
                        secondary={`Type: ${emergency.type} • ${new Date(emergency.createdAt).toLocaleString()}`}
                      />
                      <Chip label={emergency.severity} color={getSeverityColor(emergency.severity)} size="small" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Resolved History */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Resolved Alerts History
              </Typography>
              {resolved.length === 0 ? (
                <Typography color="text.secondary">No resolved alerts yet.</Typography>
              ) : (
                <List>
                  {resolved.map((emergency, idx) => (
                    <React.Fragment key={emergency.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}><CheckIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={emergency.description}
                          secondary={`Type: ${emergency.type} • Resolved: ${emergency.resolvedAt ? new Date(emergency.resolvedAt).toLocaleString() : 'N/A'}`}
                        />
                        <Chip label="Resolved" color="success" size="small" />
                      </ListItem>
                      {idx < resolved.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Emergency FAB */}
      <Fab color="error" aria-label="create-emergency"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => setCreateDialog(true)}>
        <AddIcon />
      </Fab>

      {/* Create Emergency Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          <EmergencyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Report Emergency
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will immediately alert your guardian!
          </Alert>
          <TextField fullWidth multiline rows={3} label="Describe the emergency"
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened?" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCreateEmergency}
            disabled={!description.trim()} startIcon={<EmergencyIcon />}>
            Send Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmergencyAlert;
