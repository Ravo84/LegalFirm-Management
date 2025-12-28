# How to Start the Application

## Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 4000
```

**Keep this terminal open!** The backend must be running for the app to work.

---

## Terminal 2 - Frontend Server

Open a **NEW** terminal window and run:

```bash
cd frontend
npm install  # (only first time)
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## Then Open Browser

Go to: **http://localhost:5173**

Login with:
- Admin: `admin@legal.com` / `password123`
- Employee: `employee@legal.com` / `password123`

---

## Troubleshooting "Invalid Credentials"

1. **Check backend is running:**
   - Look at Terminal 1 - it should show "Server running on port 4000"
   - If you see errors, share them

2. **Verify database is seeded:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Check browser console (F12):**
   - Look for network errors
   - Check if API calls are failing

4. **Test backend directly:**
   ```bash
   curl http://localhost:4000/health
   ```
   Should return: `{"status":"ok"}`

