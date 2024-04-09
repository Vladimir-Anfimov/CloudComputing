import Header from "./Header";
import Form from "./Form";
import { Auth } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AddImageProps {
  auth: Auth;
  isLogged: boolean;
}

function AddImage({ isLogged, auth }: AddImageProps) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) {
      console.log("Redirecting to /sign-in");
      navigate("/sign-in");
    }
  }, [isLogged]);

  return (
    <>
      <Header />
      <h1 className="text-center mt-5" style={{ paddingBottom: "10%" }}>
        Add Image
      </h1>
      <Form></Form>
    </>
  );
}
export default AddImage;
