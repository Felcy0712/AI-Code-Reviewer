import { useEffect, useState } from "react";
import { getEvaluationDashboard } from "../services/api";

export default function Evaluation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const result =
          await getEvaluationDashboard();

        setData(result);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.detail ||
            "Unable to load evaluation data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, []);


  if (loading) {
    return (
      <div className="evaluation-page">
        <h1>AI Evaluation</h1>
        <p>Loading evaluation metrics...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="evaluation-page">
        <h1>AI Evaluation</h1>

        <p className="upload-error">
          {error}
        </p>
      </div>
    );
  }


  const summary = data?.summary;


  const formatScore = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    return `${(value * 100).toFixed(1)}%`;
  };


  const formatLatency = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    return `${value.toFixed(2)} s`;
  };


  const formatCost = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    return `$${value.toFixed(6)}`;
  };


  return (
    <div className="evaluation-page">

      <div className="page-header">

        <div>

          <span className="eyebrow">
            AI QUALITY
          </span>

          <h1>AI Evaluation</h1>

          <p>
            Monitor the quality, latency, and
            estimated LLM cost of your AI code reviews.
          </p>

        </div>

      </div>


      {/* Quality Metrics */}

      <section>

        <h2>Quality Metrics</h2>

        <div className="evaluation-grid">

          <div className="evaluation-card">
            <span>Correctness</span>
            <strong>
              {formatScore(
                summary.average_correctness
              )}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Relevance</span>
            <strong>
              {formatScore(
                summary.average_relevance
              )}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Completeness</span>
            <strong>
              {formatScore(
                summary.average_completeness
              )}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Severity Accuracy</span>
            <strong>
              {formatScore(
                summary.average_severity_accuracy
              )}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Groundedness</span>
            <strong>
              {formatScore(
                summary.average_groundedness
              )}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Hallucination</span>
            <strong>
              {formatScore(
                summary.average_hallucination
              )}
            </strong>
          </div>

        </div>

      </section>


      {/* Performance */}

      <section>

        <h2>Performance & Cost</h2>

        <div className="evaluation-grid">

          <div className="evaluation-card">
            <span>Total Reviews</span>
            <strong>
              {summary.total_reviews}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Average Latency</span>
            <strong>
              {formatLatency(
                summary.average_latency
              )}
            </strong>
          </div>


          <div className="evaluation-card">
            <span>Total LLM Cost</span>
            <strong>
              {formatCost(
                summary.total_cost
              )}
            </strong>
          </div>

        </div>

      </section>


      {/* Evaluation History */}

      <section>

        <h2>Evaluation History</h2>

        <div className="evaluation-table-wrapper">

          <table className="evaluation-table">

            <thead>

              <tr>
                <th>Review</th>
                <th>Correctness</th>
                <th>Relevance</th>
                <th>Groundedness</th>
                <th>Hallucination</th>
                <th>Latency</th>
                <th>Cost</th>
              </tr>

            </thead>

            <tbody>

              {data.evaluations.map(
                (evaluation) => (

                  <tr
                    key={evaluation.id}
                  >

                    <td>
                      #{evaluation.review_id}
                    </td>

                    <td>
                      {formatScore(
                        evaluation.correctness
                      )}
                    </td>

                    <td>
                      {formatScore(
                        evaluation.relevance
                      )}
                    </td>

                    <td>
                      {formatScore(
                        evaluation.groundedness
                      )}
                    </td>

                    <td>
                      {formatScore(
                        evaluation.hallucination
                      )}
                    </td>

                    <td>
                      {formatLatency(
                        evaluation.latency
                      )}
                    </td>

                    <td>
                      {formatCost(
                        evaluation.cost
                      )}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}