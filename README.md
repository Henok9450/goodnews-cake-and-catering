# GoodNews Cake - Premium Custom Bakery Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.16-purple.svg)](https://www.framer.com/motion/)

A sophisticated, full-stack custom cake ordering and catering platform designed for modern bakeries. Featuring a sleek, responsive UI, real-time data management, and a robust admin dashboard.

---

## 🌟 Key Features

### 🍰 Custom Cake & Catering Requests
- **Interactive Forms**: Seamless custom order forms with real-time validation using `react-hook-form`.
- **Diverse catalog**: Dedicated pages for Cookies, Cupcakes, Seasonal items, and Catering services.
- **Order Tracking**: Real-time status updates for customers.

### 🔐 Admin Dashboard
- **Orders Management**: Comprehensive dashboard to track, update, and manage incoming orders.
- **Secure Access**: Integrated Firebase Authentication for authorized administrative access.
- **Data Analytics**: Integrated Firebase Analytics to track user engagement and popular products.

### 🎨 Premium UI/UX
- **Modern Design**: Built with Tailwind CSS for a premium, clean aesthetic.
- **Smooth Animations**: Enhanced user experience with `framer-motion` for fluid transitions and micro-interactions.
- **Fully Responsive**: Optimized for every device, from mobile to desktop.

### 📧 Seamless Communication
- **EmailJS Integration**: Automated email notifications for orders and catering inquiries.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend-as-a-Service**: Firebase (Firestore, Authentication, Analytics)
- **Forms & Validation**: React Hook Form
- **Communication**: EmailJS
- **Routing**: React Router DOM

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Henok9450/goodnews-cake-and-catering.git
   cd goodnews-cake-and-catering
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
   REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

---

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components
├── config/       # Firebase and system configurations
├── contexts/     # State management (Auth, Theme, etc.)
├── data/         # Static data and constants
├── hooks/        # Custom React hooks
├── pages/        # Main route components
├── services/     # API and external integrations
└── utils/        # Helper functions
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for the GoodNews Bakery team.
