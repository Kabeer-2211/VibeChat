import { BrowserRouter } from "react-router-dom";

import Router from "@/routes";
import Layout from "@/layout";
import ErrorProvider from "./contexts/ErrorProvider";

const App = () => {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <Layout>
          <Router />
        </Layout>
      </ErrorProvider>
    </BrowserRouter>
  );
};

export default App;
