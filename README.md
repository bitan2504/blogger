<div align="center">

# ✍️ Blogger

### A Modern Full-Stack Blogging Platform

*Share your thoughts, connect with readers, and build your community*

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2d3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🌟 Overview

Blogger is a feature-rich, full-stack blogging platform built with modern web technologies. It provides an intuitive interface for writers to share their stories, engage with readers through comments, and build a community of followers.

## ✨ Features

- 📝 **Create & Edit Posts** - Rich text editor for crafting beautiful blog posts
- 💬 **Comments System** - Engage with your readers through threaded comments
- ❤️ **Like Posts** - Show appreciation for content you love
- 👥 **Follow Users** - Build your network and stay updated with favorite writers
- 🏷️ **Tags** - Organize and discover content by topics
- 👤 **User Profiles** - Customizable profiles with avatars and bio
- 🔐 **Authentication** - Secure JWT-based authentication with refresh tokens
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Real-time Updates** - Smooth interactions with optimized performance
- 🎨 **Modern UI** - Clean interface with Tailwind CSS and Framer Motion animations

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3
- **Build Tool:** Vite 6.0
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express 5.2
- **Database:** PostgreSQL
- **ORM:** Prisma 7.3
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer + Cloudinary
- **Security:** Helmet, CORS, Compression

## 📊 Database Schema

```
User          Post          Comment       Like          Follow        Tag
├─ id         ├─ id         ├─ id         ├─ userId     ├─ followerId  ├─ id
├─ username   ├─ title      ├─ content    ├─ postId     ├─ followingId ├─ name
├─ email      ├─ content    ├─ authorId   └─ createdAt  └─ createdAt   └─ posts[]
├─ fullname   ├─ authorId   ├─ postId
├─ password   ├─ tags[]     └─ createdAt
├─ avatar     ├─ likes[]
└─ posts[]    └─ comments[]
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blogger.git
   cd blogger
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/blogger"

   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Server
   PORT=3000
   NODE_ENV=development
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   cd server
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Run the application**

   In separate terminals:
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port Vite assigns)

## 📁 Project Structure

```
blogger/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── public/           # Static assets
│
├── server/               # Express backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Custom middleware
│   │   ├── utils/        # Utility functions
│   │   └── db/          # Database configuration
│   └── prisma/
│       └── schema.prisma # Database schema
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v2/user/register` - Register new user
- `POST /api/v2/user/login` - User login
- `POST /api/v2/user/logout` - User logout
<!-- - `POST /api/v2/user/refresh` - Refresh access token -->

### Posts
- `GET /api/v2/post` - Get all posts
- `GET /api/v2/post/:id` - Get single post
- `POST /api/v2/post` - Create new post
<!-- - `PUT /api/v2/post/:id` - Update post -->
<!-- - `DELETE /api/v2/post/:id` - Delete post -->

### Comments
- `GET /api/v2/post/:id/comments` - Get post comments
- `POST /api/v2/post/:id/comment` - Add comment
<!-- - `DELETE /api/v2/comment/:id` - Delete comment -->

### Likes
- `POST /api/v2/post/:id/like` - Like/Unlike post
<!-- - `GET /api/v2/post/:id/likes` - Get post likes -->

### Follow
- `POST /api/v2/connect/follow/:id` - Follow/Unfollow user
<!-- - `GET /api/v2/connect/followers` - Get user followers -->
<!-- - `GET /api/v2/connect/following` - Get following users -->

### User Profile
- `GET /api/v2/user/profile/:id` - Get user profile
<!-- - `PUT /api/v2/user/profile` - Update profile -->
<!-- - `POST /api/v2/user/avatar` - Upload avatar -->

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ by Bitan Das

---

<div align="center">

**[⬆ Back to Top](#-blogger)**

</div>