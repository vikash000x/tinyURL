#  TinyURL  
### **A full-stack URL shortener with analytics & JWT-based authentication**

TinyURL is a modern, secure, and responsive URL shortening platform that includes OTP verification, authentication, analytics tracking, and a fully responsive frontend with theme switching using React Context API.

---

# 🧩 Overview
TinyURL is a full-stack application that allows users to shorten long URLs, manage them securely, and analyze click statistics. It includes:

- OTP Email verification (expires in **10 minutes**)  
- JWT-based authentication  
- URL shortening + redirection  
- Analytics dashboard  
- Theme toggle using Context API  
- Fully responsive UI  

The project contains two folders:
- **frontend/**
- **backend/**

---

# ⭐ Features

### 🔐 Authentication & Security
- Signup, Login, Forgot Password, Reset Password  
- OTP verification (10-minute expiry)  
- JWT authentication  
- Secure cookies  
- Helmet, CORS, Rate Limiting  
- Password hashing with bcrypt  

### ✂️ URL Shortening
- Create short URLs  
- Redirect via `/:code`  
- Monitor total clicks  
- Analytics tracking (device, OS, timestamp)

### 📊 Analytics
- Stats page: `/code/:code`  
- Charts for data visualization  
- Real-time insights  

### 🎨 Frontend Features
- Theme switching via **Context API**  
- Tailwind CSS for styling  
- React Router DOM for routing  
- Interactive charts  
- Custom 404  
- Health Check Page (`/healthz`)

### ⚙️ Backend Features
- Express.js REST API  
- Prisma ORM + Neon Database  
- Nodemailer for OTP sending  
- Zod for validation  
- Modular route structure  
- Logger (morgan)  
- Express-rate-limit for security  

---

# 🏗️ Tech Stack

### **Frontend**
- React  
- Tailwind CSS  
- Context API  
- React Router DOM  
- Charts.js / Recharts  

### **Backend**
- Node.js  
- Express 5  
- Prisma ORM  
- NeonDB  
- Nodemailer  
- JSON Web Tokens  
- Zod  
- bcrypt  
- Helmet / CORS / Morgan  

---

# 📁 Project Structure

TinyURL/
│
├── frontend/
│ ├── src/
│ │ ├── context/
│ │ ├── components/
│ │ ├── pages/
│ │ └── routes/
│ ├── public/
│ └── package.json
│
└── backend/
├── src/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ ├── utils/
│ └── prisma/
├── prisma/schema.prisma
├── server.js
└── package.json


---

# 🎨 Frontend Routing Example

```tsx
<Routes>
  <Route path="/signup" element={<Signup />} />
  <Route path="/verify" element={<VerifyOTP />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot" element={<Forgot />} />
  <Route path="/reset" element={<ResetPassword />} />

  <Route path="/:code" element={<RedirectPage />} />
  <Route path="/code/:code" element={<StatsPage />} />

  <Route path="/healthz" element={<HealthCheck />} />

  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

  <Route path="/404" element={<div className="text-center text-xl mt-40">URL Not Found</div>} />
  <Route path="*" element={<div className="text-center text-xl mt-40">URL Not Found</div>} />
</Routes>

---

# 🛣️ Backend Route Structure

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/redirect", redirectRoutes);
app.use("/healthz", healthRoutes);


---

# ⚙️ Installation
1️⃣ Clone the repo
git clone https://github.com/your-username/tinyurl.git
cd tinyurl

2️⃣ Install frontend dependencies
cd frontend
npm install

3️⃣ Install backend dependencies
cd ../backend
npm install

---
# 🔐 Environment Variables
Frontend .env
VITE_BACKEND_URL=http://localhost:5000

Backend .env
DATABASE_URL=your-neon-db-url
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
CLIENT_URL=http://localhost:5173


---

# ▶️ Running the Project
Start frontend
cd frontend
npm run dev

Start backend
cd backend
npm run dev

---

# 🔄 OTP & Auth Flow

User signs up → backend sends OTP via Nodemailer

OTP expires in 10 minutes

After verification → JWT is generated

Token stored in cookies

Protected routes require valid JWT

Password reset also uses OTP verification

🛠️ Troubleshooting
🔸 OTP not sending?

Check SMTP credentials

Allow less secure apps if using Gmail

🔸 Database not connecting?

Ensure NeonDB connection string is correct

Run npx prisma migrate deploy

🔸 CORS errors?

Make sure CLIENT_URL matches frontend URL

---

👥 Contributors

vikash sinha – Creator & Developer


