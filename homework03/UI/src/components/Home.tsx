import Images from "./Images";
import Header from "./Header";
import { Auth } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  isLogged: boolean;
  auth: Auth;
}

function Home({ isLogged, auth }: HomeProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      console.log("Redirecting to /sign-in");
      navigate("/sign-in");
    }
  }, [isLogged]);

  if (!isLogged || !auth.currentUser) {
    return <div></div>
  }

  return (
    <>
      <Header></Header>
      <h1 className="text-center mt-5" style={{ paddingBottom: "10%" }}>
        Home
      </h1>
      <Images auth={auth}></Images>
    </>
  );
}

export default Home;
