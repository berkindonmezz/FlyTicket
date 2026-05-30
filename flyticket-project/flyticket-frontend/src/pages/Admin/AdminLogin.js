import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api'; 

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await API.post('/admin/login', credentials);

            localStorage.setItem('token', res.data.token);

            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Login error:", err);
            setError('Invalid username or password!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border-t-4 border-blue-600">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800">Admin Login</h2>
                    <p className="text-gray-500 mt-2 text-sm">Enter your credentials to sign in.</p>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-2 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition font-black text-lg disabled:bg-gray-400"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 hover:underline transition">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
        
    );
}