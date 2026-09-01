import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import "../styles/login.css";
import { loginUser } from "../services/api";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async(event) => {
    event.preventDefault();
          
    if (!email.trim()) {
        setError("Email is required.");
        return;
    }
    if (!email.includes("@")) {
    setError("Please enter a valid email.");
    return;
    }

    if (!password.trim()) {
        setError("Password is required.");
        return;
    }
    
    if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
    }
    setError("");

    // Validation...
    setLoading(true); 

    try {
    const data = await loginUser(email, password);
    console.log(data);
    } 
    catch (error) {
    console.error(error);
    setError("Login failed.");
    }
    finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT PANEL */}

      <div className="login-left">

        <div className="brand">

          <img
            src="/logo.png"
            alt="Logo"
            className="brand-logo"
          />

          <h2>AI Code Reviewer</h2>

        </div>

        <span className="brand-line"></span>

        <h1>
          Intelligent Reviews.
          <br />
          Error free Code.
        </h1>

        <p>
          Get AI-powered code reviews,
          improve code quality,
          and ship better software.
        </p>

      </div>

      {/* RIGHT PANEL */}

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={handleLogin}
        >

          <h1>Welcome Back</h1>

          <p>Sign in to continue</p>

          <label>Email Address</label>

          <div className="input-group">

            <Mail size={18} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <label>Password</label>

          <div className="input-group">

            <Lock size={18} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          <a href="#" className="forgot">
            Forgot Password?
          </a>
          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            disabled={loading}
          >
           {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
}