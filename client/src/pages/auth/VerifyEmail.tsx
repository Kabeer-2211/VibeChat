import { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoginImage } from "@/assets";
import { verifyEmailSchema } from "@/schemas/verifyEmail";
import { verifyEmail } from "@/services/user.ts";
import { setToken } from "@/utils/user.ts";
import { ApiResponse } from "@/types/apiResponse";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verifyCode: "",
    },
  });
  async function onSubmit(values: z.infer<typeof verifyEmailSchema>) {
    try {
      setIsLoading(true);
      const { data } = await verifyEmail(id || "", values.verifyCode);
      if (data.success) {
        setToken(data.token as string);
        window.location.href = "/";
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Error in verifying you"
      );
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
              >
                {isLoading && <LoaderCircle className="animate-spin" />}
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
