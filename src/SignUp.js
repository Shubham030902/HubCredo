import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// 1. Import Firebase services
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!validEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // 2. Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 3. Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.toLowerCase(),
        createdAt: serverTimestamp(),
      });

      // 4. Navigate to the dashboard on success
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Log the full error to the console for debugging
      console.error("Firebase SignUp Error:", err);

      // Provide more user-friendly error messages
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email address is already in use.");
          break;
        default:
          setError("Failed to create an account. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
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
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
      <div className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600">
          Log in
        </Link>
      </div>
    </div>
  );
}
