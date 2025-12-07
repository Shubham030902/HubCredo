import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// 1. Import Firebase services
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }

    try {
      setLoading(true);
      // 2. Sign in user with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // 3. Navigate to the dashboard on success
      // Firebase automatically handles the session, so no need for localStorage
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Failed to log in. Please check your email and password."); // Provide a user-friendly error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="mt-4 text-sm">
        New here?{" "}
        <Link to="/signup" className="text-indigo-600">
          Create an account
        </Link>
      </div>
    </div>
  );
}
