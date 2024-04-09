import "./App.css";
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AddImage from "./components/AddImage";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import Logout from "./components/Logout";

const firebaseConfig = {
  apiKey: "AIzaSyBBVShf8PJWMD9huuu8epM7HpkEKuX62kc",
  authDomain: "tema3-419306.firebaseapp.com",
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in");
        setUser(user);
        user.getIdToken().then((token) => {
          console.log(token);
        });
      } else {
        console.log("Logged out");
        setUser(null);
      }
    });
  });

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/sign-in"
            element={<SignIn isLogged={user !== null} auth={auth} />}
          />
          <Route
            path="/sign-up"
            element={<SignUp isLogged={user !== null} auth={auth} />}
          />
          <Route
            path="/"
            element={<Home isLogged={user !== null} auth={auth}></Home>}
          />
          <Route
            path="/profile"
            element={<Profile isLogged={user !== null} auth={auth}></Profile>}
          />
          <Route
            path="/add-image"
            element={<AddImage isLogged={user !== null} auth={auth}></AddImage>}
          />
          <Route path="/logout" element={<Logout auth={auth}></Logout>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
