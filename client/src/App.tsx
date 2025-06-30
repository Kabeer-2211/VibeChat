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
        <UserProvider>
          <FriendProvider>
            <Layout>
              <Router />
            </Layout>
          </FriendProvider>
        </UserProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
};

export default App;
