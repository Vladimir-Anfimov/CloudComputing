import { Auth, signOut } from "firebase/auth";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
  auth: Auth;
}

function Logout({ auth }: LogoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
        navigate("/sign-in");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div>
      <Header></Header>
      <h1>Are you sure?</h1>
      <button type="button" onClick={handleLogout}>
        Yes
      </button>
      <button type="button" onClick={() => navigate("/")}>
        No
      </button>
    </div>
  );
}

export default Logout;
