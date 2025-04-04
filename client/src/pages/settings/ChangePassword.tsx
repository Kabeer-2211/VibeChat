import { useState } from 'react';

import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AxiosError } from 'axios';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changePassword } from '@/services/user';
import { changePasswordSchema } from '@/schemas/auth/changePassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/hooks/redux';
import { authSuccess } from '@/redux/slices/userSlice';
import { ApiResponse } from '@/types/apiResponse';
import { useError } from '@/hooks/useError';

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { showError, showMessage } = useError();
    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: "",
            new_password: ""
        }
    });
    async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
        setIsLoading(true);
        try {
            const { data } = await changePassword(values);
            if (data.success) {
                if (data.user) {
                    dispatch(authSuccess(data.user));
                }
                showMessage('Password updated successfully');
                form.reset();
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in signing you up");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-5 py-10'>
            <div className='w-full'>
                <div className='mb-2'>Old Password</div>
                <Input {...form.register("password")} type='password' placeholder="Enter Old Password" />
                <span className='text-red-600'>{form.formState.errors.password?.message}</span>
            </div>
            <div className='w-full'>
                <div className='mb-2'>New Password</div>
                <Input {...form.register("new_password")} type='password' placeholder="Enter New Password" />
                <span className='text-red-600'>{form.formState.errors.new_password?.message}</span>
            </div>
            <Button className='cursor-pointer self-end' disabled={isLoading}>
                {isLoading && <LoaderCircle className="animate-spin" />}
                Change Password
            </Button>
        </form>
    )
}

export default ChangePassword