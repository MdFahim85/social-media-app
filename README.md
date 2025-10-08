
# Socially

<div align="center">

A modern, full-stack social media platform built to connect people and foster community engagement

[Demo](#demo) • [Features](#features) • [Tech Stack](#techstack) • [Folder-Structure](#folder-structure) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing) • [Contact](#contact)

</div>

----------

## Overview

Socially is a feature-rich social media web application that enables users to create and share content, engage with others through likes, comments, and reposts, and build meaningful connections within a vibrant community. Built with modern web technologies, it delivers a seamless, responsive user experience with real-time interactions.

## Demo
Live Demo - https://social-media-app-eight.vercel.app/

## Features

### 🔐 Authentication & Security

-   Secure Authentication powered by AuthJs (NextAuth)
    
-   Sign up/Sign in with email and password or Google OAuth
    
-   Password hashing for enhanced security
    
-   Persistent session management across browser reloads
    

### 👤 User Profiles

-   Comprehensive profile pages with customizable information
    
-   Profile pictures, banners, bio, location, and birthday
    
-   Follower/following statistics
    
-   Separate tabs for user posts and liked posts
    
-   Easy profile editing and updates
    

### 📝 Posts & Interactions

-   Create posts with text content and image uploads
    
-   Infinite scroll feed for seamless browsing
    
-   Like/unlike posts and comments
    
-   Repost functionality to share content
    
-   Rich post cards displaying author info, timestamps, and engagement metrics
    

### 💬 Comment System

-   Threaded comment discussions
    
-   Reply to comments to create nested conversations
    
-   Expandable and collapsible comment threads
    
-   Like functionality for individual comments
    
-   Reply and like counters
    

### 👥 Social Networking

-   Follow/unfollow other users
    
-   Personalized follow suggestions (up to 5 recommendations)
    
-   Follower and following lists
    

### 🔔 Notifications

-   Notification system
    
-   Unread notification counter in navbar
    
-   Four notification types:
    

	-   Post likes
    
	-   New comments
    
	-   Reposts
    
	-   New followers
    

	-   Mark as read and delete options
    

## TechStack

### Frontend

-   Next.js - React framework for production
    
-   TypeScript - Type-safe development
    
-   React Query - Data fetching and state management
    
-   ShadCN UI - Modern component library
    
-   Tailwind CSS - Utility-first styling
    

### Backend

-   Next.js API Routes - Serverless API endpoints
    
-   App Router - Modern Next.js routing
    

### Database & ORM

-   PostgreSQL - Relational database
    
-   Prisma - Next-generation ORM
    

### Authentication

-   AuthJs (NextAuth) - Secure authentication solution
    

### Media Management

-   Cloudinary - Cloud-based media storage
    

### Deployment

-   Vercel - Optimized hosting platform
    

## Folder-Structure

social-media-app/
├── prisma/ # Prisma schema and migrations

├── public/ # Static assets

├── src/

│ ├── app/ # Next.js App Router pages

│ ├── components/ # Reusable React components

│ ├── lib/ # Utility functions and configurations

│ ├── auth.ts # Authentication configuration

│ ├── middleware.ts # Next.js middleware

│ └── prisma.ts # Prisma client instance

├── types/ # TypeScript type definitions

├── .env # Environment variables (database)

├── .env.local # Local environment variables (secrets)

  

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher)
    
-   [PostgreSQL](https://www.postgresql.org/) (local or cloud instance)
    
-   [Google OAuth Credentials](https://console.cloud.google.com/)
    
-   [Cloudinary Account](https://cloudinary.com/)
    

### Setup Instructions

```bash
#Clone the Repository  
  
git clone https://github.com/MdFahim85/social-media-app.git

#Go inside the directory

cd social-media-app    
    

#Install Dependencies  
  
npm install    
    

#Configure Environment Variables
  
#Create a .env file in the root directory:  
  
DATABASE_URL="postgresql://user:password@localhost:5432/socially"

NODE_ENV="development"

NEXT_PUBLIC_API_ROUTE="http://localhost:3000/api/"

#Create a .env.local file for sensitive credentials:  
  
AUTH_SECRET="your-auth-secret-key"

AUTH_GOOGLE_ID="your-google-oauth-client-id"

AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"

CLOUDINARY_KEY="your-cloudinary-api-key"

CLOUDINARY_SECRET="your-cloudinary-api-secret"

            
#Set Up Database  
  
npx prisma generate

npx prisma db push


#Start the Development Server  
  
npm run dev
```
Open Your Browser  
Navigate to [http://localhost:3000](http://localhost:3000/)
    

## Usage

1.  Create an Account - Sign up using email or Google OAuth
    
2.  Complete Your Profile - Add profile picture, bio, and personal details
    
3.  Create Posts - Share your thoughts with text and images
    
4.  Engage - Like, comment, and repost content from others
    
5.  Connect - Follow users and discover new content through suggestions
    
6.  Stay Updated - Check notifications for interactions on your content
    

## Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### How to Contribute

1.  Fork the repository
``` 
#Create your feature branch  
git checkout -b feature/AmazingFeature
```
2.    
    

	#Commit your changes  
	git commit -m 'Add some AmazingFeature'

3.    
    
```
#Push to the branch  
git push origin feature/AmazingFeature
```
4. Open a Pull Request
    

## Contact

Md Fahim

-   📧 Email: mortuza.aziz.47@gmail.com
    
-   💼 GitHub: [@MdFahim85](https://github.com/MdFahim85)
    
-   🔗 LinkedIn: [MdFahim](https://linkedin.com/in/MdFahim85)
    
-   🌐 Portfolio: [MdFahim](https://mdfahim85.github.io/PortfolioMdFahim/)
    
