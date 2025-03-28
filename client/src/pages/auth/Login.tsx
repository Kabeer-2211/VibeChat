import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/login";
import { Button } from "@/components/ui/button";
import { LoginImage } from "@/assets";
import CustomInput from "@/components/form/Input";

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
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
            Login to your Account
          </h1>
          <p className="leading-7 [&:not(:first-child)]:my-4">
            Share Moments, Not Just Texts
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CustomInput
                control={form.control}
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Your Email"
                hasFormDescription={true}
                formDescription="Your email is not shared with anyone"
              />
              <CustomInput
                control={form.control}
                label="Password"
                name="password"
                type="password"
                placeholder="Enter Your Password"
              />
              <Button type="submit" className="cursor-pointer">
                Login
              </Button>
            </form>
          </Form>
          <p className="self-center mt-5">
            Not Registered Yet?
            <Link to="/signup" className="text-blue-500 underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
