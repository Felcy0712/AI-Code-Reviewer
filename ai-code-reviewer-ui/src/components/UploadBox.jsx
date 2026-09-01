import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileArchive,
} from "lucide-react";

import { uploadProject } from "../services/api";

export default function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".zip")) {
      setError("Please select a ZIP file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a ZIP project.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const data = await uploadProject(formData);

      if (!data.review_id) {
        throw new Error(
          "Upload completed but no review ID was returned."
        );
      }
      
      console.log("Review creation response:", data);
console.log("Review ID:", data.review_id);
console.log(
  "UPLOAD RESPONSE FULL:",
  JSON.stringify(data, null, 2)
);

console.log("Review ID:", data.review_id);


      navigate(`/review/${data.review_id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Project processing failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            PROJECT WORKSPACE
          </span>

          <h1>Upload Project</h1>

          <p>
            Upload your source code as a ZIP file and
            generate an AI-powered review.
          </p>
        </div>
      </div>

      <div className="upload-card">
        <div className="upload-icon">
          <UploadCloud size={28} />
        </div>

        <h2>Upload your codebase</h2>

        <p>
          Select a ZIP file containing your project.
        </p>

        <label className="upload-dropzone">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            hidden
          />

          <FileArchive size={32} />

          <strong>
            {file
              ? file.name
              : "Choose a ZIP project"}
          </strong>

          <span>
            {file
              ? `${(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : "ZIP files only"}
          </span>
        </label>

        {error && (
          <p className="upload-error">
            {error}
          </p>
        )}

        <button
          className="primary-link upload-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : "Upload & Review"}
        </button>
      </div>
    </div>
  );
}