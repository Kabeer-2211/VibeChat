import { BrowserRouter } from "react-router-dom";

import Router from "@/routes";
import Layout from "@/layout";
import ErrorProvider from "@/contexts/ErrorProvider";
import UserProvider from "@/contexts/UserProvider";

const App = () => {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <UserProvider>
          <Layout>
            <Router />
          </Layout>
        </UserProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
};

export default App;
