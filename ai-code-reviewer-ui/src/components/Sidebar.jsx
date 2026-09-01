import { useEffect, useState } from "react";
import {
  Activity,
  Clock3,
  Code2,
  FileCode2,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Upload,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();

        if (data.authenticated) {
          setUser(data);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      navigate("/login");
    }
  };

  const links = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/upload",
      label: "Upload Project",
      icon: Upload,
    },
    {
      to: "/review",
      label: "Reviews",
      icon: FileCode2,      
    },
    {
      to: "/history",
      label: "Review History",
      icon: Clock3,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Code2 size={21} />
          </div>

          <div>
            <strong>AI Code</strong>
            <span>Reviewer</span>
          </div>
        </div>

        <div className="sidebar-status">
          <Activity size={14} />
          <span>AI system online</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">WORKSPACE</p>

          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          <p className="nav-label nav-label-spaced">PROJECTS</p>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FolderGit2 size={18} />
            <span>Project Workspace</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">
            <User size={17} />
          </div>

          <div className="user-info">
            <strong>
              {user?.email?.split("@")[0] || "User"}
            </strong>

            <span>{user?.email || "Authenticated user"}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}