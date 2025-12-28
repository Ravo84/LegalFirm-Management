# Diagnose Login Issue - Step by Step

## ✅ Verified Working:
- ✓ Users exist in database
- ✓ Password hash is correct
- ✓ Password comparison works
- ✓ Routes are configured correctly

## 🔍 Debug Steps:

### Step 1: Check Backend is Actually Running

**In your backend terminal, you MUST see:**
```
Server running on port 4000
```

**If you don't see this, the backend is NOT running!**

### Step 2: Test Backend Directly

Open browser and go to:
```
http://localhost:4000/health
```

**Expected:** `{"status":"ok"}`
**If error:** Backend is not running or wrong port

### Step 3: Test Login API Directly

**Open browser Console (F12)** and paste this:

```javascript
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@legal.com', 
    password: 'password123' 
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});
```

**Expected:** Returns user object with token
**If error:** Check the error message

### Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for `/api/auth/login` request
5. Check:
   - **Status code** (should be 200)
   - **Request URL** (should be `http://localhost:4000/api/auth/login`)
   - **Response** (click on the request to see response)

### Step 5: Check for CORS Errors

Look in browser console for:
- "CORS policy" errors
- "Network" errors
- "Connection refused" errors

## Most Common Issues:

### Issue 1: Backend Not Running
**Solution:** 
```bash
cd backend
npm run dev
```
Wait for: `Server running on port 4000`

### Issue 2: Wrong Port
**Check:** Backend should be on port 4000
**Check:** Frontend should be on port 5173

### Issue 3: Typo in Credentials
**Make sure you're typing exactly:**
- Email: `admin@legal.com` (lowercase, @ symbol)
- Password: `password123` (all lowercase, no spaces)

### Issue 4: API URL Mismatch
**Frontend is trying to connect to:** `http://localhost:4000/api`
**Backend should be on:** `http://localhost:4000`

## Quick Test:

Run this in browser console to see exact error:
```javascript
console.log('Testing connection...');
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'admin@legal.com', password: 'password123'})
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e));
```

**Share the console output** and I can help fix it!






