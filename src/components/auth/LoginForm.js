import React, { useState } from 'react'; 
import { login } from '../../services/authService';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/userSlice'; 
import { useRouter } from 'next/router';
import { initSocket } from '../../utils/socket'; // Assuming you have a socket utility
import { param } from 'framer-motion/client';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            dispatch(setUserInfo({
                user: response.user,
                token: response.token
            }));
            // Initialize the socket
            const socket = initSocket(response.token);
            socket.connect();
            // Redirect after login
            router.push('/home').then(() => {
                router.reload();
            });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
            <motion.div
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                            required 
                        />
                    </div>
                    <div className="text-center">
                        <motion.button 
                            type="submit" 
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            Login
                        </motion.button>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Don't have an account? <Link href="/register" className="text-blue-600 hover:text-blue-700">Sign up</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginForm;
