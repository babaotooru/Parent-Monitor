# ParentCare AI Platform - Deployment Checklist

## ✅ Pre-Deployment Checklist

### Backend Preparation
- [ ] All tests passing: `mvn test`
- [ ] Code compiles without errors: `mvn clean compile`
- [ ] No Lombok dependencies (removed for Java 25 compatibility)
- [ ] All environment variables documented
- [ ] Security configuration reviewed
- [ ] CORS properly configured for production domains
- [ ] Connection pooling optimized (max 10 for Supabase free tier)
- [ ] Logging configured (remove sensitive data from logs)

### Database Setup
- [ ] Supabase project created
- [ ] Database schema deployed (`supabase-schema.sql`)
- [ ] All 11 tables created successfully
- [ ] Indexes created for performance
- [ ] Row Level Security (RLS) policies defined
- [ ] Test data inserted and validated
- [ ] Backup strategy confirmed

### Frontend Preparation
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables in `.env.local`
- [ ] API endpoints updated for production
- [ ] Supabase credentials configured
- [ ] Error boundaries implemented
- [ ] Loading states implemented
- [ ] Mobile responsive design tested

### Security Checklist
- [ ] Authentication implemented (Supabase Auth or JWT)
- [ ] Authorization rules defined (role-based access)
- [ ] Row Level Security enabled on all tables
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] HTTPS enforced in production
- [ ] Secure password hashing (BCrypt)
- [ ] API rate limiting configured
- [ ] Sensitive data encrypted at rest
- [ ] CORS limited to known domains

## 🚀 Deployment Steps

### Step 1: Deploy Database (Supabase)

1. **Verify Schema**
   ```bash
   # Connect to Supabase via psql
   psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   
   # List all tables
   \dt
   
   # Should see all 11 tables:
   # - users
   # - medicines
   # - activity_logs
   # - emergency_logs
   # - fall_detection
   # - location_logs
   # - notifications
   # - video_sessions
   # - daily_check_ins
   # - safety_scores
   ```

2. **Enable RLS**
   ```sql
   -- Enable Row Level Security on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
   ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE emergency_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE fall_detection ENABLE ROW LEVEL SECURITY;
   ALTER TABLE location_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
   ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
   ALTER TABLE safety_scores ENABLE ROW LEVEL SECURITY;
   ```

3. **Create Policies**
   ```sql
   -- Example: Users can read their own data
   CREATE POLICY "Users can view own data" ON users
     FOR SELECT USING (auth.uid()::text = id::text);
   
   -- Guardians can view their parents' data
   CREATE POLICY "Guardians view parents" ON users
     FOR SELECT USING (
       guardian_id::text = auth.uid()::text OR 
       id::text = auth.uid()::text
     );
   ```

### Step 2: Deploy Backend (Spring Boot)

#### Option A: Render.com

1. **Create Web Service**
   - Connect GitHub repository
   - Build Command: `cd backend && mvn clean package -DskipTests`
   - Start Command: `java -jar backend/target/parentcare-backend-0.0.1-SNAPSHOT.jar`

2. **Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=supabase
   SPRING_DATASOURCE_URL=jdbc:postgresql://db.[PROJECT].supabase.co:5432/postgres
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=[YOUR_PASSWORD]
   SERVER_PORT=8080
   ```

3. **Deploy**
   - Push to GitHub main branch
   - Render auto-deploys
   - Check logs for successful startup

#### Option B: Railway.app

1. **New Project from GitHub**
   - Select repository
   - Railway auto-detects Spring Boot

2. **Configure Environment**
   ```bash
   railway variables set SPRING_PROFILES_ACTIVE=supabase
   railway variables set SPRING_DATASOURCE_URL=jdbc:postgresql://...
   railway variables set SPRING_DATASOURCE_PASSWORD=your_password
   ```

3. **Deploy**
   ```bash
   railway up
   ```

#### Option C: Heroku

1. **Create app**
   ```bash
   heroku create parentcare-backend
   ```

2. **Add Buildpack**
   ```bash
   heroku buildpacks:set heroku/java
   ```

3. **Configure**
   ```bash
   heroku config:set SPRING_PROFILES_ACTIVE=supabase
   heroku config:set SPRING_DATASOURCE_URL=jdbc:postgresql://...
   heroku config:set SPRING_DATASOURCE_PASSWORD=your_password
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Step 3: Deploy Frontend (React)

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment**
   Create `frontend/.env.production`:
   ```
   REACT_APP_SUPABASE_URL=https://[PROJECT].supabase.co
   REACT_APP_SUPABASE_KEY=your_anon_key
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

#### Option B: Netlify

1. **Build**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod --dir=build
   ```

