import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        totalProjects: 0,
        myProjects: 0,
        myTasks: 0,
        joinedProjects: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [allProjects, myProjects, myTasks] = await Promise.all([
                api.get('/projects'),
                api.get('/projects/my'),
                api.get('/tasks/my')
            ])
            setStats({
                totalProjects: allProjects.data.length,
                myProjects: myProjects.data.length,
                myTasks: myTasks.data.length,
            })
        } catch (err) {
            console.error('Failed to fetch stats', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Here's what's happening on CampusConnect
                    </p>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <p className="text-gray-400">Loading stats...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">

                        <div className="bg-white rounded-xl shadow-sm 
                            p-6 border border-gray-100">
                            <p className="text-sm text-gray-500">
                                Total Projects
                            </p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                                {stats.totalProjects}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm 
                            p-6 border border-gray-100">
                            <p className="text-sm text-gray-500">
                                My Projects
                            </p>
                            <p className="text-3xl font-bold text-green-600 mt-1">
                                {stats.myProjects}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm 
                            p-6 border border-gray-100">
                            <p className="text-sm text-gray-500">
                                My Tasks
                            </p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">
                                {stats.myTasks}
                            </p>
                        </div>

                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm 
                    p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Quick Actions
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/projects')}
                            className="bg-blue-50 text-blue-600 px-4 py-2 
                                rounded-lg text-sm font-medium
                                hover:bg-blue-100 transition">
                            Browse Projects
                        </button>
                        <button
                            onClick={() => navigate('/projects/create')}
                            className="bg-green-50 text-green-600 px-4 py-2 
                                rounded-lg text-sm font-medium
                                hover:bg-green-100 transition">
                            Create Project
                        </button>
                        <button
                            onClick={() => navigate('/my-tasks')}
                            className="bg-purple-50 text-purple-600 px-4 py-2 
                                rounded-lg text-sm font-medium
                                hover:bg-purple-100 transition">
                            View My Tasks
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard