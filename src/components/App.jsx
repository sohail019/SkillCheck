import {
  Suspense,
  lazy,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { StoreContext, initialState, login, connectToWallet } from "../utils";
import Load from "./Load";
import Layout from "./Layout";
import "../styles/App.css";

const Verify = lazy(() => import("../pages/Verify"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Company_Dashboard = lazy(() => import("../pages/Company_Dashboard"));
const User_Dashboard = lazy(() => import("../pages/User_Dashboard"));

const App = () => {
  const [state, setState] = useState(initialState);

  const setCustomState = (...params) => {
    console.log({ setStateParams: params });
    setState(...params);
  };

  return (
    <StoreContext.Provider value={{ state, setState: setCustomState }}>
      <InitComp />
    </StoreContext.Provider>
  );
};

function InitComp() {
  const [isAuthCheck, setIsAuthCheck] = useState(false);
  const ctx = useContext(StoreContext);
  console.log({ ctx });
  // const history = useHistory();
  useEffect(() => {
    connectToWallet(ctx);
  }, []);

  useEffect(() => {
    if (!isAuthCheck && ctx.state.connected) init();
  }, [ctx.state.connected]);

  const init = async (_) => {
    const email = localStorage.getItem("email");
    if (!email) return setIsAuthCheck(true);
    const LoginState = await login(ctx, email);

    if (LoginState) {
      localStorage.setItem("email", email);
    }
    setIsAuthCheck(true);
  };
  return (
    <>
      {isAuthCheck && (
        <Router>
          <Layout>
            <Suspense fallback={Load}>
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route
                  exact
                  path="/company/:id"
                  component={Company_Dashboard}
                />
                <Route exact path="/user/:id" component={User_Dashboard} />
                <Route exact path="/verify" component={Verify} />
              </Switch>
            </Suspense>
          </Layout>
        </Router>
      )}
    </>
  );
}

export default App;
