# 🏥 ParentCare AI - Complete Usage Guide

## 🚀 Quick Start

### ✅ System Status
- **Backend**: Running on http://localhost:8080
- **Frontend**: Running on http://localhost:3000
- **Database**: H2 In-Memory (auto-initialized with test data)

---

## 🔐 Test Login Credentials

### Guardian Account (Family Caregiver)
```
Username: guardian1
Password: password123
Email: guardian@example.com
```
**Access**: Full monitoring dashboard for elderly parent

### Parent Account (Elderly User)
```
Username: parent1  
Password: password123
Email: parent@example.com
```
**Access**: Simplified interface with medicine reminders and SOS button

### Admin Account
```
Username: admin1
Password: admin123
Email: admin@example.com
```
**Access**: System-wide monitoring and analytics

### Additional Test Users
```
Guardian 2: guardian2 / password123
Parent 2: parent2 / password123
```

---

## 📱 Feature Overview

### 1. **Login & Authentication** ✓
- **URL**: http://localhost:3000/login
- Password-based authentication
- Biometric authentication support
- Session management with JWT tokens
- Role-based access control

### 2. **Guardian Dashboard** ✓
- **URL**:http://localhost:3000/guardian-dashboard
- **Features**:
  - Real-time parent status monitoring
  - Safety score visualization (0-100)
  - Medicine compliance tracking
  - Fall detection alerts
  - Location monitoring
  - AI behavior insights
  - Emergency alerts

### 3. **Parent Interface** ✓
- **URL**: http://localhost:3000/parent-interface
- **Features**:
  - Large, elderly-friendly UI
  - Medicine reminder notifications
  - Daily check-in system
  - Emergency SOS button (bottom-right)
  - Activity summary

### 4. **Admin Dashboard** ✓
- **URL**: http://localhost:3000/admin
- **Features**:
  - System-wide statistics
  - User management overview
  - Emergency alerts monitoring
  - System health metrics
  - Daily analytics

---

## 🔧 API Endpoints

### Authentication
```bash
# Login
POST http://localhost:8080/api/users/login
Body: {"username": "guardian1", "password": "password123"}

# Get All Users
GET http://localhost:8080/api/users
```

### Monitoring Outputs
```bash
# Guardian Dashboard Data
GET http://localhost:8080/api/outputs/guardian-dashboard/1

# Medicine Log
GET http://localhost:8080/api/outputs/medicine-log/1

# Activity Monitoring
GET http://localhost:8080/api/outputs/activity-monitoring/1

# Fall Detection Status
GET http://localhost:8080/api/outputs/fall-detection/1

# Location Monitoring
GET http://localhost:8080/api/outputs/location-monitoring/1

# Safety Score Details
GET http://localhost:8080/api/outputs/safety-score/1

# Health Report
GET http://localhost:8080/api/outputs/health-report/1?period=weekly

# Admin Monitoring
GET http://localhost:8080/api/outputs/admin-monitoring
```

---

## 🎯 How to Use the Website

### Step 1: Open the Website
```
Open browser and go to: http://localhost:3000
```

### Step 2: Login
1. You'll see the login page automatically
2. Enter credentials (use test accounts above)
3. Click "Sign In"
4. You'll be redirected based on your role:
   - **Guardian** → Guardian Dashboard
   - **Parent** → Parent Interface
   - **Admin** → Admin Dashboard

### Step 3: Explore Features

#### For Guardians:
1. **Monitor Parent Status**: See if parent is active, idle, or inactive
2. **Check Safety Score**: View overall safety score (0-100) with trend
3. **View Medicine Status**: Track which medicines were taken/missed
4. **Monitor Activity**: Check daily steps, phone interaction
5. **Fall Detection**: See fall alerts and status
6. **Location Tracking**: View current location and safe zone status
7. **Health Reports**: Access weekly/monthly health summaries

#### For Parents (Elderly):
1. **Take Medicine**: Click "Mark as Taken" on medicine reminders
2. **Daily Check-In**: Click "Daily Check-In" button, rate mood
3. **Emergency SOS**: Click red SOS button if you need help
4. **View Today's Activity**: See your activity summary

#### For Admins:
1. **System Overview**: View total users, alerts, average safety score
2. **User Management**: See all registered users and their status
3. **Emergency Monitoring**: Track all emergency alerts today
4. **System Health**: Monitor uptime, active connections, response time

---

## 🧪 Testing Scenarios

