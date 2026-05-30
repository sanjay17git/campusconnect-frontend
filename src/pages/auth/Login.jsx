import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError(null)
            const response = await api.post('/auth/login', {
                email,
                password
            })
            login(response.data, response.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">
                        CampusConnect
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Sign in to your account
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 
                        rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium 
                            text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full border border-gray-300 
                                rounded-lg px-4 py-2 text-sm
                                focus:outline-none focus:ring-2 
                                focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium 
                            text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full border border-gray-300 
                                rounded-lg px-4 py-2 text-sm
                                focus:outline-none focus:ring-2 
                                focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white 
                            py-2 rounded-lg font-medium
                            hover:bg-blue-700 transition
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Register here
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login