import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 
                flex items-center justify-between">

                {/* Logo */}
                <Link to="/dashboard"
                    className="text-xl font-bold text-blue-600">
                    CampusConnect
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    <Link to="/projects"
                        className="text-sm text-gray-600 
                            hover:text-blue-600 font-medium">
                        Projects
                    </Link>
                    <Link to="/my-tasks"
                        className="text-sm text-gray-600 
                            hover:text-blue-600 font-medium">
                        My Tasks
                    </Link>
                    <Link to="/projects/create"
                        className="text-sm bg-blue-600 text-white 
                            px-4 py-1.5 rounded-lg
                            hover:bg-blue-700 transition font-medium">
                        + New Project
                    </Link>
                </div>

                {/* User Info + Logout */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        👋 {user?.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 
                            hover:text-red-700 font-medium">
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    )
}

export default Navbar