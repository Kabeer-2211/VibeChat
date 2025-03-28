import { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signup";
import { Button } from "@/components/ui/button";
import { LoginImage, UserImage } from "@/assets";
import CustomInput from "@/components/form/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signup } from "@/services/user.ts";
import { setToken } from "@/utils/user.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.ts";
import {
  beginAuthentication,
  AuthSuccess,
  authFail,
  authComplete,
} from "@/redux/slices/userSlice.ts";
import { ApiResponse, User } from "@/types/apiResponse";
import { LoaderCircle } from "lucide-react";

const Signup = () => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((states) => states.user);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      bio: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      dispatch(beginAuthentication());
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('bio', values.bio || '');
      if (values.avatar) {
        formData.append('avatar', values.avatar);
      }
      const { data } = await signup(formData);
      console.log(values)
      if (data.success) {
        console.log(data);
        toast.success(data.message);
        dispatch(AuthSuccess(data.user as User));
        setToken(data.token as string);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Error in signing you up");
      dispatch(authFail());
    } finally {
      dispatch(authComplete());
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col lg:flex-row align-items-center w-[80vw] lg:h-[80vh] max-w-[1400px] rounded-lg overflow-hidden border">
        <div className="w-full lg:w-2/4 h-full">
          <img
            src={LoginImage}
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full lg:w-2/4 h-full px-10 lg:px-20 flex flex-col justify-center mt-8 lg:mt-0">
          <div className="mx-auto mb-8 w-32 h-4w-32">
            <Avatar className="w-full h-full">
              <AvatarImage src={imagePreview ? imagePreview : UserImage} />
              <AvatarFallback>Invalid Image</AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4 m-0">
                <CustomInput
                  control={form.control}
                  label="Profile Pic"
                  name="avatar"
                  type="file"
                  setImagePreview={setImagePreview}
                />
                <CustomInput
                  control={form.control}
                  label="Name"
                  name="username"
                  placeholder="Enter Full Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 my-3">
                <CustomInput
                  control={form.control}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                />
                <CustomInput
                  control={form.control}
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter Your Password"
                />
              </div>
              <CustomInput
                control={form.control}
                label="Bio"
                name="bio"
                placeholder="Tell us a little bit about yourself"
                isTextarea={true}
              />
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={user.isLoading}
              >
                {user.isLoading && <LoaderCircle className="animate-spin" />}
                Signup
              </Button>
            </form>
          </Form>
          <p className="self-center mt-2">
            Already Have an Account?
            <Link to="/login" className="text-blue-500 underline mx-2">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
