import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./User.module.css";

function User() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      <img src={authUser?.avatar} alt={authUser?.name} />
      <span>Welcome, {authUser?.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
