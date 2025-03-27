import { Route, Routes } from "react-router-dom";

import Login from "@/pages/auth/Login";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;
