import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

interface SignInProps {
  auth: Auth;
  isLogged: boolean;
}

export function SignIn({ auth, isLogged }: SignInProps) {
  const navigate = useNavigate();

  const signIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (document.getElementById("Email") as HTMLInputElement).value;
    const password = (document.getElementById("Password") as HTMLInputElement)
      .value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.email + " logged in");
        navigate("/");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  return (
    <>
      <div>
        <Header></Header>
        <h1>Sign In</h1>
        <form onSubmit={signIn}>
          <div className="mb-3">
            <label htmlFor="Email" className="form-label">
              Name
            </label>
            <input type="text" className="form-control" id="Email" />
          </div>
          <div className="mb-3">
            <label htmlFor="Password" className="form-label">
              Description
            </label>
            <input type="password" className="form-control" id="Password" />
          </div>
          <button type="submit">Sign In</button>
          <br />
          <a href="/sign-up">Don't have an account? Sign up</a>
        </form>
      </div>
    </>
  );
}
