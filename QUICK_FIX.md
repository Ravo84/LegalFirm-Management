# Quick Fix for Login Issues

## If login is not working, run these commands:

### 1. Reset and Setup Database

```bash
cd backend

# Remove old database
rm -rf prisma/dev.db prisma/dev.db-journal

# Generate Prisma client
npm run prisma:generate

# Create database and tables
npm run prisma:migrate

# Seed default users
npm run seed
```

### 2. Verify Backend is Running

```bash
cd backend
npm run dev
```

You should see: `Server running on port 4000`

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

### 4. Try Login Again

- Email: `admin@legal.com`
- Password: `password123`

## If Still Not Working

1. **Check if users exist in database:**
   ```bash
   cd backend
   npm run prisma:studio
   ```
   Open the User table and verify the emails exist.

2. **Test API directly:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@legal.com","password":"password123"}'
   ```

3. **Check browser console** for any errors

4. **Check backend terminal** for error messages

## Alternative: Create User via API

If seeding doesn't work, you can register a new user:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@legal.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```



