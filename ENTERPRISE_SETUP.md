# ParentCare AI Platform - Enterprise Real-time Application

## 🚀 Features Implemented

### Backend (Spring Boot)
- ✅ **WebSocket Real-time Communication** - STOMP over WebSocket for bidirectional messaging
- ✅ **Enterprise Architecture** - Professional project structure with proper separation of concerns
- ✅ **Global Exception Handling** - Consistent error responses across all endpoints
- ✅ **CORS Configuration** - Proper cross-origin resource sharing setup
- ✅ **Real-time Event Broadcasting** - Activities, emergencies, and notifications pushed to clients
- ✅ **Production Monitoring** - Spring Boot Actuator for health checks and metrics
- ✅ **Professional Logging** - Structured logging with SLF4J
- ✅ **Security Configuration** - Spring Security with JWT support
- ✅ **Database Support** - H2 (development) and PostgreSQL (production) ready

### Frontend (React + Material-UI)
- ✅ **Modern Material-UI Design** - Professional, responsive dashboard
- ✅ **Real-time Updates** - WebSocket integration for live data
- ✅ **Interactive Charts** - Recharts for data visualization
- ✅ **Real-time Activity Feed** - Live event stream with severity indicators
- ✅ **Emergency Alerts** - Dedicated emergency notification system
- ✅ **Statistics Dashboard** - Key metrics at a glance
- ✅ **Notification System** - Browser notifications for critical events
- ✅ **Professional Theme** - Custom Material-UI theme with branding
- ✅ **Responsive Design** - Mobile-friendly layout

## 📦 Installation & Setup

### Prerequisites
- ☕ Java 21 or higher (currently running Java 25)
- 🔨 Maven 3.6+
- 📦 Node.js 16+ and npm
- 🗄️ PostgreSQL (optional, for production)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies and build:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration Files
- `application.properties` - Main configuration (H2 database, logging, actuator)
- `application-supabase.properties` - PostgreSQL/Supabase configuration

### Environment Variables (Optional)
```bash
SPRING_PROFILES_ACTIVE=supabase  # To use PostgreSQL instead of H2
DATABASE_URL=your_database_url
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
```

## 📱 API Endpoints

### WebSocket Endpoint
- **WS:** `ws://localhost:8080/ws` - WebSocket connection
- **Topics:**
  - `/topic/events` - General events broadcast
  - `/topic/emergency` - Emergency alerts
  - `/user/{username}/queue/notifications` - User-specific notifications

### REST API Endpoints
- **Users:** `/api/users`
- **Activities:** `/api/activity`
- **Emergencies:** `/api/emergency`
- **Fall Detection:** `/api/fall-detection`
- **Location:** `/api/location`
- **Medicine:** `/api/medicine`
- **Safety Score:** `/api/safety-score`
- **Dashboard:** `/api/dashboard`
- **Real-time:** `/api/realtime/broadcast`

### Actuator Endpoints (Monitoring)
- **Health:** `http://localhost:8080/actuator/health`
- **Metrics:** `http://localhost:8080/actuator/metrics`
- **Info:** `http://localhost:8080/actuator/info`

## 🎨 Frontend Features

### Dashboard Components
1. **Statistics Cards** - Real-time metrics (Total Users, Active Emergencies, Activities, Safety Score)
2. **Activity Feed** - Live stream of all events with severity indicators
3. **Emergency Panel** - Dedicated emergency alert section
4. **User Cards** - Visual representation of monitored users
5. **Connection Status** - Real-time WebSocket connection indicator

### Event Types
- 🟢 **ACTIVITY** - Regular user activities
- 🟡 **MEDICINE_REMINDER** - Medication reminders
- 🔵 **LOCATION_UPDATE** - Location changes
- 🟠 **FALL_DETECTION** - Fall detection alerts
- 🔴 **EMERGENCY** - Critical emergencies

## 🔐 Security

- JWT token-based authentication (ready to implement)
- CORS properly configured for cross-origin requests
- Spring Security enabled with role-based access control
- BCrypt password encoding

## 📊 Real-time Architecture

```
┌─────────────┐         WebSocket          ┌──────────────┐
│   React     │◄───────────────────────────►│  Spring Boot │
│   Frontend  │         STOMP/SockJS        │   Backend    │
└─────────────┘                             └──────────────┘
      │                                            │
      │                                            │
      │         REST API (axios)                   │
      └──────────────────────────────────────────►│
                                                   │
                                           ┌───────▼───────┐
                                           │   Database    │
                                           │ (H2/PostgreSQL)│
                                           └───────────────┘
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Production Deployment

### Backend
```bash
cd backend
mvn clean package
java -jar target/parentcare-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
```

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your web server
```

## 🎯 Next Steps

1. **Authentication System** - Implement JWT-based login/registration
2. **User Management** - Complete CRUD operations for users
3. **Analytics Dashboard** - Advanced charts and insights
4. **Mobile App** - React Native mobile application
5. **AI Enhancements** - Improved anomaly detection algorithms
6. **Integration Tests** - End-to-end testing suite
7. **CI/CD Pipeline** - Automated deployment workflow
8. **Docker Support** - Containerization for easy deployment

## 💡 Key Technologies

### Backend
- Spring Boot 3.1.12
- Spring WebSocket
- Spring Security
- Spring Data JPA
- Spring Boot Actuator
- H2 Database / PostgreSQL

### Frontend
- React 18
- Material-UI (MUI) 5
- Recharts (Data Visualization)
- SockJS Client & STOMP
- Axios (HTTP Client)
- Notistack (Notifications)

## 📝 Design Patterns Used

- **MVC Pattern** - Model-View-Controller architecture
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation
- **DTO Pattern** - Data Transfer Objects for API communication
- **Observer Pattern** - WebSocket event subscriptions
- **Singleton Pattern** - WebSocket service instance

## 🤝 Contributing

This is an enterprise-grade application ready for:
- Team collaboration
- Continuous integration
- Production deployment
- Scalability
- Maintainability

## 📄 License

ParentCare AI Platform - Enterprise Edition

---

**Built with ❤️ using Spring Boot and React**
