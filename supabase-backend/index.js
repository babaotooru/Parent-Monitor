require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Read env variables SUPABASE_URL and SUPABASE_KEY
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in environment');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// user endpoints
app.post('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .insert([req.body]);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// medicine schedule
app.get('/user/:userId/medicines', async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('user_id', userId);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.post('/medicines', async (req, res) => {
  const { data, error } = await supabase
    .from('medicines')
    .insert([req.body]);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// activity logs
app.post('/activity', async (req, res) => {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert([req.body]);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.get('/user/:userId/activity', async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// emergency logs
app.post('/emergency', async (req, res) => {
  const { data, error } = await supabase
    .from('emergency_logs')
    .insert([req.body]);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.get('/user/:userId/emergency', async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from('emergency_logs')
    .select('*')
    .eq('user_id', userId);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Supabase proxy API running on port ${port}`);
});