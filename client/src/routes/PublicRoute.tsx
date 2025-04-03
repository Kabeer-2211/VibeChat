import React from 'react';

import { Navigate } from 'react-router-dom';

import { getToken } from '@/utils/user'

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const token = getToken();
    if (token) {
        return <Navigate to='/' replace />
    }
    return (
        <>{children}</>
    )
}

export default PublicRoute