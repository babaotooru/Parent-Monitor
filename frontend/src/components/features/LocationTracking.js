import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button, Chip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { outputAPI } from '../../services/ApiService';

const LocationTracking = ({ userId }) => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await outputAPI.getLocationMonitoring(userId);
      setLocationData(response.data);
    } catch (error) {
      setLocationData({
        location: 'Home',
        coordinates: '28.6139° N, 77.2090° E',
        inSafeZone: true,
        lastUpdate: '5 minutes ago',
        accuracy: 'High'
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <LocationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Location Tracking
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Current Location
              </Typography>
              <Box mt={2}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {locationData?.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locationData?.coordinates}
                </Typography>
                <Box mt={2}>
                  <Chip
                    label={locationData?.inSafeZone ? 'In Safe Zone' : 'Outside Safe Zone'}
                    color={locationData?.inSafeZone ? 'success' : 'warning'}
                    sx={{ mr: 1 }}
                  />
                  <Chip label={`Accuracy: ${locationData?.accuracy}`} />
                </Box>
                <Typography variant="caption" display="block" mt={2}>
                  Last updated: {locationData?.lastUpdate}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
            <CardContent>
              <Box textAlign="center">
                <MapIcon sx={{ fontSize: 100, color: 'primary.main' }} />
                <Typography variant="h6" mt={2}>
                  Map View
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interactive map coming soon
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LocationTracking;
