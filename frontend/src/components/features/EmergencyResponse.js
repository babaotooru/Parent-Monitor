import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, Button,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip,
  CircularProgress, Alert, Divider, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ReportProblem as EmergencyIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as VideoIcon,
} from '@mui/icons-material';
import { emergencyAPI, userAPI, communicationHelper } from '../../services/ApiService';
import { useAuth } from '../../context/AuthContext';

const EmergencyResponse = ({ userId }) => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolveDialog, setResolveDialog] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [responseNote, setResponseNote] = useState('');
  const [parents, setParents] = useState([]);

  useEffect(() => {
    loadEmergencies();
    loadParents();
  }, [userId]);

  const loadParents = async () => {
    try {
      const response = await userAPI.getAll();
      setParents(response.data?.filter(u => u.role === 'PARENT') || []);
    } catch (error) {
      console.error('Error loading parents:', error);
    }
  };

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const pendingRes = await emergencyAPI.getPending();
      const criticalRes = await emergencyAPI.getCritical();
      const all = [...(criticalRes.data || []), ...(pendingRes.data || [])];
      const unique = all.filter((e, i, arr) => arr.findIndex(x => x.id === e.id) === i);
      setEmergencies(unique.length > 0 ? unique : [
        { id: 1, userId: 1, type: 'FALL', description: 'Fall detected in living room', severity: 'HIGH', status: 'PENDING', createdAt: new Date().toISOString() },
      ]);
    } catch (error) {
      setEmergencies([
        { id: 1, userId: 1, type: 'FALL', description: 'Fall detected in living room', severity: 'HIGH', status: 'PENDING', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (emergency) => {
    try {
      await emergencyAPI.acknowledge(emergency.id, userId);
      loadEmergencies();
    } catch (error) {
      console.error('Error acknowledging:', error);
    }
  };

  const handleResolve = async () => {
    if (!selectedEmergency) return;
    try {
      await emergencyAPI.resolve(selectedEmergency.id, { note: responseNote, resolvedBy: userId });
      setResolveDialog(false);
      setSelectedEmergency(null);
      setResponseNote('');
      loadEmergencies();
    } catch (error) {
      console.error('Error resolving:', error);
    }
  };

  const getParentInfo = (parentUserId) => parents.find(p => p.id === parentUserId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <EmergencyIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'error.main' }} />
        Emergency Response System
      </Typography>

      {emergencies.filter(e => e.status !== 'RESOLVED').length === 0 ? (
        <Alert severity="success" sx={{ mb: 3 }}>All emergencies have been resolved.</Alert>
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>
          {emergencies.filter(e => e.status !== 'RESOLVED').length} emergency(ies) require attention!
        </Alert>
      )}

      <Grid container spacing={3}>
        {emergencies.map((emergency) => {
          const parent = getParentInfo(emergency.userId);
          return (
            <Grid item xs={12} key={emergency.id}>
              <Card elevation={3} sx={{
                borderRadius: 3,
                border: emergency.status !== 'RESOLVED' ? '2px solid' : 'none',
                borderColor: emergency.severity === 'CRITICAL' || emergency.severity === 'HIGH' ? 'error.main' : 'warning.main',
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box display="flex" gap={2} alignItems="center">
                      <Avatar sx={{ bgcolor: emergency.status === 'RESOLVED' ? 'success.main' : 'error.main', width: 56, height: 56 }}>
                        {emergency.status === 'RESOLVED' ? <CheckIcon /> : <WarningIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{emergency.description}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type: {emergency.type} • {new Date(emergency.createdAt).toLocaleString()}
                          {parent && ` • Patient: ${parent.fullName || parent.username}`}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip label={emergency.severity} size="small"
                            color={emergency.severity === 'HIGH' || emergency.severity === 'CRITICAL' ? 'error' : 'warning'} />
                          <Chip label={emergency.status} size="small"
                            color={emergency.status === 'RESOLVED' ? 'success' : 'default'} />
                        </Box>
                      </Box>
                    </Box>

                    {emergency.status !== 'RESOLVED' && (
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {parent?.phoneNumber && (
                          <>
                            <Button size="small" variant="contained" color="success" startIcon={<WhatsAppIcon />}
                              onClick={() => communicationHelper.openWhatsApp(parent.phoneNumber,
                                `Emergency response: We received your alert "${emergency.description}". Help is on the way. Stay calm.`)}>
                              WhatsApp
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<PhoneIcon />}
                              onClick={() => communicationHelper.makePhoneCall(parent.phoneNumber)}>
                              Call
                            </Button>
                          </>
                        )}
                        <Button size="small" variant="contained" startIcon={<VideoIcon />}
                          onClick={() => communicationHelper.openVideoCall(`emergency-${emergency.id}-${Date.now()}`)}>
                          Video Call
                        </Button>
                        <Button size="small" variant="outlined" color="warning"
                          onClick={() => handleAcknowledge(emergency)}>
                          Acknowledge
                        </Button>
                        <Button size="small" variant="contained" color="success"
                          onClick={() => { setSelectedEmergency(emergency); setResolveDialog(true); }}>
                          Resolve
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialog} onClose={() => setResolveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve Emergency</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={3} label="Resolution Note"
            value={responseNote} onChange={(e) => setResponseNote(e.target.value)}
            placeholder="Describe how the emergency was resolved..." sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleResolve}>Mark Resolved</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmergencyResponse;
