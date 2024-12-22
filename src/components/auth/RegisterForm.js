import { useState } from 'react';
import { register } from '../../services/authService';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
    const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(email, username, password);
      if (response.status === 201 || response.msg === 'User created successfully') {
        router.push('/login');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
      {/* Framer-motion container for flip animation */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}   // Start off-screen with rotation
        animate={{ opacity: 1, rotateY: 0 }}     // Animate to visible with no rotation
        transition={{ duration: 1 }}             // Animation duration of 1 second
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-center mt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }} // Hover effect: slightly enlarges button
              whileTap={{ scale: 0.95 }}   // Tap effect: slightly shrinks button
              transition={{ duration: 0.2 }}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
              Register
            </motion.button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <motion.a 
            href="/login" 
            className="text-blue-500 hover:text-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log in here
          </motion.a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterForm;

