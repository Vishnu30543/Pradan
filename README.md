# 🌾 Agricultural Management System (Pradan)

<div align="center">

**A comprehensive MERN stack platform for streamlining agricultural operations and empowering farmers with digital tools**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Real-World Applications](#-real-world-applications)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Agricultural Management System (Pradan)** is a full-stack web application designed to digitize and modernize agricultural operations. It bridges the gap between farmers, agricultural executives, and administrators by providing role-based access to powerful management tools.

This platform addresses critical challenges in agriculture such as:
- ✅ Fragmented communication between stakeholders
- ✅ Lack of centralized data for field monitoring
- ✅ Difficulty accessing government schemes and subsidies
- ✅ Limited income tracking and financial transparency
- ✅ Inefficient request and resource management

By leveraging modern web technologies, Pradan empowers farmers with data-driven insights while enabling executives and administrators to make informed decisions at scale.

---

## ✨ Features

### 👨‍🌾 For Farmers
- **Dashboard**: Personalized overview of field status, notifications, and income
- **Field Management**: Monitor crop status, upload field photos, and track progress
- **Request Management**: Submit and track requests for resources, support, or guidance
- **Government Schemes**: Browse and apply for government agricultural schemes and subsidies
- **Income Tracking**: View detailed income analysis and financial reports
- **Notifications**: Receive real-time updates on requests, scheme approvals, and announcements
- **Profile Management**: Update personal information and contact details

### 👔 For Executives
- **Farmer Management**: Oversee farmer profiles, field data, and performance metrics
- **Field Monitoring**: Real-time monitoring of field conditions across multiple farmers
- **Request Handling**: Review, approve, or reject farmer requests with notes
- **Scheme Management**: Manage government scheme applications and approvals
- **SMS Broadcast**: Send bulk SMS notifications to farmers for announcements
- **Carbon Credits**: Track and manage carbon credit initiatives
- **Income Analysis**: Generate reports on farmer income trends and patterns
- **Analytics Dashboard**: Visualize key metrics and operational insights

### 👨‍💼 For Administrators
- **Executive Management**: Create, update, and manage executive accounts
- **Farmer Overview**: System-wide view of all farmers and their activities
- **Analytics & Reports**: Generate comprehensive reports on system usage, schemes, and financials
- **Settings Management**: Configure system-wide settings and parameters
- **User Role Management**: Assign and manage user permissions

---

## 🌍 Real-World Applications

### 1. **Government Agricultural Programs**
- Streamline the distribution and tracking of government subsidies
- Monitor scheme enrollment and impact at scale
- Reduce paperwork and manual processing

### 2. **Agricultural Cooperatives & NGOs**
- Coordinate support for farmer communities
- Track resource allocation and impact metrics
- Facilitate communication between field workers and farmers

### 3. **Corporate Sustainability Initiatives**
- Monitor carbon credits and environmental impact
- Track sustainable farming practices
- Generate ESG (Environmental, Social, Governance) reports

### 4. **Farmer Producer Organizations (FPOs)**
- Centralize farmer data and operations
- Enable better negotiation power through collective analytics
- Improve access to financial services and markets

### 5. **Agricultural Extension Services**
- Track field visits and farmer interactions
- Distribute best practices and training materials
- Monitor adoption of modern farming techniques

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client for API requests
- **CSS3** - Responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **PDFKit** - PDF generation for reports

### DevOps & Tools
- **Git** - Version control
- **Nodemon** - Development auto-reload
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vishnu30543/Pradan.git
cd Pradan
```

#### 2️⃣ Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create environment file
# Copy the example env file and configure it
cp config/.env.example .env

# Edit the .env file with your configuration
# Use any text editor (notepad, vim, code, etc.)
notepad .env
```

**Configure your `.env` file:**

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pradan

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pradan?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Start the backend server:**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

#### 3️⃣ Frontend Setup

Open a **new terminal** window/tab:

```bash
# Navigate to the client directory from the project root
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The React app will start on `http://localhost:5173` (Vite default)

#### 4️⃣ Create Admin User (First Time Setup)

In another **new terminal**, navigate to the server directory and run:

```bash
cd server
node addAdmin.js
```

This will create an initial admin account. Use the credentials printed in the console to log in.

---

## 📂 Project Structure

```
pradan/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   └── common/          # Common components (ProtectedRoute, etc.)
│   │   ├── context/             # React Context (Auth, etc.)
│   │   ├── layouts/             # Layout components per role
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ExecutiveLayout.jsx
│   │   │   └── FarmerLayout.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── admin/           # Admin pages
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── executive/       # Executive pages
│   │   │   └── farmer/          # Farmer pages
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js backend
│   ├── config/                  # Configuration files
│   │   ├── db.js                # MongoDB connection
│   │   └── .env.example         # Environment template
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── farmerController.js
│   │   ├── executiveController.js
│   │   ├── adminController.js
│   │   └── ...
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Farmer.js
│   │   ├── Executive.js
│   │   ├── Field.js
│   │   ├── Request.js
│   │   └── ...
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── executiveRoutes.js
│   │   ├── adminRoutes.js
│   │   └── index.js
│   ├── utils/                   # Utility functions
│   │   ├── generateToken.js
│   │   ├── fileUpload.js
│   │   └── smsService.js
│   ├── uploads/                 # Uploaded files storage
│   ├── server.js                # Entry point
│   ├── addAdmin.js              # Admin creation script
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file in the `server/` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pradan` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key_here` |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | `5242880` (5MB) |
| `UPLOAD_PATH` | Upload directory path | `./uploads` |
| `SMS_API_KEY` | SMS service API key (optional) | Your SMS provider key |
| `SMS_API_SECRET` | SMS service secret (optional) | Your SMS provider secret |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Farmer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/farmers` | Get all farmers |
| GET | `/api/farmers/:id` | Get farmer by ID |
| PUT | `/api/farmers/:id` | Update farmer |
| DELETE | `/api/farmers/:id` | Delete farmer |
| GET | `/api/farmers/:id/fields` | Get farmer fields |
| GET | `/api/farmers/:id/requests` | Get farmer requests |

### Field Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fields` | Get all fields |
| POST | `/api/fields` | Create new field |
| GET | `/api/fields/:id` | Get field by ID |
| PUT | `/api/fields/:id` | Update field |
| DELETE | `/api/fields/:id` | Delete field |
| POST | `/api/fields/:id/photos` | Upload field photos |

### Request Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests` | Get all requests |
| POST | `/api/requests` | Create new request |
| GET | `/api/requests/:id` | Get request by ID |
| PUT | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |
| PUT | `/api/requests/:id/approve` | Approve request |
| PUT | `/api/requests/:id/reject` | Reject request |

### Scheme Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemes` | Get all schemes |
| POST | `/api/schemes` | Create new scheme |
| GET | `/api/schemes/:id` | Get scheme by ID |
| PUT | `/api/schemes/:id` | Update scheme |
| DELETE | `/api/schemes/:id` | Delete scheme |
| POST | `/api/schemes/:id/apply` | Apply for scheme |

---

## 🧪 Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a Pull Request**

### Code Style
- Follow ESLint rules for JavaScript
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Inspired by the need to digitize agricultural operations in rural India
- Built to support government initiatives like PM-KISAN and other farmer welfare programs
- Thanks to the open-source community for the amazing tools and libraries

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/Vishnu30543/Pradan/issues)
- **Email**: vishnusaiyanduru@gmail.com

---

<div align="center">

**Made with ❤️ for farmers everywhere**

⭐ Star this repo if you find it useful!

</div>
