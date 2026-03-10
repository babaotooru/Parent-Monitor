# ParentCare AI - Quick Start Guide

## 🎉 Your Enterprise Application is Running!

### Backend Status: ✅ RUNNING
- **URL:** http://localhost:8080
- **WebSocket:** ws://localhost:8080/ws
- **H2 Console:** http://localhost:8080/h2-console
- **Health Check:** http://localhost:8080/actuator/health

### Frontend Status: ✅ RUNNING
- **URL:** http://localhost:3000
- **Dashboard:** Modern Material-UI interface with real-time updates

## 🚀 Quick Access

1. **Open the Dashboard:**
   ```
   http://localhost:3000
   ```

2. **Test Real-time Features:**
   - The dashboard automatically connects via WebSocket
   - Watch the connection status indicator (top-right)
   - Events will appear in real-time as they occur

## 📊 What's New - Enterprise Features

### Real-time Communication
✅ WebSocket STOMP protocol for bidirectional messaging
✅ Live activity feed with severity indicators
✅ Emergency alerts broadcast to all guardians
✅ User-specific notifications
✅ Auto-reconnection on connection loss

### Professional UI/UX
✅ Material-UI design system
✅ Responsive grid layout
✅ Interactive data visualizations (Recharts ready)
✅ Real-time statistics cards
✅ Browser notifications for critical events
✅ Custom theme with branding colors

### Backend Architecture
✅ Global exception handling
✅ CORS configuration
✅ Spring Boot Actuator monitoring
✅ Professional logging (SLF4J)
✅ DTO pattern for API responses
✅ Service layer architecture
✅ Repository pattern

### API Integrations
✅ Axios HTTP client with interceptors
✅ Centralized API service
✅ Error handling middleware
✅ JWT token support (ready)

## 🧪 Testing the App

### Create a Test Activity
```bash
curl -X POST http://localhost:8080/api/activity \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "activityType": "Walking",
    "stepCount": 5000,
    "activeMinutes": 45
  }'
```

### Create a Test Emergency
```bash
curl -X POST http://localhost:8080/api/emergency \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "type": "FALL",
    "severity": "HIGH",
    "description": "Fall detected in living room"
  }'
```

### Get All Users
```bash
curl http://localhost:8080/api/users
```

## 📖 Using the Dashboard

### Features Available
1. **Statistics Overview** - Total users, active emergencies, activities, safety scores
2. **Real-time Event Feed** - Live stream of all activities and events
3. **Emergency Panel** - Dedicated section for critical alerts
4. **User Cards** - Visual cards for each monitored user
5. **Connection Status** - Real-time WebSocket connection indicator

### Event Types
- 🟢 **ACTIVITY** - Regular user activities (walking, sleeping, phone usage)
- 🟡 **MEDICINE_REMINDER** - Medication reminders
- 🔵 **LOCATION_UPDATE** - Location changes
- 🟠 **FALL_DETECTION** - Fall detection alerts (high severity)
- 🔴 **EMERGENCY** - Critical emergencies requiring immediate attention

### Severity Levels
- **LOW** - Normal activities, regular updates
- **MEDIUM** - Reminders, routine notifications
- **HIGH** - Anomalies detected, unusual patterns
- **CRITICAL** - Emergencies, falls, SOS alerts

## 🔧 Configuration

### Backend Configuration
File: `backend/src/main/resources/application.properties`

Key settings:
- `server.port=8080`
- Database: H2 in-memory (switch to PostgreSQL for production)
- Logging level: DEBUG for development
- Actuator endpoints enabled

### Frontend Configuration
File: `frontend/src/services/ApiService.js`
- API Base URL: `http://localhost:8080/api`
- WebSocket URL: `http://localhost:8080/ws`

## 🎯 Next Steps

### Immediate Enhancements
1. **Add User Authentication** - JWT login system
2. **Complete User Management** - CRUD operations
3. **Advanced Analytics** - Charts and graphs for historical data
4. **Mobile Responsive** - Test and optimize for mobile devices
5. **Database Migration** - Switch to PostgreSQL for production

### Production Readiness
1. **Environment Variables** - Externalize configuration
2. **Docker Support** - Create Dockerfile and docker-compose
3. **CI/CD Pipeline** - Set up automated testing and deployment
4. **Security Hardening** - Enable HTTPS, rate limiting
5. **Performance Optimization** - Caching, connection pooling
6. **Monitoring** - Set up Prometheus/Grafana

## 📝 API Documentation

### WebSocket Topics
- `/topic/events` - General event broadcast (all activities)
- `/topic/emergency` - Emergency alerts only
- `/user/{username}/queue/notifications` - User-specific messages

### REST Endpoints
All APIs are prefixed with `/api/`

**Health & Monitoring:**
- `GET /actuator/health` - System health status
- `GET /actuator/metrics` - Application metrics

**Core APIs:**
- `GET /users` - List all users
- `POST /activity` - Log activity
- `POST /emergency` - Create emergency
- `GET /fall-detection/recent` - Recent falls
- `GET /location/user/{id}/latest` - Latest location
- `GET /medicine/user/{id}/due` - Due medicines

## 🛟 Troubleshooting

### Backend Won't Start
- Check if port 8080 is available
- Verify Java 21+ is installed: `java -version`
- Check logs in the terminal

### Frontend Won't Start
- Check if port 3000 is available
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

### WebSocket Not Connecting
- Verify backend is running on port 8080
- Check CORS configuration in SecurityConfig.java
- Check browser console for error messages

### No Real-time Updates
- Check WebSocket connection indicator (should be green)
- Verify events are being created via API
- Check browser console for WebSocket messages

## 💡 Technology Stack

**Backend:**
- Java 21+ (Currently running Java 25)
- Spring Boot 3.1.12
- Spring WebSocket (STOMP)
- Spring Security
- Spring Data JPA
- H2 Database (Development)
- PostgreSQL (Production)
- Maven 3.9+

**Frontend:**
- React 18.2
- Material-UI 5.15
- Recharts 2.5
- SockJS Client 1.6
- STOMP.js 7.0
- Axios 1.6
- Date-fns 2.30

## 📚 Documentation Files
- `ENTERPRISE_SETUP.md` - Complete setup guide
- `API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT.md` - Deployment instructions
- `SUPABASE_SETUP.md` - Database setup

## 🔐 Default Credentials (Development Only)
- Username: `admin`
- Password: `admin`

## 🌟 Key Improvements Made
1. ✅ WebSocket real-time communication
2. ✅ Professional Material-UI dashboard
3. ✅ Enterprise-grade error handling
4. ✅ Production monitoring (Actuator)
5. ✅ Real-time event broadcasting
6. ✅ Modern React architecture
7. ✅ RESTful API design
8. ✅ Responsive UI design
9. ✅ Professional logging
10. ✅ CORS configuration

---

**🎊 Congratulations! You now have an enterprise-grade, real-time monitoring application!**

For questions and support, check the documentation files or the code comments.
