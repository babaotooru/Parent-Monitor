import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, CircularProgress, LinearProgress
} from '@mui/material';
import { HealthAndSafety as SafetyIcon } from '@mui/icons-material';
import { outputAPI } from '../../services/ApiService';

const SafetyScore = ({ userId }) => {
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await outputAPI.getSafetyScore(userId);
      setScoreData(response.data);
    } catch (error) {
      setScoreData({
        overallScore: 82,
        activityScore: 80,
        medicineCompliance: 100,
        sleepPattern: 60,
        mobility: 70,
        moodScore: 80
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <SafetyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Safety Score
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, textAlign: 'center' }}>
            <CardContent>
              <Box position="relative" display="inline-flex" my={3}>
                <CircularProgress
                  variant="determinate"
                  value={scoreData?.overallScore || 0}
                  size={150}
                  thickness={8}
                  color={scoreData?.overallScore >= 80 ? 'success' : 'warning'}
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="h2" fontWeight="bold">
                    {scoreData?.overallScore}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6">Overall Safety Score</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Score Breakdown
              </Typography>
              
              {['activityScore', 'medicineCompliance', 'sleepPattern', 'mobility', 'moodScore'].map((key) => (
                <Box key={key} mb={2}>
                  <Typography variant="body2" textTransform="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <LinearProgress
                      variant="determinate"
                      value={scoreData?.[key] || 0}
                      sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {scoreData?.[key]}/100
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SafetyScore;
