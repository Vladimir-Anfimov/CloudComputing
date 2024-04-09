import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <header className="d-flex justify-content-end">
        <Link className="header-link me-3" to="/">
          Home
        </Link>
        <Link className="header-link me-3" to="/profile">
          Profile
        </Link>
        <Link className="header-link me-3" to="/add-image">
          Add image
        </Link>
        <Link className="header-link me-3" to="/sign-in">
          Sign in
        </Link>
        <Link className="header-link me-3" to="/sign-up">
          Sign up
        </Link>
        <Link className="header-link me-3" to="/logout">
          Logout
        </Link>
      </header>
    </>
  );
}

export default Header;
