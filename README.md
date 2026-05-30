# CampusConnect — Frontend

A college collaboration platform frontend built with React.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router v6

## Features
- JWT Authentication
- Project listing with search and filter
- Project detail with tabs (tasks, resources, requests)
- Team join request management
- Task status tracking
- Resource sharing with type icons
- Protected routes
- Responsive design

## Setup

### Prerequisites
- Node.js 18+

### Steps
1. Clone the repo
2. Install dependencies
```bash
   npm install
```
3. Create `.env` file
```env
   VITE_API_BASE_URL=http://localhost:8080/api
```
4. Run the app
```bash
   npm run dev
```

## Pages
| Route | Description |
|---|---|
| /login | Login page |
| /register | Register page |
| /dashboard | Dashboard with stats |
| /projects | All projects list |
| /projects/create | Create new project |
| /projects/:id | Project detail |
| /my-tasks | My assigned tasks |

## Environment Variables
| Variable | Description |
|---|---|
| VITE_API_BASE_URL | Backend API base URL |