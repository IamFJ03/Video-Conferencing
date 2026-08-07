# MeetConf

MeetConf is a full-stack MERN video conferencing application that enables secure one-to-one and group video meetings using WebRTC and Socket.IO. It includes user authentication, email verification, meeting management, and a responsive user interface.

## 🚀 Features

- Secure User Registration & Login
- JWT Authentication
- Email Verification
- Create & Join Meetings
- One-to-One Video Calling
- Group Video Calling (Up to 6 Participants)
- Real-time Signaling with Socket.IO
- User Profile Management
- Responsive User Interface

## 🛠 Tech Stack

**Frontend**
- React.js
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT

**Real-Time Communication**
- WebRTC

## Screenshots

## 📸 Screenshots

- Login Page
<img width="1320" height="697" alt="Screenshot 2026-08-07 180436" src="https://github.com/user-attachments/assets/2bc2005c-c8fe-490a-a765-af18025836f3" />

- Dashboard Page
<img width="1322" height="706" alt="Screenshot 2026-08-07 180508" src="https://github.com/user-attachments/assets/7d54cdc0-0216-42f5-b38c-b521e16c2076" />

- New Meeting Page
<img width="1331" height="701" alt="Screenshot 2026-08-07 180529" src="https://github.com/user-attachments/assets/80e78522-ac51-41c7-ba86-353cef8de396" />

-Join Meeting Page
<img width="1326" height="707" alt="Screenshot 2026-08-07 180549" src="https://github.com/user-attachments/assets/93f47b61-d465-4877-9144-1b70ad4a013d" />

-Meeting Page
<img width="1917" height="973" alt="Screenshot 2026-08-07 182747" src="https://github.com/user-attachments/assets/8c5919cd-49ab-4e59-b1ac-b9614d77f44f" />

- Profile Page
<img width="1316" height="688" alt="Screenshot 2026-08-07 180623" src="https://github.com/user-attachments/assets/3c97c00d-0474-4069-a906-daafed3b0cbd" />

- Update profile Page
<img width="1340" height="705" alt="Screenshot 2026-08-07 180726" src="https://github.com/user-attachments/assets/59d443aa-a009-49b5-880d-cd97eb82aabb" />

- Scheduled meeting Page
<img width="1320" height="705" alt="Screenshot 2026-08-07 180747" src="https://github.com/user-attachments/assets/be54d4aa-e734-447f-bef7-3b47abc13776" />

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/<username>/MeetConf.git
cd MeetConf
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

```env
MONGO_URI=
EMAIL_USER=
EMAIL_PASS=
JWT_KEY=
CLIENT_URL=
```

Start the backend.

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend.

```bash
npm run dev
```


## 🌐 Live Demo

This project requires user authentication to access its features. The source code and screenshots are provided for evaluation.
