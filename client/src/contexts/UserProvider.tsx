import React, { useEffect } from 'react'

import { AxiosError } from 'axios';

import { userContext } from '@/contexts/UserContext';
import { getUser } from "@/services/user";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { beginAuthentication, authComplete, authFail, authSuccess } from '@/redux/slices/userSlice';
import { ApiResponse, User } from '@/types/apiResponse';
import { useError } from '@/hooks/useError';
import { getToken } from '@/utils/user';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const { showError } = useError();
    const token = getToken();
    useEffect(() => {
        async function getUserData() {
            dispatch(beginAuthentication());
            try {
                const { data } = await getUser();
                if (data.success) {
                    dispatch(authSuccess(data.user as User))
                }
            } catch (err) {
                const axiosError = err as AxiosError<ApiResponse>;
                showError(axiosError.response?.data.message || "Error in signing you up");
                dispatch(authFail());
            } finally {
                dispatch(authComplete());
            }
        }
        if (!user.username && token) {
            getUserData();
        }
    }, [showError, dispatch, user, token])

    return (
        <userContext.Provider value={null}>
            {children}
        </userContext.Provider>
    )
}

export default UserProvider