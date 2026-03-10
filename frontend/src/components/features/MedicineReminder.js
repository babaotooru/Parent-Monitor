import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, Alert, LinearProgress, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  LocalPharmacy as MedicineIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { medicineAPI, outputAPI } from '../../services/ApiService';

const MedicineReminder = ({ userId }) => {
  const [medicines, setMedicines] = useState([]);
  const [medicineLog, setMedicineLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addDialog, setAddDialog] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    schedule: '',
    frequency: 'DAILY',
    instructions: ''
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load medicines
      const medsResponse = await medicineAPI.getByUser(userId);
      setMedicines(medsResponse.data || []);

      // Load medicine log
      const logResponse = await outputAPI.getMedicineLog(userId);
      setMedicineLog(logResponse.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
      // Mock data
      setMedicines([
        { id: 1, name: 'Blood Pressure Med', dosage: '10mg', schedule: '08:00', status: 'TAKEN' },
        { id: 2, name: 'Vitamin D', dosage: '1000IU', schedule: '12:00', status: 'MISSED' },
        { id: 3, name: 'Heart Medication', dosage: '5mg', schedule: '20:00', status: 'PENDING' },
      ]);
      setMedicineLog({
        medicineLog: [
          { time: '08:00 AM', name: 'Blood Pressure Med', status: 'TAKEN', dosage: '10mg' },
          { time: '02:00 PM', name: 'Vitamin D', status: 'MISSED', dosage: '1000IU' },
          { time: '08:00 PM', name: 'Heart Medication', status: 'PENDING', dosage: '5mg' },
        ],
        takenCount: 1,
        missedCount: 1,
        totalPending: 1,
        complianceRate: 50.0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async () => {
    try {
      await medicineAPI.create({ ...newMedicine, userId });
      setAddDialog(false);
      setNewMedicine({ name: '', dosage: '', schedule: '', frequency: 'DAILY', instructions: '' });
      loadData();
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const handleMarkTaken = async (id) => {
    try {
      await medicineAPI.markTaken(id);
      loadData();
    } catch (error) {
      console.error('Error marking medicine:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="success.dark">
                {medicineLog?.takenCount || 0}
              </Typography>
              <Typography variant="h6">Medicines Taken</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'error.light', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="error.dark">
                {medicineLog?.missedCount || 0}
              </Typography>
              <Typography variant="h6">Medicines Missed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'warning.light', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="warning.dark">
                {medicineLog?.totalPending || 0}
              </Typography>
              <Typography variant="h6">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compliance Rate */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Medicine Compliance Rate
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <LinearProgress
            variant="determinate"
            value={medicineLog?.complianceRate || 0}
            sx={{ flexGrow: 1, height: 20, borderRadius: 10 }}
            color={
              (medicineLog?.complianceRate || 0) >= 80 ? 'success' :
              (medicineLog?.complianceRate || 0) >= 50 ? 'warning' : 'error'
            }
          />
          <Typography variant="h5" fontWeight="bold">
            {Math.round(medicineLog?.complianceRate || 0)}%
          </Typography>
        </Box>
      </Paper>

      {/* Medicine Schedule Table */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            <MedicineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Medicine Schedule
          </Typography>
          <Box>
            <IconButton color="primary" onClick={loadData}>
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialog(true)}
            >
              Add Medicine
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Time</strong></TableCell>
                <TableCell><strong>Medicine Name</strong></TableCell>
                <TableCell><strong>Dosage</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <Typography variant="h6">{medicine.schedule}</Typography>
                  </TableCell>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.dosage}</TableCell>
                  <TableCell>
                    <Chip
                      label={medicine.status}
                      color={
                        medicine.status === 'TAKEN' ? 'success' :
                        medicine.status === 'MISSED' ? 'error' : 'warning'
                      }
                      icon={
                        medicine.status === 'TAKEN' ? <CheckIcon /> :
                        medicine.status === 'MISSED' ? <CancelIcon /> : null
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {medicine.status === 'PENDING' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleMarkTaken(medicine.id)}
                      >
                        Mark Taken
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Medicine Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Medicine</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Medicine Name"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Dosage"
              value={newMedicine.dosage}
              onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
              placeholder="e.g., 10mg, 1 tablet"
              fullWidth
            />
            <TextField
              label="Time"
              type="time"
              value={newMedicine.schedule}
              onChange={(e) => setNewMedicine({ ...newMedicine, schedule: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Instructions"
              value={newMedicine.instructions}
              onChange={(e) => setNewMedicine({ ...newMedicine, instructions: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMedicine}>
            Add Medicine
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicineReminder;
