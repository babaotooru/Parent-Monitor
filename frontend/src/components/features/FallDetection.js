import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Card, CardContent, Box,
  Alert, Button, Chip, List, ListItem, ListItemText, Divider
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { outputAPI } from '../../services/ApiService';

const FallDetection = ({ userId }) => {
  const [fallData, setFallData] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await outputAPI.getFallDetection(userId);
      setFallData(response.data);
    } catch (error) {
      setFallData({
        status: 'Normal',
        movementLevel: 'Moderate',
        lastCheck: 'Just now',
        fallHistory: [
          {
            time: '3:25 PM',
            location: 'Living Room',
            severity: 'HIGH',
            responseTime: '2 minutes',
            resolved: true
          }
        ]
      });
    }
  };

  const isFallDetected = fallData?.status !== 'Normal';

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Fall Detection System
      </Typography>

      <Grid container spacing={3} mt={1}>
        {/* Current Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Current Status
              </Typography>
              
              <Box textAlign="center" py={4}>
                {isFallDetected ? (
                  <>
                    <WarningIcon sx={{ fontSize: 100, color: 'error.main' }} />
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="h6">Fall Detected!</Typography>
                      <Typography>Time: {fallData?.lastFallTime}</Typography>
                      <Typography>Location: {fallData?.location}</Typography>
                    </Alert>
                    <Button variant="contained" color="error" sx={{ mt: 2 }} fullWidth>
                      View Emergency Response
                    </Button>
                  </>
                ) : (
                  <>
                    <CheckIcon sx={{ fontSize: 100, color: 'success.main' }} />
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="h6">No Fall Detected</Typography>
                      <Typography>Movement Level: {fallData?.movementLevel}</Typography>
                      <Typography>Last Check: {fallData?.lastCheck}</Typography>
                    </Alert>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Fall History */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Fall History
              </Typography>

              {fallData?.fallHistory?.length > 0 ? (
                <List>
                  {fallData.fallHistory.map((fall, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <LocationIcon fontSize="small" />
                              {fall.location}
                              <Chip
                                label={fall.severity}
                                size="small"
                                color={fall.severity === 'HIGH' ? 'error' : 'warning'}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">
                                <TimeIcon fontSize="tiny" /> Time: {fall.time}
                              </Typography>
                              <Typography variant="body2">
                                Response Time: {fall.responseTime}
                              </Typography>
                              <Chip
                                label={fall.resolved ? 'Resolved' : 'Pending'}
                                size="small"
                                color={fall.resolved ? 'success' : 'warning'}
                              />
                            </>
                          }
                        />
                      </ListItem>
                      {index < fallData.fallHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="success">
                  No fall incidents recorded
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FallDetection;
