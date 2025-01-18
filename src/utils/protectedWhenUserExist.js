// src/components/withAuth.js
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const protectedRouteWhenUserExist = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
      // Check if user data exists in Redux or token in localStorage
      const token = localStorage.getItem('token');
      if (userInfo || token) {
        router.push('/home');  // Redirect to login if not authenticated
      }else{
        router.push('/login');
      } 
    }, []);

    // If no userInfo, render null while redirecting
    return !userInfo ? <WrappedComponent {...props} /> : null;
  };
};

export default protectedRouteWhenUserExist;
