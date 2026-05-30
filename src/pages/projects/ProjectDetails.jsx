import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const ProjectDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [members, setMembers] = useState([])
    const [requests, setRequests] = useState([])
    const [tasks, setTasks] = useState([])
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('tasks')

    // Task form state
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDesc, setTaskDesc] = useState('')
    const [assignedTo, setAssignedTo] = useState('')

    // Resource form state
    const [resTitle, setResTitle] = useState('')
    const [resUrl, setResUrl] = useState('')
    const [resType, setResType] = useState('GITHUB')

    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAll()
    }, [id])

    const fetchAll = async () => {
        try {
            setLoading(true)
            const [proj, mem, taskRes, resRes] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get(`/teams/members/${id}`),
                api.get(`/tasks/project/${id}`),
                api.get(`/resources/project/${id}`)
            ])
            setProject(proj.data)
            setMembers(mem.data)
            setTasks(taskRes.data)
            setResources(resRes.data)

            // Fetch join requests if owner
            if (proj.data.ownerEmail === user?.email) {
                const reqRes = await api.get(`/teams/requests/${id}`)
                setRequests(reqRes.data)
            }
        } catch (err) {
            console.error('Failed to fetch project details', err)
        } finally {
            setLoading(false)
        }
    }

    const isOwner = project?.ownerEmail === user?.email

    const handleJoin = async () => {
        try {
            await api.post(`/teams/join/${id}`)
            alert('Join request sent!')
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request')
        }
    }

    const handleRespond = async (memberId, decision) => {
        try {
            await api.put(
                `/teams/respond/${memberId}?decision=${decision}`)
            fetchAll()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to respond')
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            await api.post('/tasks', {
                title: taskTitle,
                description: taskDesc,
                projectId: parseInt(id),
                assignedToUserId: assignedTo ? parseInt(assignedTo) : null
            })
            setTaskTitle('')
            setTaskDesc('')
            setAssignedTo('')
            fetchAll()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task')
        }
    }

    const handleUpdateTaskStatus = async (taskId, status) => {
        try {
            await api.put(`/tasks/${taskId}/status`, { status })
            fetchAll()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update task')
        }
    }

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`)
            fetchAll()
        } catch (err) {
            alert('Failed to delete task')
        }
    }

    const handleAddResource = async (e) => {
        e.preventDefault()
        try {
            await api.post('/resources', {
                title: resTitle,
                url: resUrl,
                type: resType,
                projectId: parseInt(id)
            })
            setResTitle('')
            setResUrl('')
            setResType('GITHUB')
            fetchAll()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add resource')
        }
    }

    const handleDeleteResource = async (resourceId) => {
        try {
            await api.delete(`/resources/${resourceId}`)
            fetchAll()
        } catch (err) {
            alert('Failed to delete resource')
        }
    }

    const statusColors = {
        OPEN: 'bg-green-100 text-green-700',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
        COMPLETED: 'bg-blue-100 text-blue-700'
    }

    const taskStatusColors = {
        TODO: 'bg-gray-100 text-gray-600',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
        DONE: 'bg-green-100 text-green-700'
    }

    const resourceIcons = {
        GITHUB: '🐙',
        DRIVE: '📁',
        DOCS: '📄',
        FIGMA: '🎨',
        OTHER: '🔗'
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="text-center py-20 text-gray-400">
                Loading project...
            </div>
        </div>
    )

    if (!project) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="text-center py-20 text-gray-400">
                Project not found
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-sm 
                    border border-gray-100 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold 
                                    text-gray-800">
                                    {project.title}
                                </h1>
                                <span className={`text-xs font-medium 
                                    px-2 py-1 rounded-full 
                                    ${statusColors[project.status]}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-gray-500 mb-4">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags?.map((tag, i) => (
                                    <span key={i}
                                        className="bg-blue-50 text-blue-600 
                                            text-xs px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 
                                text-sm text-gray-400">
                                <span>👤 {project.ownerName}</span>
                                <span>👥 {members.length}/
                                    {project.maxTeamSize} members</span>
                                <span>❤️ {project.likesCount} likes</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                            {!isOwner && (
                                <button
                                    onClick={handleJoin}
                                    className="bg-blue-600 text-white 
                                        px-4 py-2 rounded-lg text-sm
                                        font-medium hover:bg-blue-700 
                                        transition">
                                    Request to Join
                                </button>
                            )}
                            {isOwner && (
                                <button
                                    onClick={() => navigate(
                                        `/projects/${id}/edit`)}
                                    className="bg-gray-100 text-gray-600 
                                        px-4 py-2 rounded-lg text-sm
                                        font-medium hover:bg-gray-200 
                                        transition">
                                    Edit Project
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left — Tabs */}
                    <div className="lg:col-span-2">

                        {/* Tab Buttons */}
                        <div className="flex gap-2 mb-4">
                            {['tasks', 'resources', 'requests'].map(tab => (
                                (tab !== 'requests' || isOwner) && (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg 
                                            text-sm font-medium capitalize
                                            transition ${activeTab === tab
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}>
                                        {tab}
                                        {tab === 'requests' && 
                                            requests.length > 0 && (
                                            <span className="ml-2 bg-red-500 
                                                text-white text-xs px-1.5 
                                                py-0.5 rounded-full">
                                                {requests.length}
                                            </span>
                                        )}
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Tasks Tab */}
                        {activeTab === 'tasks' && (
                            <div className="space-y-4">

                                {/* Create Task Form — owner only */}
                                {isOwner && (
                                    <form onSubmit={handleCreateTask}
                                        className="bg-white rounded-xl 
                                            border border-gray-100 p-4">
                                        <h3 className="font-semibold 
                                            text-gray-700 mb-3">
                                            Add Task
                                        </h3>
                                        {error && (
                                            <p className="text-red-500 
                                                text-sm mb-2">{error}</p>
                                        )}
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={taskTitle}
                                                onChange={(e) => 
                                                    setTaskTitle(e.target.value)}
                                                placeholder="Task title"
                                                required
                                                className="w-full border 
                                                    border-gray-300 rounded-lg 
                                                    px-3 py-2 text-sm
                                                    focus:outline-none 
                                                    focus:ring-2 
                                                    focus:ring-blue-500"
                                            />
                                            <input
                                                type="text"
                                                value={taskDesc}
                                                onChange={(e) => 
                                                    setTaskDesc(e.target.value)}
                                                placeholder="Description (optional)"
                                                className="w-full border 
                                                    border-gray-300 rounded-lg 
                                                    px-3 py-2 text-sm
                                                    focus:outline-none 
                                                    focus:ring-2 
                                                    focus:ring-blue-500"
                                            />
                                            <select
                                                value={assignedTo}
                                                onChange={(e) => 
                                                    setAssignedTo(e.target.value)}
                                                className="w-full border 
                                                    border-gray-300 rounded-lg 
                                                    px-3 py-2 text-sm
                                                    focus:outline-none 
                                                    focus:ring-2 
                                                    focus:ring-blue-500">
                                                <option value="">
                                                    Unassigned
                                                </option>
                                                {members.map(m => (
                                                    <option key={m.id}
                                                        value={m.userId}>
                                                        {m.userName}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="submit"
                                                className="bg-blue-600 
                                                    text-white px-4 py-2 
                                                    rounded-lg text-sm
                                                    hover:bg-blue-700 
                                                    transition">
                                                Add Task
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Task List */}
                                {tasks.length === 0 ? (
                                    <div className="bg-white rounded-xl 
                                        border border-gray-100 p-8 
                                        text-center text-gray-400">
                                        No tasks yet
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task.id}
                                            className="bg-white rounded-xl 
                                                border border-gray-100 p-4">
                                            <div className="flex items-start 
                                                justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium 
                                                        text-gray-800">
                                                        {task.title}
                                                    </h4>
                                                    {task.description && (
                                                        <p className="text-sm 
                                                            text-gray-500 mt-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs 
                                                        text-gray-400 mt-1">
                                                        👤 {task.assignedToName}
                                                    </p>
                                                </div>
                                                <div className="flex items-center 
                                                    gap-2 ml-4">
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) =>
                                                            handleUpdateTaskStatus(
                                                                task.id,
                                                                e.target.value
                                                            )}
                                                        className={`text-xs 
                                                            px-2 py-1 rounded-lg 
                                                            border-0 font-medium
                                                            ${taskStatusColors[task.status]}`}>
                                                        <option value="TODO">
                                                            TODO
                                                        </option>
                                                        <option value="IN_PROGRESS">
                                                            IN PROGRESS
                                                        </option>
                                                        <option value="DONE">
                                                            DONE
                                                        </option>
                                                    </select>
                                                    {isOwner && (
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteTask(
                                                                    task.id)}
                                                            className="text-red-400 
                                                                hover:text-red-600 
                                                                text-xs">
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Resources Tab */}
                        {activeTab === 'resources' && (
                            <div className="space-y-4">

                                {/* Add Resource Form */}
                                {isOwner && (
                                    <form onSubmit={handleAddResource}
                                        className="bg-white rounded-xl 
                                            border border-gray-100 p-4">
                                        <h3 className="font-semibold 
                                            text-gray-700 mb-3">
                                            Add Resource
                                        </h3>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={resTitle}
                                                onChange={(e) =>
                                                    setResTitle(e.target.value)}
                                                placeholder="Resource title"
                                                required
                                                className="w-full border 
                                                    border-gray-300 rounded-lg 
                                                    px-3 py-2 text-sm
                                                    focus:outline-none 
                                                    focus:ring-2 
                                                    focus:ring-blue-500"
                                            />
                                            <input
                                                type="url"
                                                value={resUrl}
                                                onChange={(e) =>
                                                    setResUrl(e.target.value)}
                                                placeholder="https://..."
                                                required
                                                className="w-full border 
                                                    border-gray-300 rounded-lg 
                                                    px-3 py-2 text-sm
                                                    focus:outline-none 
                                                    focus:ring-2 
                                                    focus:ring-blue-500"
                                            />
                                            <select
                                                value={resType}
                                                onChange={(e) =>
                                                    setResType(e.target.value)}
                                                className="w-full border 
                                                    border-gray-300 rounded-lg 
                                                    px-3 py-2 text-sm
                                                    focus:outline-none 
                                                    focus:ring-2 
                                                    focus:ring-blue-500">
                                                <option value="GITHUB">
                                                    GitHub
                                                </option>
                                                <option value="DRIVE">
                                                    Google Drive
                                                </option>
                                                <option value="DOCS">
                                                    Google Docs
                                                </option>
                                                <option value="FIGMA">
                                                    Figma
                                                </option>
                                                <option value="OTHER">
                                                    Other
                                                </option>
                                            </select>
                                            <button type="submit"
                                                className="bg-blue-600 
                                                    text-white px-4 py-2 
                                                    rounded-lg text-sm
                                                    hover:bg-blue-700 
                                                    transition">
                                                Add Resource
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Resource List */}
                                {resources.length === 0 ? (
                                    <div className="bg-white rounded-xl 
                                        border border-gray-100 p-8 
                                        text-center text-gray-400">
                                        No resources yet
                                    </div>
                                ) : (
                                    resources.map(resource => (
                                        <div key={resource.id}
                                            className="bg-white rounded-xl 
                                                border border-gray-100 p-4
                                                flex items-center 
                                                justify-between">
                                            <div className="flex items-center 
                                                gap-3">
                                                <span className="text-2xl">
                                                    {resourceIcons[resource.type]}
                                                </span>
                                                <div>
                                                    <a href={resource.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-medium 
                                                            text-blue-600 
                                                            hover:underline text-sm">
                                                        {resource.title}
                                                    </a>
                                                    <p className="text-xs 
                                                        text-gray-400">
                                                        by {resource.uploadedByName}
                                                    </p>
                                                </div>
                                            </div>
                                            {isOwner && (
                                                <button
                                                    onClick={() =>
                                                        handleDeleteResource(
                                                            resource.id)}
                                                    className="text-red-400 
                                                        hover:text-red-600 
                                                        text-sm">
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Join Requests Tab — owner only */}
                        {activeTab === 'requests' && isOwner && (
                            <div className="space-y-3">
                                {requests.length === 0 ? (
                                    <div className="bg-white rounded-xl 
                                        border border-gray-100 p-8 
                                        text-center text-gray-400">
                                        No pending requests
                                    </div>
                                ) : (
                                    requests.map(req => (
                                        <div key={req.id}
                                            className="bg-white rounded-xl 
                                                border border-gray-100 p-4
                                                flex items-center 
                                                justify-between">
                                            <div>
                                                <p className="font-medium 
                                                    text-gray-800">
                                                    {req.userName}
                                                </p>
                                                <p className="text-sm 
                                                    text-gray-400">
                                                    {req.userEmail}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleRespond(
                                                            req.id, 'ACCEPT')}
                                                    className="bg-green-50 
                                                        text-green-600 px-3 
                                                        py-1 rounded-lg text-sm
                                                        hover:bg-green-100 
                                                        transition">
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRespond(
                                                            req.id, 'REJECT')}
                                                    className="bg-red-50 
                                                        text-red-600 px-3 
                                                        py-1 rounded-lg text-sm
                                                        hover:bg-red-100 
                                                        transition">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right — Team Members */}
                    <div>
                        <div className="bg-white rounded-xl border 
                            border-gray-100 p-4">
                            <h3 className="font-semibold text-gray-700 mb-4">
                                Team Members
                            </h3>
                            {members.length === 0 ? (
                                <p className="text-sm text-gray-400 
                                    text-center py-4">
                                    No members yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {members.map(member => (
                                        <div key={member.id}
                                            className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full 
                                                bg-blue-100 flex items-center 
                                                justify-center text-blue-600 
                                                font-semibold text-sm">
                                                {member.userName
                                                    .charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm 
                                                    font-medium text-gray-700">
                                                    {member.userName}
                                                </p>
                                                <p className="text-xs 
                                                    text-gray-400">
                                                    {member.userEmail}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProjectDetail