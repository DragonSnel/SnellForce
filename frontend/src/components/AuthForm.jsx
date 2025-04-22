// frontend/src/components/AuthForm.jsx
import React, { useState } from "react";
import axios from "axios";

const AuthForm = ({ setUser, setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";

    try {
      const res = await axios.post(`/api/auth/${endpoint}`, { email, password });
      if (res.data.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      alert("Something went wrong: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
        <button onClick={toggleMode}>
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
