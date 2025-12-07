import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      try {
        // 1. Create a reference to the user's document in Firestore
        const userDocRef = doc(db, "users", currentUser.uid);

        // 2. Fetch the document
        const docSnap = await getDoc(userDocRef);

        // 3. Check if the document exists and set the data
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError("No user data found in the database.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]); // Re-run this effect if the user changes

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The AuthProvider will automatically handle the redirect to /login
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-6">Welcome, you are now logged in!</p>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {userData && (
        <div className="text-left bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">User Information</h3>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}
