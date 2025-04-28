import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./component/Body";
import Login from "./component/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Room from "./component/Room";
import Editor from "./component/Editor";

function App() {
  return (
    <div className="App">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              {/* */}
              <Route path="/room" element={<Room/>} />
              <Route path="/editor/:roomId" element = {<Editor/>} />
            </Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
