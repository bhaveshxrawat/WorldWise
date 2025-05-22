import { FormEvent, useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const [error, setError] = useState(false);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) return;
    const validation = login(email, password);
    if (validation) navigate("/app", { replace: true });
    else setError(true);
  }
  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {error && (
          <span
            style={{ fontSize: "1.5rem", color: "#ff9898", fontWeight: 600 }}
          >
            Email or Password is incorrect.
          </span>
        )}
        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
