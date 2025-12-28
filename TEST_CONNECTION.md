# Troubleshooting "Invalid Credentials" Error

## ✅ What We Verified:
1. ✓ Users exist in database
2. ✓ Users are active
3. ✓ Password is correct

## 🔍 Possible Issues:

### Issue 1: Backend Not Actually Running
**Check:** In your backend terminal, do you see:
```
Server running on port 4000
```

If not, start it:
```bash
cd backend
npm run dev
```

### Issue 2: API Connection Problem
**Test in browser console (F12):**
```javascript
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@legal.com', password: 'password123' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected:** Should return user object with token
**If error:** Backend connection issue

### Issue 3: Wrong API URL
**Check:** Open browser DevTools (F12) → Network tab
- Look for the login request
- Check the URL it's trying to hit
- Should be: `http://localhost:4000/api/auth/login`

### Issue 4: CORS Issue
**Check backend terminal for CORS errors**

### Issue 5: Typo in Credentials
**Double-check you're typing:**
- Email: `admin@legal.com` (no spaces)
- Password: `password123` (all lowercase, no spaces)

## Quick Test:

1. **Open browser console (F12)**
2. **Go to Network tab**
3. **Try to login**
4. **Check the login request:**
   - What's the status code?
   - What's the response?
   - What's the request URL?

Share these details and I can help fix it!






