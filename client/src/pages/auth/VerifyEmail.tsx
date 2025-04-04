import { z } from "zod";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoginImage } from "@/assets";
import { verifyEmailSchema } from "@/schemas/auth/verifyEmail";
import { verifyEmail } from "@/services/user.ts";
import { ApiResponse } from "@/types/apiResponse";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { useError } from "@/hooks/useError";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.ts";
import {
  beginAuthentication,
  authComplete,
} from "@/redux/slices/userSlice.ts";

const VerifyEmail = () => {
  const dispatch = useAppDispatch();
  const { showError, showMessage } = useError();
  const user = useAppSelector((states) => states.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verifyCode: "",
    },
  });
  async function onSubmit(values: z.infer<typeof verifyEmailSchema>) {
    try {
      dispatch(beginAuthentication());
      const { data } = await verifyEmail(id || "", values.verifyCode);
      if (data.success) {
        dispatch(authComplete());
        showMessage("You can now login to your account");
        navigate('/login');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      showError(axiosError.response?.data.message || "Error in verifying you")
    } finally {
      dispatch(authComplete());
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col lg:flex-row align-items-center w-[80vw] lg:h-[90vh] max-w-[1400px] rounded-lg overflow-hidden border">
        <div className="w-full lg:w-2/4 h-full">
          <img
            src={LoginImage}
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full lg:w-2/4 h-full px-10 lg:px-20 flex flex-col justify-center items-center mt-8 lg:mt-0 bg-slate-100 relative">
          <Alert className="absolute top-5 w-96">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>An Email has been sent to you</AlertDescription>
          </Alert>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mb-7 text-gray-700">
            Verify Your Account
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col items-center"
            >
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem {...field}>
                    <FormControl>
                      <InputOTP maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={user.isLoading}
              >
                {user.isLoading && <LoaderCircle className="animate-spin" />}
                Verify
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
