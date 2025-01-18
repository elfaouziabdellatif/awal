
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import protectedRouteWhenUserExist from '../utils/protectedWhenUserExist';

const LoginPage = () => {
    
    
    return (
        <div>
        <LoginForm />
        </div>
    );
    }

export default protectedRouteWhenUserExist(LoginPage);