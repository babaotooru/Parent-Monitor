import React from 'react';
import { Container, Typography } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';

const GuardianAnalytics = ({ userId }) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <TimelineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Guardian Analytics
      </Typography>
      <Typography mt={3}>Advanced analytics dashboard coming soon...</Typography>
    </Container>
  );
};

export default GuardianAnalytics;
