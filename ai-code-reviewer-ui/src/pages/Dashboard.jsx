import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  FileCode2,
  FolderGit2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getProjects,
} from "../services/api";


export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, projectsData] =
          await Promise.all([
            getDashboardStats(),
            getProjects(),
          ]);

        setStats(statsData);
        setProjects(projectsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            OVERVIEW
          </span>

          <h1>
            AI Code Reviewer
          </h1>

          <p>
            Analyze your codebase, discover issues,
            and get actionable AI-powered feedback.
          </p>
        </div>

        <div className="status-pill">
          <ShieldCheck size={15} />
          Authentication active
        </div>
      </div>

      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <BrainCircuit size={26} />
          </div>

          <span className="eyebrow">
            AI REVIEW ENGINE
          </span>

          <h2>
            Turn your codebase into
            <br />
            actionable engineering insights.
          </h2>

          <p>
            Upload a ZIP project and let the AI
            analyze the codebase and generate a
            comprehensive engineering review.
          </p>

          <button
            className="primary-link"
            onClick={() => navigate("/upload")}
          >
            Upload a project
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="hero-graphic">
          <div className="code-window">
            <div className="code-window-top">
              <span />
              <span />
              <span />
            </div>

            <div className="code-line muted">
              <span>01</span>
              <span>
                source = project.load()
              </span>
            </div>

            <div className="code-line">
              <span>02</span>
              <span className="highlight">
                context = rag.retrieve()
              </span>
            </div>

            <div className="code-line">
              <span>03</span>
              <span>
                review = ai.analyze(context)
              </span>
            </div>

            <div className="code-line success-line">
              <span>04</span>
              <span>
                ✓ Review pipeline ready
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <FolderGit2 size={19} />
          </div>

          <span>Projects</span>

          <strong>
            {loading ? "—" : stats?.projects ?? 0}
          </strong>

          <small>
            Total uploaded projects
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <FileCode2 size={19} />
          </div>

          <span>Reviews</span>

          <strong>
            {loading ? "—" : stats?.reviews ?? 0}
          </strong>

          <small>
            AI-generated reviews
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck size={19} />
          </div>

          <span>Completed</span>

          <strong>
            {loading
              ? "—"
              : stats?.completed ?? 0}
          </strong>

          <small>
            Successfully reviewed
          </small>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h3>
              Recent projects
            </h3>

            <p>
              Your latest uploaded projects.
            </p>
          </div>
        </div>

        {!loading &&
        recentProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FolderGit2 size={24} />
            </div>

            <h4>
              No projects yet
            </h4>

            <p>
              Upload your first project to begin
              an AI-powered code review.
            </p>
          </div>
        ) : (
          <div className="projects-list">
            {recentProjects.map((project) => {
              const latestReview =
                project.reviews?.[0];

              return (
                <div
                  className="project-row"
                  key={project.id}
                >
                  <div>
                    <strong>
                      {project.name}
                    </strong>

                    <span>
                      {project.filename}
                    </span>
                  </div>

                  <span
                    className={`project-status project-status-${project.status}`}
                  >
                    {project.status}
                  </span>

                  {latestReview && (
                    <button
                      className="project-review-link"
                      onClick={() =>
                        navigate(
                          `/review/${latestReview.id}`
                        )
                      }
                    >
                      View review
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}