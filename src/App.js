import Register from "./components/Register";
import Products from "./components/Products";

import Login from "./components/Login";
import { Switch, Route } from "react-router-dom";

import ipConfig from "./ipConfig.json";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/thanks">
          <Thanks />
        </Route>
        <Route path="/">
          <Products />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
