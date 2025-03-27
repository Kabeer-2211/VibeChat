import { Route, Routes } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default Router;
