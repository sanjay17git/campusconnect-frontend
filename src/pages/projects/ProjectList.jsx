import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ProjectCard from '../../components/ProjectCard'
import api from '../../api/axios'

const ProjectList = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await api.get('/projects')
            setProjects(response.data)
        } catch (err) {
            console.error('Failed to fetch projects', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!keyword.trim()) {
            fetchProjects()
            return
        }
        try {
            const response = await api.get(
                `/projects/search?keyword=${keyword}`)
            setProjects(response.data)
        } catch (err) {
            console.error('Search failed', err)
        }
    }

    const handleFilter = async (selectedStatus) => {
        setStatus(selectedStatus)
        if (!selectedStatus) {
            fetchProjects()
            return
        }
        try {
            const response = await api.get(
                `/projects/filter?status=${selectedStatus}`)
            setProjects(response.data)
        } catch (err) {
            console.error('Filter failed', err)
        }
    }

    const handleLike = async (projectId) => {
        try {
            await api.post(`/projects/${projectId}/like`)
            fetchProjects()
        } catch (err) {
            console.error('Like failed', err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        All Projects
                    </h1>
                    <button
                        onClick={() => navigate('/projects/create')}
                        className="bg-blue-600 text-white px-4 py-2 
                            rounded-lg text-sm font-medium
                            hover:bg-blue-700 transition">
                        + New Project
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search projects..."
                        className="border border-gray-300 rounded-lg 
                            px-4 py-2 text-sm flex-1 min-w-48
                            focus:outline-none focus:ring-2 
                            focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 
                            rounded-lg text-sm font-medium
                            hover:bg-blue-700 transition">
                        Search
                    </button>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg 
                            px-4 py-2 text-sm
                            focus:outline-none focus:ring-2 
                            focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No projects found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 
                        lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onLike={handleLike}
                                onClick={() => navigate(
                                    `/projects/${project.id}`)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default ProjectList