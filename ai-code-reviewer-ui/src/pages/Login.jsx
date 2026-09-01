import { ShieldCheck, Code2 } from "lucide-react";
import "../styles/login.css";

const API_URL = "http://localhost:8000";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google/login`;
  };

  return (
    <div className="login-page">
      <div className="login-background" />

      <div className="login-container">
        <div className="login-brand-panel">
          <div className="brand-mark">
            <Code2 size={28} />
          </div>

          <h1>
            AI Code
            <br />
            Reviewer
          </h1>

          <p className="brand-description">
            Intelligent code reviews powered by AI.
            Upload your project, analyze your codebase,
            and get actionable engineering feedback.
          </p>

          <div className="feature-list">
            <div>
              <ShieldCheck size={18} />
              <span>AI-powered code analysis</span>
            </div>

            <div>
              <ShieldCheck size={18} />
              <span>Project-level review</span>
            </div>

            <div>
              <ShieldCheck size={18} />
              <span>Secure Google authentication</span>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-card">
            <span className="eyebrow">WELCOME BACK</span>

            <h2>Sign in to your workspace</h2>

            <p className="login-subtitle">
              Continue to your AI Code Reviewer dashboard.
            </p>

            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleLogin}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.5c2.62 0 4.82-.87 6.43-2.36l-3.14-2.45c-.87.58-1.98.92-3.29.92-2.53 0-4.68-1.71-5.45-4.01H3.31v2.53A9.7 9.7 0 0 0 12 21.5Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.55 13.6A5.83 5.83 0 0 1 6.25 12c0-.55.1-1.09.3-1.6V7.87H3.31A9.7 9.7 0 0 0 2.25 12c0 1.57.38 3.05 1.06 4.13l3.24-2.53Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.39c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.81 3.43 14.62 2.5 12 2.5a9.7 9.7 0 0 0-8.69 5.37l3.24 2.53c.77-2.3 2.92-4.01 5.45-4.01Z"
                />
              </svg>

              Continue with Google
            </button>

            <div className="login-divider">
              <span>SECURE AUTHENTICATION</span>
            </div>

            <p className="security-note">
              Your account is authenticated securely through Google.
              We never store your Google password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}