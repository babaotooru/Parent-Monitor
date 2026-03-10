# Supabase Integration Setup Guide

## Quick Start

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up/Login with GitHub or email
3. Click "New Project"
4. Choose your organization
5. Set project name: `parentcare`
6. Set database password (save this!)
7. Choose region closest to your users
8. Click "Create new project" (takes ~2 minutes)

### 2. Run the Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy contents from `supabase-schema.sql`
4. Paste and click "Run"
5. Verify tables created in **Table Editor**

### 3. Get Your Credentials

From Supabase Dashboard → **Settings** → **API**:

- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon/public key**: Long JWT token (starts with `eyJ...`)
- **service_role key**: Another JWT token (use server-side only)

From **Settings** → **Database**:

- **Host**: `db.xxxxxxxxxxxxx.supabase.co`
- **Database**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: Your database password from step 1

### 4. Configure Spring Boot Backend

Update `backend/src/main/resources/application.properties`:

```properties
# Supabase PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your_database_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 5. Configure Node.js Supabase Backend (Optional)

1. Copy `.env.example` to `.env`:
   ```bash
   cd supabase-backend
   copy .env.example .env
   ```

2. Edit `.env` with your credentials

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Spring Boot + Supabase Integration

The Spring Boot application connects directly to Supabase's PostgreSQL database:

```
┌─────────────────┐
│  Spring Boot    │
│   (Java 17)     │──────► Direct PostgreSQL Connection
└─────────────────┘        (JDBC)
         │
         │                 ┌──────────────────┐
         └────────────────►│    Supabase      │
                           │   PostgreSQL     │
                           │   (Port 5432)    │
                           └──────────────────┘
```

No need for Supabase client libraries in Spring Boot - just use standard JDBC!

## Testing the Connection

### From Spring Boot:

```bash
cd backend
mvn spring-boot:run
```

Visit: http://localhost:8080/api/users

### From Node.js (optional):

```bash
cd supabase-backend
npm start
```

Visit: http://localhost:3000/users

## Security Configuration

1. Enable Row Level Security (RLS) in Supabase:
   - Go to **Authentication** → **Policies**
   - Add policies for each table

2. Use service_role key ONLY on backend
3. Use anon key for frontend/mobile apps

## Connection Pooling

Supabase provides connection pooling via PgBouncer:

- **Transaction mode**: Port 6543 (recommended for Spring Boot)
- **Session mode**: Port 5432 (default)

For better performance, use transaction mode:
```properties
spring.datasource.url=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true
```

## Monitoring

View real-time database activity:
- Supabase Dashboard → **Database** → **Monitoring**
- Check connection count, query performance, storage usage

## Backup & Recovery

Supabase automatically backs up your database:
- Point-in-time recovery available
- Manual backups in **Database** → **Backups**

## Next Steps

1. ✅ Run schema in Supabase SQL Editor
2. ✅ Update application.properties with credentials
3. ✅ Test connection: `mvn spring-boot:run`
4. ✅ Verify CRUD operations work
5. Add authentication with Supabase Auth (optional)
6. Configure RLS policies for security
7. Deploy to production
