import { z } from "zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signup";
import { Button } from "@/components/ui/button";
import { LoginImage } from "@/assets";
import CustomInput from "@/components/form/Input";
import { signup } from "@/services/user.ts";
import { setToken } from "@/utils/user.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.ts";
import {
  beginAuthentication,
  AuthSuccess,
  authFail,
  authComplete,
} from "@/redux/slices/userSlice.ts";
import { User } from "@/types/apiResponse";
import { LoaderCircle } from "lucide-react";

const Signup = () => {
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
      console.log(values);
      dispatch(beginAuthentication());
      const { data } = await signup(values);
      if (data.success) {
        console.log(data);
        dispatch(AuthSuccess(data.user as User));
        setToken(data.token as string);
      }
    } catch (err) {
      console.log(err);
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
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-5">
            Register your Account
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4 m-0">
                <CustomInput
                  control={form.control}
                  label="Profile Pic"
                  name="avatar"
                  type="file"
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
            <Link to="/login" className="text-blue-500 underline">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
