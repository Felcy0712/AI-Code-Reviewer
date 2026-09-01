import { useEffect, useState } from "react";
import {
  Clock3,
  FileCode2,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getReviews } from "../services/api";


export default function History() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            REVIEW HISTORY
          </span>

          <h1>
            Reviews
          </h1>

          <p>
            Review history generated from your
            uploaded projects.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="auth-loading">
          <LoaderCircle
            className="loading-ring"
            size={30}
          />

          <p>
            Loading review history...
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <Clock3 size={28} />

          <h4>
            No reviews yet
          </h4>

          <p>
            Upload a project to generate your
            first AI review.
          </p>
        </div>
      ) : (
        <div className="projects-list">
          {reviews.map((review) => (
            <div
              className="project-row"
              key={review.id}
            >
              <div>
                <strong>
                  {review.project_name}
                </strong>

                <span>
                  Review #{review.id}
                  {" • "}
                  {new Date(
                    review.created_at
                  ).toLocaleString()}
                </span>
              </div>

              <FileCode2
                size={18}
                color="#fb923c"
              />

              <button
                className="project-review-link"
                onClick={() =>
                  navigate(
                    `/review/${review.id}`
                  )
                }
              >
                View review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}