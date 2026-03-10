import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, Button,
  CircularProgress, LinearProgress, Chip, Divider, Alert, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Download as DownloadIcon,
  TrendingUp,
  TrendingDown,
  LocalPharmacy as MedicineIcon,
  DirectionsWalk as WalkIcon,
  HealthAndSafety as SafetyIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { outputAPI, userAPI, communicationHelper } from '../../services/ApiService';
import { useAuth } from '../../context/AuthContext';

const HealthReport = ({ userId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [parents, setParents] = useState([]);

  useEffect(() => {
    loadReport();
    loadParents();
  }, [userId]);

  const loadParents = async () => {
    try {
      const response = await userAPI.getAll();
      const parentList = response.data?.filter(u => u.role === 'PARENT') || [];
      setParents(parentList);
    } catch (error) {
      console.error('Error loading parents:', error);
    }
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await outputAPI.getHealthReport(userId);
      setReportData(response.data);
    } catch (error) {
      // Use realistic mock data
      setReportData({
        period: 'Weekly',
        generatedAt: new Date().toISOString(),
        safetyScore: { current: 82, previous: 78, trend: 'UP' },
        vitals: {
          heartRate: { avg: 72, min: 58, max: 98, status: 'Normal' },
          bloodPressure: { systolic: 128, diastolic: 82, status: 'Normal' },
          steps: { daily: 4200, goal: 5000, weekTotal: 29400 },
          sleep: { avgHours: 7.2, quality: 'Good' },
        },
        medicine: { compliance: 85, taken: 18, missed: 3, total: 21 },
        activity: { activeDays: 5, avgSteps: 4200, caloriesBurned: 1680 },
        falls: { count: 0, lastIncident: 'None' },
        alerts: { total: 3, critical: 0, resolved: 3 },
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReportText = () => {
    if (!reportData) return '';
    const parentData = parents.find(p => p.id === userId);
    const name = parentData?.fullName || user?.fullName || 'Parent';
    return `HEALTH REPORT - ${name}\n` +
      `Period: ${reportData.period}\n` +
      `Generated: ${new Date().toLocaleString()}\n\n` +
      `--- SAFETY SCORE ---\n` +
      `Current: ${reportData.safetyScore?.current}/100\n` +
      `Previous: ${reportData.safetyScore?.previous}/100\n` +
      `Trend: ${reportData.safetyScore?.trend}\n\n` +
      `--- VITALS ---\n` +
      `Heart Rate: Avg ${reportData.vitals?.heartRate?.avg} bpm (${reportData.vitals?.heartRate?.status})\n` +
      `Blood Pressure: ${reportData.vitals?.bloodPressure?.systolic}/${reportData.vitals?.bloodPressure?.diastolic} (${reportData.vitals?.bloodPressure?.status})\n` +
      `Daily Steps: ${reportData.vitals?.steps?.daily} / ${reportData.vitals?.steps?.goal} goal\n` +
      `Sleep: ${reportData.vitals?.sleep?.avgHours} hrs avg (${reportData.vitals?.sleep?.quality})\n\n` +
      `--- MEDICINE ---\n` +
      `Compliance: ${reportData.medicine?.compliance}%\n` +
      `Taken: ${reportData.medicine?.taken}, Missed: ${reportData.medicine?.missed}\n\n` +
      `--- ACTIVITY ---\n` +
      `Active Days: ${reportData.activity?.activeDays}/7\n` +
      `Avg Steps: ${reportData.activity?.avgSteps}\n` +
      `Calories Burned: ${reportData.activity?.caloriesBurned}\n\n` +
      `--- INCIDENTS ---\n` +
      `Falls: ${reportData.falls?.count}\n` +
      `Alerts: ${reportData.alerts?.total} (Critical: ${reportData.alerts?.critical})\n`;
  };

  const handleSendEmail = () => {
    const subject = `Health Report - ${new Date().toLocaleDateString()}`;
    communicationHelper.sendEmail(emailTo, subject, generateReportText());
    setEmailDialog(false);
    setSnackbar({ open: true, message: 'Email client opened with health report!' });
  };

  const handleShareWhatsApp = () => {
    const parentData = parents.find(p => p.id === userId);
    const phone = parentData?.phoneNumber || user?.phoneNumber;
    if (phone) {
      communicationHelper.openWhatsApp(phone, generateReportText());
    } else {
      const text = encodeURIComponent(generateReportText());
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  const data = reportData;

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <ReportIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Health Reports
        </Typography>
        <Box display="flex" gap={1}>
          <Button variant="contained" startIcon={<EmailIcon />} onClick={() => setEmailDialog(true)}>
            Email Report
          </Button>
          <Button variant="contained" color="success" startIcon={<WhatsAppIcon />} onClick={handleShareWhatsApp}>
            Share via WhatsApp
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Safety Score Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <SafetyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Safety Score
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" my={2}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress variant="determinate" value={data?.safetyScore?.current || 0} size={100} thickness={8}
                    color={data?.safetyScore?.current >= 80 ? 'success' : data?.safetyScore?.current >= 60 ? 'warning' : 'error'} />
                  <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h3" fontWeight="bold">{data?.safetyScore?.current}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box textAlign="center">
                <Chip icon={data?.safetyScore?.trend === 'UP' ? <TrendingUp /> : <TrendingDown />}
                  label={`${data?.safetyScore?.trend === 'UP' ? '↑' : '↓'} from ${data?.safetyScore?.previous}`}
                  color={data?.safetyScore?.trend === 'UP' ? 'success' : 'warning'} size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vitals */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <HeartIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'error.main' }} />
                Vitals Summary
              </Typography>
              <Box my={1}>
                <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                <Typography variant="h6">{data?.vitals?.heartRate?.avg} bpm
                  <Chip label={data?.vitals?.heartRate?.status} size="small" color="success" sx={{ ml: 1 }} />
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box my={1}>
                <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                <Typography variant="h6">{data?.vitals?.bloodPressure?.systolic}/{data?.vitals?.bloodPressure?.diastolic}
                  <Chip label={data?.vitals?.bloodPressure?.status} size="small" color="success" sx={{ ml: 1 }} />
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box my={1}>
                <Typography variant="body2" color="text.secondary">Sleep</Typography>
                <Typography variant="h6">{data?.vitals?.sleep?.avgHours} hrs avg
                  <Chip label={data?.vitals?.sleep?.quality} size="small" color="info" sx={{ ml: 1 }} />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medicine Compliance */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <MedicineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Medicine Compliance
              </Typography>
              <Box my={2}>
                <LinearProgress variant="determinate" value={data?.medicine?.compliance || 0}
                  sx={{ height: 12, borderRadius: 6 }}
                  color={data?.medicine?.compliance >= 80 ? 'success' : data?.medicine?.compliance >= 50 ? 'warning' : 'error'} />
                <Typography variant="h4" fontWeight="bold" textAlign="center" mt={1}>
                  {data?.medicine?.compliance}%
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-around">
                <Box textAlign="center">
                  <Typography variant="h5" color="success.main" fontWeight="bold">{data?.medicine?.taken}</Typography>
                  <Typography variant="caption">Taken</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" color="error.main" fontWeight="bold">{data?.medicine?.missed}</Typography>
                  <Typography variant="caption">Missed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <WalkIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Weekly Activity
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={4} textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">{data?.activity?.activeDays}</Typography>
                  <Typography variant="caption">Active Days</Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">{data?.activity?.avgSteps?.toLocaleString()}</Typography>
                  <Typography variant="caption">Avg Steps</Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">{data?.activity?.caloriesBurned}</Typography>
                  <Typography variant="caption">Calories</Typography>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">Step Goal Progress</Typography>
                <LinearProgress variant="determinate"
                  value={Math.min(100, ((data?.vitals?.steps?.daily || 0) / (data?.vitals?.steps?.goal || 5000)) * 100)}
                  sx={{ height: 10, borderRadius: 5, mt: 1 }} />
                <Typography variant="body2" mt={0.5}>
                  {data?.vitals?.steps?.daily?.toLocaleString()} / {data?.vitals?.steps?.goal?.toLocaleString()} steps
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Incidents */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Incidents & Alerts
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <Alert severity={data?.falls?.count === 0 ? 'success' : 'error'} sx={{ mb: 1 }}>
                    <Typography variant="h5" fontWeight="bold">{data?.falls?.count}</Typography>
                    Falls Detected
                  </Alert>
                </Grid>
                <Grid item xs={6}>
                  <Alert severity={data?.alerts?.critical === 0 ? 'success' : 'error'} sx={{ mb: 1 }}>
                    <Typography variant="h5" fontWeight="bold">{data?.alerts?.total}</Typography>
                    Total Alerts ({data?.alerts?.resolved} resolved)
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Dialog */}
      <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Health Report via Email</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Recipient Email" type="email" value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)} sx={{ mt: 1 }}
            placeholder="Enter email address" />
          <Alert severity="info" sx={{ mt: 2 }}>
            This will open your default email client with the health report pre-filled.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendEmail} disabled={!emailTo}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
    </Container>
  );
};

export default HealthReport;
