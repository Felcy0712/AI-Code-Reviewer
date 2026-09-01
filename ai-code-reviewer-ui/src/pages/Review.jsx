import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  LoaderCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";

import { getReview } from "../services/api";

export default function Review() {
  const { reviewId } = useParams();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReview = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReview(reviewId);

        setReview(data);
      }
      catch (err) {
  console.error(err);

  const detail = err.response?.data?.detail;
  let message = "Unable to load review.";

  if (typeof detail === "string") {
    message = detail;
  } else if (Array.isArray(detail)) {
    // FastAPI/Pydantic validation error array
    message = detail
      .map((d) => `${Array.isArray(d.loc) ? d.loc.join(".") : d.loc}: ${d.msg}`)
      .join("; ");
  } else if (detail && typeof detail === "object") {
    message = detail.msg || JSON.stringify(detail);
  }

  setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (reviewId) {
      console.log("Review ID:", reviewId);
    console.log("Review ID type:", typeof reviewId);
      loadReview();
    }
  }, [reviewId]);

  if (loading) {
    return (
      <div className="auth-loading">
        <LoaderCircle
          className="loading-ring"
          size={30}
        />

        <p>Loading AI review...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-page">
        <div className="empty-state">
          <AlertCircle size={30} />

          <h4>Unable to load review</h4>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            AI CODE REVIEW
          </span>

          <h1>
            Review #{review.id}
          </h1>

          <p>
            AI-generated analysis of project{" "}
            {review.project_id}.
          </p>
        </div>

        <div className="review-status">
          <CheckCircle2 size={16} />
          Review completed
        </div>
      </div>

      <section className="review-summary-card">
        <div className="review-summary-icon">
          <Code2 size={22} />
        </div>

        <div>
          <span className="section-eyebrow">
            AI REVIEW RESULT
          </span>

          <h2>Project Review</h2>

          <p>
            Generated on{" "}
            {new Date(
              review.created_at
            ).toLocaleString()}
          </p>
        </div>
      </section>

      <section className="review-findings">
        <div className="section-heading">
          <div>
            <h3>AI Review</h3>

            <p>
              Full review generated from your
              uploaded codebase.
            </p>
          </div>
        </div>

        <article className="finding-card">
          <pre className="review-content">
            {review.review_text}
          </pre>
        </article>
      </section>
    </div>
  );
}