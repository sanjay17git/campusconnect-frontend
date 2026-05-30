import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/projects/CreateProject'
import ProjectList from './pages/projects/ProjectList'
import ProjectDetail from './pages/projects/ProjectDetails'
import MyTasks from './pages/tasks/MyTasks'
function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
            } />
            <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectList/>
                </ProtectedRoute>
            } />
            <Route path="/projects/create" element={
                <ProtectedRoute>
                  <CreateProject/>
                </ProtectedRoute>
            } />
            <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail/>
                </ProtectedRoute>
            } />
            <Route path="/my-tasks" element={
            <ProtectedRoute><MyTasks /></ProtectedRoute>
            } />
             <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}

export default App