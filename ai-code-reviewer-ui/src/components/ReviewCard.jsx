export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <h2>AI Review</h2>

      {review ? (
        <pre>{review}</pre>
      ) : (
        <p>No review available. Upload a project to get started.</p>
      )}
    </div>
  );
}