### Scenario 1: Guardian Monitoring a Parent
```
1. Login as: guardian1 / password123
2. You'll see parent1 (Mary Parent) status
3. Check medicine compliance, safety score
4. View recent activity and alerts
```

### Scenario 2: Parent Taking Medicine
```
1. Login as: parent1 / password123
2. See medicine reminders at top
3. Click "Mark as Taken" on each medicine
4. Status will change to "Taken ✓"
```

### Scenario 3: Emergency SOS
```
1. Login as: parent1 / password123
2. Click red SOS button (bottom-right)
3. Emergency dialog appears
4. Contacts are automatically notified
5. Guardian1 will see alert on their dashboard
```

### Scenario 4: Daily Check-In
```
1. Login as: parent1 / password123
2. Click "Daily Check-In" button
3. Rate your mood (1-5 stars)
4. Enter how you're feeling (optional)
5. Submit to record check-in
```

### Scenario 5: Admin System Monitoring
```
1. Login as: admin1 / admin123
2. View system statistics
3. Check emergency alerts
4. Monitor user counts and system health
```

---

## 📊 Database Information

### Current Setup
- **Type**: H2 In-Memory Database
- **Console**: http://localhost:8080/h2-console
- **JDBC URL**: jdbc:h2:mem:parentcare
- **Username**: sa
- **Password**: (empty)

### Pre-loaded Test Data
- **Users**: 5 (2 guardians, 2 parents, 1 admin)
- **Relationships**: parent1 → guardian1, parent2 → guardian2
- **Status**: All users are active
- **Data**: Resets on server restart (in-memory)

---

## 🔄 Switching to Supabase (Optional)

To use Supabase PostgreSQL instead of H2:

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Get credentials from Settings → Database

2. **Update Configuration**
   ```bash
   cd backend/src/main/resources
   # Edit application-supabase.properties with your credentials
   ```

3. **Run Database Schema**
   ```bash
   # Execute: supabase-backend/supabase-schema.sql
   # in your Supabase SQL Editor
   ```

4. **Start with Supabase Profile**
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=supabase
   ```

---

## 🐛 Troubleshooting

### Login Not Working?
**Issue**: Can't login with test credentials  
**Solution**:
```bash
# Check if backend is running
curl http://localhost:8080/api/users

# Should return list of 5 users
# If not, restart backend to reload test data
```

### Frontend Not Loading?
**Issue**: Blank page or errors  
**Solution**:
```bash
cd frontend
npm install
npm start
```

### Backend Errors?
**Issue**: 500 Internal Server Error  
**Solution**:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Port Already in Use?
**Issue**: Port 3000 or 8080 already used  
**Solution**:
```powershell
# Kill process on port 8080
Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Force -Id $_ }

# Kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Force -Id $_ }
```

---

## 📈 Current Implementation Status

### ✅ Fully Implemented
- Login & Authentication (Feature 1)
- Guardian Dashboard UI (Feature 2)
- Parent Interface UI (Feature 3)
- Medicine Log System (Feature 4)
- Activity Monitoring Output (Feature 5)
- Fall Detection Output (Feature 6)
- Emergency Alert System (Feature 7)
- Location Monitoring (Feature 8)
- Safety Score System (Feature 10)
- Health Report Output (Feature 12)
- Admin Monitoring (Feature 14)

### ⚠️ Mock Data (Development Mode)
- Real-time WebSocket updates
- AI behavior analysis
- Actual medicine schedule triggers
- GPS location tracking
- Fall detection sensors

### 🔜 Production Requirements
- BCrypt password hashing
- JWT token validation
- Real database (Supabase/PostgreSQL)
- Medicine scheduling cron jobs
- WebSocket authentication
- IoT device integration
- Mobile app development

---

## 💡 Tips for Best Experience

1. **Use Chrome or Edge**: Best compatibility with Material-UI components
2. **Keep DevTools Open**: Monitor API calls and responses (F12)
3. **Test Different Roles**: Login as guardian, parent, and admin to see all features
4. **Check Network Tab**: View actual API responses and data flow
5. **Refresh Dashboard**: Data updates every 30 seconds automatically

---

## 📞 Support & Documentation

- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **API Documentation**: `API_DOCUMENTATION.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **Deployment Guide**: `DEPLOYMENT.md`

---

## 🎉 Ready to Start!

1. **Backend**: http://localhost:8080 ✓
2. **Frontend**: http://localhost:3000 ✓
3. **Test Users**: Created ✓
4. **Login**: http://localhost:3000/login → Start Here!

**Enjoy exploring ParentCare AI! 🏥👴👵💙**
