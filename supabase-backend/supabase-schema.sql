-- Supabase Complete Schema for ParentCare AI Platform
-- This schema matches the JPA entities from Spring Boot backend

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone_number VARCHAR(50),
  role VARCHAR(50) NOT NULL,
  age INTEGER,
  health_conditions TEXT,
  guardian_id BIGINT REFERENCES users(id),
  full_name VARCHAR(255),
  profile_picture TEXT,
  address TEXT,
  emergency_contact1 VARCHAR(100),
  emergency_contact2 VARCHAR(100),
  usual_wake_time TIME,
  usual_sleep_time TIME,
  usual_walk_time TIME,
  routine_pattern TEXT,
  fall_detection_enabled BOOLEAN DEFAULT FALSE,
  location_tracking_enabled BOOLEAN DEFAULT FALSE,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  safety_score DOUBLE PRECISION,
  active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  schedule TIME NOT NULL,
  frequency VARCHAR(50),
  status VARCHAR(50),
  voice_reminder_enabled BOOLEAN DEFAULT TRUE,
  custom_reminder_message TEXT,
  last_taken TIMESTAMP,
  consecutive_missed INTEGER DEFAULT 0,
  total_taken INTEGER DEFAULT 0,
  total_missed INTEGER DEFAULT 0,
  compliance_rate DOUBLE PRECISION,
  notify_guardian_on_miss BOOLEAN DEFAULT TRUE,
  missed_threshold INTEGER DEFAULT 2,
  instructions TEXT,
  side_effects TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_count INTEGER,
  distance_km DOUBLE PRECISION,
  activity_type VARCHAR(100),
  active_minutes INTEGER,
  phone_unlocks INTEGER,
  screen_time_minutes INTEGER,
  app_usage_count INTEGER,
  most_used_app VARCHAR(255),
  wake_up_time TIME,
  sleep_time TIME,
  sleep_duration_minutes INTEGER,
  sleep_quality VARCHAR(50),
  routine_score DOUBLE PRECISION,
  routine_normal BOOLEAN,
  deviations TEXT,
  anomaly_detected BOOLEAN DEFAULT FALSE,
  anomaly_type VARCHAR(100),
  anomaly_score DOUBLE PRECISION,
  ai_analysis TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Logs table
CREATE TABLE IF NOT EXISTS emergency_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  description TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_address TEXT,
  detected_by VARCHAR(100),
  confidence DOUBLE PRECISION,
  sos_triggered BOOLEAN DEFAULT FALSE,
  guardian_notified BOOLEAN DEFAULT FALSE,
  response_time_seconds INTEGER,
  responder_id BIGINT REFERENCES users(id),
  resolution_status VARCHAR(50),
  resolution_notes TEXT,
  false_alarm BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fall Detection table
CREATE TABLE IF NOT EXISTS fall_detection (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  detected BOOLEAN DEFAULT FALSE,
  confidence DOUBLE PRECISION,
  accelerometer_data TEXT,
  gyroscope_data TEXT,
  impact_force DOUBLE PRECISION,
  sos_activated BOOLEAN DEFAULT FALSE,
  user_response VARCHAR(100),
  response_time_seconds INTEGER,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_address TEXT,
  emergency_triggered BOOLEAN DEFAULT FALSE,
  false_positive BOOLEAN DEFAULT FALSE,
  ai_analysis TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Location Logs table
CREATE TABLE IF NOT EXISTS location_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  address TEXT,
  location_type VARCHAR(100),
  is_safe_zone BOOLEAN DEFAULT TRUE,
  geofence_name VARCHAR(255),
  speed_kmh DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  battery_level INTEGER,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'MEDIUM',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_label VARCHAR(100),
  metadata TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Video Sessions table
CREATE TABLE IF NOT EXISTS video_sessions (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guardian_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE,
  channel_name VARCHAR(255),
  status VARCHAR(50),
  initiated_at TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Check-ins table
CREATE TABLE IF NOT EXISTS daily_check_ins (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(50),
  energy_level INTEGER,
  pain_level INTEGER,
  sleep_quality VARCHAR(50),
  appetite VARCHAR(50),
  notes TEXT,
  checkin_time TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Safety Scores table
CREATE TABLE IF NOT EXISTS safety_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  overall_score DOUBLE PRECISION NOT NULL,
  activity_score DOUBLE PRECISION,
  medicine_compliance_score DOUBLE PRECISION,
  routine_score DOUBLE PRECISION,
  fall_risk_score DOUBLE PRECISION,
  mood_score DOUBLE PRECISION,
  risk_level VARCHAR(50),
  risk_factors TEXT,
  recommendations TEXT,
  ai_insights TEXT,
  calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_guardian ON users(guardian_id);
CREATE INDEX idx_medicines_user ON medicines(user_id);
CREATE INDEX idx_activity_user_timestamp ON activity_logs(user_id, timestamp DESC);
CREATE INDEX idx_emergency_user_timestamp ON emergency_logs(user_id, timestamp DESC);
CREATE INDEX idx_fall_user_timestamp ON fall_detection(user_id, timestamp DESC);
CREATE INDEX idx_location_user_timestamp ON location_logs(user_id, timestamp DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_video_parent ON video_sessions(parent_id);
CREATE INDEX idx_video_guardian ON video_sessions(guardian_id);
CREATE INDEX idx_checkin_user ON daily_check_ins(user_id);
CREATE INDEX idx_safety_user_date ON safety_scores(user_id, date DESC);
