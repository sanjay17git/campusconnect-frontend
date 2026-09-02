const ProjectCard = ({ project, onLike, onClick }) => {

    const statusColors = {
        OPEN: 'bg-green-100 text-green-700',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
        COMPLETED: 'bg-blue-100 text-blue-700'
    }

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm border 
                border-gray-100 p-6 cursor-pointer
                hover:shadow-md transition">

            {/* Title + Status */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 
                    flex-1 pr-4">
                    {project.title}
                </h3>
                <span className={`text-xs font-medium px-2 py-1 
                    rounded-full ${statusColors[project.status]}`}>
                    {project.status}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {project.description}
            </p>

            {/* Tags */}
            {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                        <span key={index}
                            className="bg-blue-50 text-blue-600 
                                text-xs px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="flex justify-between text-xs 
                    text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${project.completionPercentage}%` }}
                    />
                </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between 
                border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">
                    By {project.ownerName}
                </span>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">
                        👥 {project.maxTeamSize} max
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onLike(project.id)
                        }}
                        className="text-sm text-gray-400 
                            hover:text-red-500 transition">
                        ❤️ {project.likesCount}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ProjectCard