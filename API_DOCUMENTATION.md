# Parent Care AI Platform - API Documentation

## 🚀 Enterprise-Level Java Full Stack Application

### System Architecture

```
Mobile Apps (Parent + Guardian)
           ↓
      API Layer
           ↓
   AI Intelligence Engine
           ↓
      Data Layer
           ↓
Cloud Monitoring + Emergency Response + Notifications
```

---

## 📋 API Endpoints

### Base URL
```
http://localhost:8080/api
```

---

## 👤 User Management

### Get All Users
```http
GET /api/users
```

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "john_parent",
  "password": "secure123",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "role": "PARENT",
  "fullName": "John Doe",
  "age": 75,
  "healthConditions": "Diabetes, Hypertension",
  "guardianId": 2,
  "address": "123 Main St",
  "emergencyContact1": "+1234567891",
  "fallDetectionEnabled": true,
  "locationTrackingEnabled": true
}
```

### Get User by ID
```http
GET /api/users/{id}
```

### Get Users by Role
```http
GET /api/users/role/{role}
# role: PARENT, GUARDIAN, ADMIN
```

### Get Parents by Guardian
```http
GET /api/users/guardian/{guardianId}/parents
```

### Update User
```http
PUT /api/users/{id}
```

### Update Last Activity
```http
PUT /api/users/{id}/last-activity
```

---

## 💊 Medicine Management

### Get Medicines for User
```http
GET /api/medicines/user/{userId}
```

### Create Medicine
```http
POST /api/medicines
Content-Type: application/json

{
  "userId": 1,
  "name": "Aspirin",
  "dosage": "100mg",
  "schedule": "08:00:00",
  "frequency": "Daily",
  "voiceReminderEnabled": true,
  "notifyGuardianOnMiss": true,
  "missedThreshold": 2,
  "instructions": "Take with food"
}
```

### Update Medicine
```http
PUT /api/medicines/{id}
```

### Mark as Taken
```http
PUT /api/medicines/{id}/taken
```

### Mark as Missed
```http
PUT /api/medicines/{id}/missed
```

### Delete Medicine
```http
DELETE /api/medicines/{id}
```

---

## 🧠 Activity Monitoring & AI

### Log Activity
```http
POST /api/activity
Content-Type: application/json

{
  "userId": 1,
  "stepCount": 3500,
  "distanceKm": 2.5,
  "activeMinutes": 45,
  "phoneUnlocks": 25,
  "screenTimeMinutes": 180,
  "wakeUpTime": "07:00:00",
  "sleepTime": "22:30:00",
  "sleepDurationMinutes": 450
}
```

### Get User Activity
```http
GET /api/activity/user/{userId}
```

### Get Latest Activity
```http
GET /api/activity/user/{userId}/latest
```

### Get All Anomalies
```http
GET /api/activity/anomalies
```

### Learn Routine Patterns (AI)
```http
GET /api/activity/user/{userId}/learn-routine
```

---

## 📊 Safety Score

### Calculate Today's Safety Score
```http
POST /api/safety-score/calculate/{userId}
```

### Calculate Score for Date
```http
POST /api/safety-score/calculate/{userId}/{date}
# date format: YYYY-MM-DD
```

### Get Today's Score
```http
GET /api/safety-score/{userId}/today
```

### Get Score History
```http
GET /api/safety-score/{userId}/history?days=30
```

### Get Critical Risk Users
```http
GET /api/safety-score/critical
```

**Response Example:**
```json
{
  "userId": 1,
  "date": "2026-03-06",
  "activityScore": 75.0,
  "medicineComplianceScore": 90.0,
  "movementScore": 80.0,
  "moodScore": 70.0,
  "overallScore": 78.75,
  "riskLevel": "LOW",
  "riskFactors": "",
  "aiInsights": "Excellent health status! Keep up the good work.",
  "recommendations": ""
}
```

---

## 🚨 Fall Detection

### Detect Fall (Accelerometer)
```http
POST /api/fall-detection/detect
Content-Type: application/json

{
  "userId": 1,
  "accelerationX": 15.5,
  "accelerationY": -25.8,
  "accelerationZ": 8.2,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Manual SOS Report
```http
POST /api/fall-detection/sos
Content-Type: application/json

{
  "userId": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Manual SOS activated"
}
```

### Acknowledge Fall
```http
PUT /api/fall-detection/{fallId}/acknowledge?guardianId=2
```

### Mark False Alarm
```http
PUT /api/fall-detection/{fallId}/false-alarm
```

### Get Fall History
```http
GET /api/fall-detection/user/{userId}
```

### Get Pending Falls
```http
GET /api/fall-detection/pending
```

---

## 😊 Daily Check-in

### Submit Check-in
```http
POST /api/checkin
Content-Type: application/json

{
  "userId": 1,
  "mood": "GOOD",
  "feeling": "Feeling great today",
  "painLevel": 2,
  "energyLevel": 8,
  "symptoms": "None"
}
```

### Get Check-in History
```http
GET /api/checkin/user/{userId}
```

### Get Today's Check-in
```http
GET /api/checkin/user/{userId}/today
```

### Check if Completed Today
```http
GET /api/checkin/user/{userId}/completed-today
```

---

## 📍 Location Monitoring

### Log Location
```http
POST /api/location
Content-Type: application/json

{
  "userId": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St, New York, NY",
  "locationType": "HOME",
  "inSafeZone": true,
  "safeZoneName": "Home"
}
```

### Get Current Location
```http
GET /api/location/user/{userId}/current
```

### Get Location History
```http
GET /api/location/user/{userId}/history
```

### Get Safe Zone Violations
```http
GET /api/location/user/{userId}/violations
```

---

## 📹 Video Connect

### Initiate Video Call
```http
POST /api/video/initiate
Content-Type: application/json

{
  "parentId": 1,
  "guardianId": 2,
  "initiatedBy": "GUARDIAN"
}
```

### Start Call
```http
PUT /api/video/{sessionId}/start
```

### End Call
```http
PUT /api/video/{sessionId}/end
```

### Get Call History
```http
GET /api/video/history?parentId=1&guardianId=2
```

### Get Last Call
```http
GET /api/video/last?parentId=1&guardianId=2
```

---

## 🔔 Notifications

### Get All Notifications
```http
GET /api/notifications/user/{userId}
```

### Get Unread Notifications
```http
GET /api/notifications/user/{userId}/unread
```

### Get Unread Count
```http
GET /api/notifications/user/{userId}/unread-count
```

### Mark as Read
```http
PUT /api/notifications/{notificationId}/read
```

### Send Check-in Reminder
```http
POST /api/notifications/checkin-reminder/{userId}
```

---

## 🚨 Emergency Management

### Get Emergencies for User
```http
GET /api/emergency/user/{userId}
```

### Create Emergency
```http
POST /api/emergency
Content-Type: application/json

{
  "userId": 1,
  "type": "FALL",
  "severity": "CRITICAL",
  "description": "Fall detected",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Get Pending Emergencies
```http
GET /api/emergency/pending
```

### Get Critical Emergencies
```http
GET /api/emergency/critical
```

### Acknowledge Emergency
```http
PUT /api/emergency/{id}/acknowledge?guardianId=2
```

### Resolve Emergency
```http
PUT /api/emergency/{id}/resolve
Content-Type: text/plain

Emergency resolved. Parent is safe.
```

---

## 📱 Guardian Dashboard

### Get Complete Dashboard
```http
GET /api/guardian/dashboard/{guardianId}
```

**Response Example:**
```json
{
  "parents": [
    {
      "parentId": 1,
      "name": "John Doe",
      "age": 75,
      "lastActivity": "2026-03-06T10:30:00",
      "safetyScore": {
        "overall": 78.75,
        "activity": 75.0,
        "medicine": 90.0,
        "movement": 80.0,
        "mood": 70.0,
        "riskLevel": "LOW"
      },
      "medicines": {
        "total": 3,
        "takenToday": 2,
        "missedToday": 0,
        "upcomingToday": 1
      },
      "recentEmergencies": 0,
      "checkedInToday": true,
      "status": "NORMAL"
    }
  ],
  "totalParents": 1,
  "criticalAlerts": 0,
  "unreadNotifications": 2
}
```

### Get Parent Dashboard
```http
GET /api/guardian/parent/{parentId}/dashboard
```

### Get Safety Score Trend
```http
GET /api/guardian/parent/{parentId}/trend?days=30
```

### Get Activity Summary
```http
GET /api/guardian/parent/{parentId}/activity-summary?days=7
```

---

## 🤖 AI Features

### AI Intelligence Engine Capabilities:

1. **Routine Learning**: Learns user's normal patterns (wake/sleep times, activity levels)
2. **Anomaly Detection**: Detects unusual behavior and inactivity
3. **Fall Detection**: Analyzes accelerometer data with confidence scoring
4. **Medicine Compliance**: Tracks and predicts medication adherence
5. **Risk Scoring**: Calculates daily safety scores and risk levels
6. **Pattern Recognition**: Identifies behavioral changes

### Safety Score Calculation:
```
Overall Score = (Activity × 25%) + (Medicine × 35%) + (Movement × 20%) + (Mood × 20%)

Risk Levels:
- CRITICAL: Score < 50
- HIGH: Score 50-69
- MEDIUM: Score 70-84
- LOW: Score ≥ 85
```

---

## 🔐 User Roles

| Role | Access |
|------|--------|
| **PARENT** | Access own data, daily check-ins, medicine tracking, SOS button |
| **GUARDIAN** | View parent(s) dashboard, receive alerts, acknowledge emergencies |
| **ADMIN** | Full system access, user management, system configuration |

---

## 🎯 Key Features Implemented

✅ Smart Authentication (Multi-user family accounts)  
✅ Medicine Reminder System with AI tracking  
✅ Daily Activity Monitoring with anomaly detection  
✅ Fall Detection (AI-based with accelerometer)  
✅ Emergency Alert System (SOS + Auto-detect)  
✅ AI Behavior Monitoring (Routine learning)  
✅ Guardian Dashboard (Comprehensive overview)  
✅ Safe Location Monitoring  
✅ Daily Check-in (Mood tracking)  
✅ One-Tap Video Connect  
✅ Safety Score (Unique AI-powered scoring)  
✅ Real-time Notifications  

---

## 📊 Database Schema

### Tables:
- `users` - User profiles and settings
- `medicines` - Medicine schedules and compliance
- `activity_logs` - Daily activity and behavior data
- `emergency_logs` - Emergency events and responses
- `safety_scores` - Daily safety scores with AI insights
- `daily_checkins` - Daily health check-ins
- `fall_detections` - Fall events with AI analysis
- `location_logs` - Location tracking data
- `notifications` - Push/Email/SMS notifications
- `video_sessions` - Video call sessions

---

## 🛠️ Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.1.12
- Spring Data JPA
- PostgreSQL
- Lombok

**AI/ML:**
- AI Intelligence Service (Simulated ML capabilities)
- Anomaly Detection Algorithms
- Pattern Recognition
- Confidence Scoring

**Security:**
- Spring Security
- Role-based Access Control

---

## 🚀 Running the Application

```bash
# Navigate to backend directory
cd backend

# Run with Maven
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/parentcare-backend-0.0.1-SNAPSHOT.jar
```

**Application will run on:** `http://localhost:8080`

---

## 📝 Notes

- All endpoints support CORS for frontend integration
- Timestamps are in ISO-8601 format
- Enum values must be uppercase (e.g., "PARENT", "GUARDIAN")
- AI analysis runs automatically on activity logging
- Notifications are sent automatically on critical events

---

## 🔮 Future Enhancements

- WebSocket support for real-time updates
- Python ML model integration for advanced AI
- Voice command integration
- Wearable device integration (Fitbit, Apple Watch)
- Healthcare provider integration
- Multi-language support
- Advanced analytics dashboard
