# Login Troubleshooting Guide

If you're unable to login with the provided credentials, follow these steps:

## Step 1: Verify Database is Seeded

The most common issue is that the database hasn't been seeded with the default users.

### Run the seed script:

```bash
cd backend
npm run seed
```

You should see output like:
```
✓ Admin user created: admin@legal.com
✓ Employee user created: employee@legal.com
✅ Database seeded successfully!
```

### If seed fails, reset and try again:

```bash
cd backend
# Delete the database
rm -rf prisma/dev.db prisma/dev.db-journal

# Recreate database
npm run prisma:migrate

# Seed users
npm run seed
```

## Step 2: Verify Backend is Running

Make sure the backend server is running:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 4000
```

## Step 3: Check API Connection

Open your browser's developer console (F12) and check:
1. Network tab - Look for the `/api/auth/login` request
2. Check if it's returning an error
3. Check the response status code

## Step 4: Verify Frontend API URL

Check that `frontend/src/lib/api.ts` has the correct API URL:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
```

## Step 5: Test with Direct API Call

You can test the login endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@legal.com","password":"password123"}'
```

Expected response:
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "email": "admin@legal.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "fullName": "Admin User"
  }
}
```

## Step 6: Check Database Directly

You can check if users exist in the database:

```bash
cd backend
npm run prisma:studio
```

This opens Prisma Studio where you can:
1. Navigate to the User table
2. Check if `admin@legal.com` and `employee@legal.com` exist
3. Verify their `isActive` field is `true`

## Step 7: Common Issues

### Issue: "Invalid credentials" error
**Solution**: 
- Verify the password is exactly `password123` (no spaces)
- Check that the user exists in the database
- Ensure `isActive` is `true` for the user

### Issue: "Network Error" or CORS error
**Solution**:
- Verify backend is running on port 4000
- Check CORS settings in `backend/src/server.ts`
- Ensure frontend is making requests to the correct URL

### Issue: Database locked error
**Solution**:
- Close Prisma Studio if it's open
- Stop the backend server
- Delete `prisma/dev.db-journal` if it exists
- Restart the backend

### Issue: Users not found
**Solution**:
- Run `npm run seed` again
- Check that the seed script completed successfully
- Verify the database file exists: `prisma/dev.db`

## Quick Fix Script

Run this complete setup:

```bash
cd backend

# Clean and reset
rm -rf prisma/dev.db prisma/dev.db-journal node_modules/.prisma

# Reinstall and setup
npm install
npm run setup

# Start server
npm run dev
```

Then in another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Still Having Issues?

1. Check browser console for errors
2. Check backend terminal for error messages
3. Verify both servers are running
4. Try creating a new user via the register endpoint
5. Check that bcryptjs is installed: `npm list bcryptjs`



