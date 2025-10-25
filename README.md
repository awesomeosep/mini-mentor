[![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)

# MiniMentor
🌱 Micromentorship for the masses-- Connect, learn, and grow through personalized skill-building lesson and get the opportunity to help others achieve their goals as well.

**Deployment URL:** [https://mini-mentor-eight.vercel.app](https://mini-mentor-eight.vercel.app)

## Overview
A platform that bridges aspiring learners with experienced mentors through intelligent matching and seamless communication tools. Create mentorship listings, find perfect matches, and develop skills in a structured yet flexible environment.

## Features
- Create a mentor or learner account
- Enter profile, including experience/bio and weekly availability
- Mentor can create a listing linked to a skill
- Learner can search for a listing by skill or matching availabilities
- Learner can submit an application to a listing
- Mentor can accept a lsiting application
- Learner can contact the mentor by email

## How We Built It
**Frontend**:
- Next.js
- React
- shadcn/ui
- Tailwind CSS
  
**Backend**:
- Supabase
- PostgreSQL
- Node.js
- Next.js

We initially wanted to create this project using a Python backend, since we were all familiar with Python, but it ended up beign much more difficult, so we switched to Nextjs. We also encountered challenges building the backend APIs, since much of that was new to our team.

## What's next for MiniMentor
- Review/Messaging System (star reviews to improve mentor selection)
- Advanced moderation systems (AI-powered)
- Advanced Location-based Searching and Filter Capabilities
- Integration with platforms such as LinkedIn for skill-verification
- Session Videoconferencing Scheduling/Management Tools
- Stats-Tracking

## How to Run the Project
1. Clone the repository: git clone https://github.com/awesomeosep/mini-mentor.git
2. Navigate to the project directory: cd mini-mentor
3. Install dependancies: npm install
4. Run the development server: nom run dev
5. Open http://localhost:3000 in your browser
