import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const CreateProject = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('OPEN')
    const [maxTeamSize, setMaxTeamSize] = useState(3)
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError(null)
            const response = await api.post('/projects', {
                title,
                description,
                status,
                maxTeamSize,
                tags
            })
            navigate(`/projects/${response.data.id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Create New Project
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 
                        rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm 
                        border border-gray-100 p-6 space-y-5">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium 
                            text-gray-700 mb-1">
                            Project Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. AI Resume Builder"
                            required
                            className="w-full border border-gray-300 
                                rounded-lg px-4 py-2 text-sm
                                focus:outline-none focus:ring-2 
                                focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium 
                            text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your project..."
                            required
                            rows={4}
                            className="w-full border border-gray-300 
                                rounded-lg px-4 py-2 text-sm
                                focus:outline-none focus:ring-2 
                                focus:ring-blue-500"
                        />
                    </div>

                    {/* Status + Team Size */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium 
                                text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border border-gray-300 
                                    rounded-lg px-4 py-2 text-sm
                                    focus:outline-none focus:ring-2 
                                    focus:ring-blue-500">
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium 
                                text-gray-700 mb-1">
                                Max Team Size
                            </label>
                            <input
                                type="number"
                                value={maxTeamSize}
                                onChange={(e) => setMaxTeamSize(
                                    parseInt(e.target.value))}
                                min={1}
                                max={10}
                                className="w-full border border-gray-300 
                                    rounded-lg px-4 py-2 text-sm
                                    focus:outline-none focus:ring-2 
                                    focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium 
                            text-gray-700 mb-1">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addTag()
                                    }
                                }}
                                placeholder="e.g. AI, Web Dev"
                                className="flex-1 border border-gray-300 
                                    rounded-lg px-4 py-2 text-sm
                                    focus:outline-none focus:ring-2 
                                    focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="bg-blue-50 text-blue-600 
                                    px-4 py-2 rounded-lg text-sm
                                    hover:bg-blue-100 transition">
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span key={index}
                                    className="bg-blue-50 text-blue-600 
                                        text-xs px-3 py-1 rounded-full
                                        flex items-center gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-500 
                                            font-bold ml-1">
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white 
                                py-2 rounded-lg font-medium
                                hover:bg-blue-700 transition
                                disabled:opacity-50">
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="flex-1 bg-gray-100 text-gray-600 
                                py-2 rounded-lg font-medium
                                hover:bg-gray-200 transition">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateProject