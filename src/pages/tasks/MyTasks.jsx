import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const MyTasks = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')

    useEffect(() => {
        fetchMyTasks()
    }, [])

    const fetchMyTasks = async () => {
        try {
            setLoading(true)
            const response = await api.get('/tasks/my')
            setTasks(response.data)
        } catch (err) {
            console.error('Failed to fetch tasks', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (taskId, status) => {
        try {
            await api.put(`/tasks/${taskId}/status`, { status })
            fetchMyTasks()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status')
        }
    }

    const taskStatusColors = {
        TODO: 'bg-gray-100 text-gray-600',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
        DONE: 'bg-green-100 text-green-700'
    }

    const filteredTasks = filter
        ? tasks.filter(t => t.status === filter)
        : tasks

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            My Tasks
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            All tasks assigned to you
                        </p>
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg 
                            px-4 py-2 text-sm
                            focus:outline-none focus:ring-2 
                            focus:ring-blue-500">
                        <option value="">All Tasks</option>
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border 
                        border-gray-100 p-4 text-center">
                        <p className="text-2xl font-bold text-gray-700">
                            {tasks.filter(t => t.status === 'TODO').length}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Todo</p>
                    </div>
                    <div className="bg-white rounded-xl border 
                        border-gray-100 p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {tasks.filter(t =>
                                t.status === 'IN_PROGRESS').length}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            In Progress
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border 
                        border-gray-100 p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {tasks.filter(t => t.status === 'DONE').length}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Done</p>
                    </div>
                </div>

                {/* Task List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">
                        Loading tasks...
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="bg-white rounded-xl border 
                        border-gray-100 p-12 text-center">
                        <p className="text-gray-400 text-lg">
                            No tasks found
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                            Tasks assigned to you will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredTasks.map(task => (
                            <div key={task.id}
                                className="bg-white rounded-xl border 
                                    border-gray-100 p-5">
                                <div className="flex items-start 
                                    justify-between">
                                    <div className="flex-1">

                                        {/* Task Title */}
                                        <h3 className="font-semibold 
                                            text-gray-800">
                                            {task.title}
                                        </h3>

                                        {/* Description */}
                                        {task.description && (
                                            <p className="text-sm 
                                                text-gray-500 mt-1">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Project ID */}
                                        <p className="text-xs text-blue-500 
                                            mt-2">
                                            Project #{task.projectId}
                                        </p>

                                    </div>

                                    {/* Status Dropdown */}
                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            handleUpdateStatus(
                                                task.id,
                                                e.target.value
                                            )}
                                        className={`ml-4 text-xs px-3 py-1.5 
                                            rounded-lg border-0 font-medium
                                            cursor-pointer
                                            ${taskStatusColors[task.status]}`}>
                                        <option value="TODO">TODO</option>
                                        <option value="IN_PROGRESS">
                                            IN PROGRESS
                                        </option>
                                        <option value="DONE">DONE</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default MyTasks