// pages/index.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import './../styles/globals.css';
export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login');  // Redirect to login
    }, []);

    return null;  // Or a loading spinner while redirecting
}
