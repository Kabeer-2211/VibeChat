import { BrowserRouter } from "react-router-dom";

import Router from "@/routes";
import Layout from "@/layout";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
