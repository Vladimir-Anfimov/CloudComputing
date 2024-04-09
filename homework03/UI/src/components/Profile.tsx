import Header from "./Header";
import UserTable from "./UserTable";
import Images from "./Images";
import { useEffect } from "react";
import { Auth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  isLogged: boolean;
  auth: Auth;
}

function Profile({ isLogged, auth }: ProfileProps) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) {
      console.log("Redirecting to /sign-in");
      navigate("/sign-in");
    }
  }, [isLogged]);

  const userData = {
    email: auth.currentUser?.email,
  };

  return (
    <>
      <Header></Header>
      <h1 className="text-center mt-5" style={{ paddingBottom: "10%" }}>
        Profile
      </h1>
      <UserTable user={userData}></UserTable>
      <h1 className="text-center mt-5" style={{ paddingBottom: "10%" }}>
        Your Contributions
      </h1>
      <Images auth={auth}></Images>
    </>
  );
}

export default Profile;
