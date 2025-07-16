import React from "react";

const Login = () => {
  // Replace with your real login logic
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">
        Login
      </button>
    </div>
  );
};

export default Login;