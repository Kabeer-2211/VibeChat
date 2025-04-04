import { useState } from 'react'

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { LoaderCircle, Camera } from "lucide-react";

import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getAvatarName } from '@/helper/helper';
import { updateProfileSchema } from '@/schemas/updateProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiResponse, User } from '@/types/apiResponse';
import { beginAuthentication, authSuccess, authComplete, authFail } from '@/redux/slices/userSlice';
import { useError } from '@/hooks/useError';
import { updateUserInfo } from '@/services/user';

const ProfileInfo = () => {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const { showError, showMessage } = useError();
    const [avatar, setAvatar] = useState<string>(`${import.meta.env.VITE_BASE_URL}/avatars/${user?.avatar}`)
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: user.username,
            bio: user.bio,
            avatar: null
        },
    });
    async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
        try {
            dispatch(beginAuthentication());
            const formData = new FormData();
            formData.append('username', values.username);
            if (values.bio) {
                formData.append('bio', values.bio);
            }
            if (values.avatar) {
                formData.append('avatar', values.avatar)
            }
            const { data } = await updateUserInfo(formData);
            if (data.success) {
                dispatch(authSuccess(data.user as User));
                showMessage('User updated successfully');
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in signing you up");
            dispatch(authFail());
        } finally {
            dispatch(authComplete());
        }
    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-5 px-10 py-10'>
            <div className='relative group'>
                <Avatar className="w-52 h-52">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className='bg-[#625EF1] text-white w-full h-full flex items-center justify-center text-5xl'>{getAvatarName(user?.username)}</AvatarFallback>
                </Avatar>
                <label htmlFor="avatar" className='absolute top-0 left-0 w-52 h-52 rounded-full group-hover:flex flex-col items-center justify-center text-wrap bg-[#3f4a4c52] text-white font-semibold cursor-pointer hidden'>
                    <Camera />
                    CHANGE PROFILE PHOTO
                    <input type="file" {...form.register("avatar")} accept='image/png, image/jpg, image/jpeg' className='hidden' id='avatar' onChange={(e) => {
                        const files = e.target.files;
                        if (files && files[0]) {
                            const url = URL.createObjectURL(files[0]);
                            setAvatar(url);
                            form.setValue('avatar', files[0]);
                        }
                    }} />
                </label>
                <span className='text-red-600'>{form.formState.errors.avatar?.message}</span>
            </div>
            <div className='w-full'>
                <div className='mb-2'>Username</div>
                <Input {...form.register("username")} placeholder="Enter Full Name" />
                <span className='text-red-600'>{form.formState.errors.username?.message}</span>
            </div>
            <div className='w-full'>
                <div className='mb-2'>Bio</div>
                <Textarea {...form.register("bio")} placeholder="Tell us a little bit about yourself" />
                <span className='text-red-600'>{form.formState.errors.bio?.message}</span>
            </div>
            <Button className='cursor-pointer self-end'>
                {user.isLoading && <LoaderCircle className="animate-spin" />}
                Save Changes
            </Button>
        </form>
    )
}

export default ProfileInfo