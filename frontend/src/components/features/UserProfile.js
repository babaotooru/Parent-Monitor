import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Button, TextField,
  Avatar, Divider, Card, CardContent, Switch, FormControlLabel,
  Alert, CircularProgress, Chip, IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { userAPI } from '../../services/ApiService';

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getById(userId);
      setProfile(response.data);
      setFormValues(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await userAPI.update(userId, formValues);
      setProfile(formValues);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditing(false);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormValues({ ...formValues, [field]: value });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                bgcolor: 'primary.main',
              }}
            >
              {profile?.fullName?.[0] || profile?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {profile?.fullName || profile?.username}
              </Typography>
              <Chip
                label={profile?.role}
                color="primary"
                sx={{ mt: 1, fontWeight: 'bold' }}
              />
            </Box>
          </Box>

          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Personal Information */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formValues?.fullName || ''}
              onChange={handleChange('fullName')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              value={formValues?.username || ''}
              disabled
              variant="filled"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formValues?.email || ''}
              onChange={handleChange('email')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formValues?.phoneNumber || ''}
              onChange={handleChange('phoneNumber')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formValues?.age || ''}
              onChange={handleChange('age')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              value={formValues?.address || ''}
              onChange={handleChange('address')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Health Conditions"
              multiline
              rows={3}
              value={formValues?.healthConditions || ''}
              onChange={handleChange('healthConditions')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          </Grid>

          {/* Emergency Contacts */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
              <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Emergency Contacts
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact 1"
              value={formValues?.emergencyContact1 || ''}
              onChange={handleChange('emergencyContact1')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact 2"
              value={formValues?.emergencyContact2 || ''}
              onChange={handleChange('emergencyContact2')}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          </Grid>

          {/* Monitoring Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
              <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Monitoring Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues?.fallDetectionEnabled || false}
                      onChange={handleChange('fallDetectionEnabled')}
                      disabled={!isEditing}
                      color="primary"
                    />
                  }
                  label="Fall Detection"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Enable automatic fall detection alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues?.locationTrackingEnabled || false}
                      onChange={handleChange('locationTrackingEnabled')}
                      disabled={!isEditing}
                      color="primary"
                    />
                  }
                  label="Location Tracking"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Allow real-time location monitoring
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues?.biometricEnabled || false}
                      onChange={handleChange('biometricEnabled')}
                      disabled={!isEditing}
                      color="primary"
                    />
                  }
                  label="Biometric Auth"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Enable fingerprint/face authentication
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Status */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'success.light', mt: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Account Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={formValues?.active ? 'Active' : 'Inactive'}
                      color={formValues?.active ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Account Created
                    </Typography>
                    <Typography variant="body1">
                      {formValues?.createdAt
                        ? new Date(formValues.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Last Activity
                    </Typography>
                    <Typography variant="body1">
                      {formValues?.lastActivity
                        ? new Date(formValues.lastActivity).toLocaleString()
                        : 'Never'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