3. **Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all REACT_APP_* variables

#### Option C: Vercel via GitHub (Auto Deploy)

1. **Connect Repository**
   - Go to vercel.com/new
   - Import GitHub repository
   - Select `frontend` directory

2. **Configure**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables**
   - Add in Vercel dashboard

4. **Deploy**
   - Vercel auto-deploys on push to main

### Step 4: Domain & SSL

1. **Backend Domain**
   ```
   api.parentcare.app → Backend service
   ```

2. **Frontend Domain**
   ```
   app.parentcare.app → Frontend app
   ```

3. **SSL**
   - Render/Vercel/Netlify provide free SSL
   - Or use Cloudflare for custom domains

### Step 5: Monitoring Setup

1. **Supabase Monitoring**
   - Enable alerts in Supabase Dashboard
   - Monitor API usage
   - Set up database backups

2. **Application Monitoring**
   - Add Sentry for error tracking:
     ```bash
     npm install @sentry/react
     ```
   - Configure in `App.js`

3. **Uptime Monitoring**
   - Use UptimeRobot or Pingdom
   - Monitor both backend and frontend

## 🧪 Post-Deployment Testing

### Backend Tests
```bash
# Health check
curl https://api.parentcare.app/actuator/health

# API test
curl https://api.parentcare.app/api/users

# Create user
curl -X POST https://api.parentcare.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","role":"PARENT"}'
```

### Frontend Tests
1. Open https://app.parentcare.app
2. Test user registration
3. Test login
4. Test CRUD operations
5. Test real-time updates
6. Test on mobile devices

### Load Testing
```bash
# Install k6
npm install -g k6

# Run load test
k6 run loadtest.js
```

## 📊 Performance Optimization

### Backend
- [ ] Enable caching (Redis)
- [ ] Optimize database queries
- [ ] Use connection pooling
- [ ] Enable GZIP compression
- [ ] Use CDN for static assets

### Frontend
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Service worker for PWA
- [ ] Bundle size analysis

### Database
- [ ] Query optimization
- [ ] Index optimization
- [ ] Vacuum database
- [ ] Monitor slow queries

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Test Backend
        run: cd backend && mvn test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: curl https://api.render.com/deploy/[YOUR_HOOK]

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📋 Launch Checklist

- [ ] All tests passing
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database backups configured
- [ ] SSL certificates active
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Error monitoring active
- [ ] Logging configured
- [ ] Performance tested
- [ ] Mobile responsiveness verified
- [ ] All API endpoints documented
- [ ] User documentation created
- [ ] Support channels set up
- [ ] Analytics configured (Google Analytics, Mixpanel)
- [ ] Legal pages added (Privacy Policy, Terms of Service)

## 🎉 Go Live!

Your ParentCare AI Platform is now production-ready and deployed! 🚀

### Support Resources
- 📖 Documentation: [NEXT_STEPS.md](NEXT_STEPS.md)
- 🗄️ Database: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord/Slack

### Post-Launch Tasks
1. Monitor error rates (first 24 hours)
2. Collect user feedback
3. Fix critical bugs
4. Plan next feature release
5. Update documentation

---

**Deployment Time Estimate**: 2-4 hours for initial launch
**Cost Estimate** (Free Tier): $0/month for <500 users
