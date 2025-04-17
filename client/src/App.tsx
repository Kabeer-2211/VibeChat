import { BrowserRouter } from "react-router-dom";

import Router from "@/routes";
import Layout from "@/layout";
import ErrorProvider from "@/contexts/ErrorProvider";
import UserProvider from "@/contexts/UserProvider";
import FriendProvider from "./contexts/FriendProvider";

const App = () => {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <FriendProvider>
          <UserProvider>
            <Layout>
              <Router />
            </Layout>
          </UserProvider>
        </FriendProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
};

export default App;
