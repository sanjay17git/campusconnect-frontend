import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const Profile = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const response = await api.get('/profile')
            setProfile(response.data)
        } catch (err) {
            console.error('Failed to fetch profile', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="text-center py-20 text-gray-400">
                Loading profile...
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm 
                    border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-6">

                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full 
                            bg-blue-100 flex items-center 
                            justify-center text-blue-600 
                            text-3xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold 
                                text-gray-800">
                                {profile?.name}
                            </h1>
                            <p className="text-gray-500">
                                {profile?.email}
                            </p>
                            <span className="inline-block mt-2 
                                bg-blue-50 text-blue-600 text-xs 
                                px-3 py-1 rounded-full font-medium">
                                {profile?.role}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="text-center px-6 
                            border-l border-gray-100">
                            <p className="text-3xl font-bold 
                                text-blue-600">
                                {profile?.totalProjects}
                            </p>
                            <p className="text-sm text-gray-400">
                                Projects Created
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 
                                px-4 py-2 rounded-lg text-sm
                                font-medium hover:bg-red-100 
                                transition">
                            Logout
                        </button>
                    </div>
                </div>

                {/* My Projects */}
                <div>
                    <h2 className="text-lg font-semibold 
                        text-gray-700 mb-4">
                        My Projects
                    </h2>

                    {profile?.projects?.length === 0 ? (
                        <div className="bg-white rounded-xl 
                            border border-gray-100 p-8 
                            text-center text-gray-400">
                            No projects created yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {profile?.projects?.map(project => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(
                                        `/projects/${project.id}`)}
                                    className="bg-white rounded-xl 
                                        border border-gray-100 p-4
                                        cursor-pointer 
                                        hover:shadow-md transition">
                                    <div className="flex items-center 
                                        justify-between mb-2">
                                        <h3 className="font-semibold 
                                            text-gray-800">
                                            {project.title}
                                        </h3>
                                        <span className={`text-xs px-2 
                                            py-1 rounded-full font-medium
                                            ${project.status === 'OPEN'
                                                ? 'bg-green-100 text-green-700'
                                                : project.status === 'IN_PROGRESS'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-100 
                                        rounded-full h-1.5 mb-1">
                                        <div
                                            className="bg-blue-500 h-1.5 
                                                rounded-full"
                                            style={{
                                                width: `${project.completionPercentage}%`
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {project.completedTasks}/
                                        {project.totalTasks} tasks • 
                                        {project.completionPercentage}% complete
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile