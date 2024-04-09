import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

interface SignUpProps {
  auth: Auth;
  isLogged: boolean;
}

export function SignUp({ auth, isLogged }: SignUpProps) {
  const navigate = useNavigate();

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (document.getElementById("Email") as HTMLInputElement).value;
    const password = (document.getElementById("Password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById("ConfirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.email + " signed up");
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
    <div>
      <Header></Header>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="Email"
            name="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="Password"
            name="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="ConfirmPassword"
            name="password"
          />
        </div>
        <button type="submit">Sign Up</button>
        <br />
        <a href="/sign-in">Already have an account? Sign in</a>
      </form>
    </div>
  );
}
