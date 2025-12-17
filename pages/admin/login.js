import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login === "abduvoris" && password === "Abduvoris-2006") {
      localStorage.setItem("admin", "true");
      window.location.href = "/admin/dashboard";
    } else {
      alert("Login yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Panel</h2>
      <input placeholder="Login" onChange={e => setLogin(e.target.value)} />
      <input
        placeholder="Parol"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Kirish</button>

      <style jsx>{`
        .login-container {
          width: 300px;
          margin: 100px auto;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          color: white;
          text-align: center;
        }
        input {
          width: 100%;
          margin-top: 10px;
          padding: 10px;
          border-radius: 8px;
          border: none;
        }
        button {
          width: 100%;
          padding: 10px;
          margin-top: 15px;
          background: #4fa3ff;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
        body {
          background: linear-gradient(135deg, #0b1e39, #1f4c73);
        }
      `}</style>
    </div>
  );
}
