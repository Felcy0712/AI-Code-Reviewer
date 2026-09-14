import { useRef, useState } from "react";
import JSZip from "jszip";
import { uploadProject } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [reviewMode, setReviewMode] = useState("project");
  const [sourceFiles, setSourceFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const selectedZip = event.target.files[0];

    setMessage("");
    setError("");
    setSourceFiles([]);
    setSelectedFile("");

    if (!selectedZip) {
      setFile(null);
      return;
    }

    if (!selectedZip.name.toLowerCase().endsWith(".zip")) {
      setError("Please select a ZIP file.");
      setFile(null);
      return;
    }

    setFile(selectedZip);

    try {
      const zip = await JSZip.loadAsync(selectedZip);

      const supportedExtensions = [
        ".py",
        ".cpp",
        ".c",
        ".h",
        ".hpp",
        ".js",
        ".ts",
        ".java",
      ];

      const files = Object.keys(zip.files)
        .filter((fileName) => {
          const isDirectory = zip.files[fileName].dir;

          const isSupported = supportedExtensions.some((extension) =>
            fileName.toLowerCase().endsWith(extension)
          );

          return !isDirectory && isSupported;
        })
        .map((fileName) => {
          const parts = fileName.split("/");
          return parts[parts.length - 1];
        });

      const uniqueFiles = [...new Set(files)];

      setSourceFiles(uniqueFiles);

      if (uniqueFiles.length === 0) {
        setError("No supported source files found in the ZIP.");
      }
    } catch (err) {
      console.error("ZIP reading error:", err);
      setError("Unable to read the ZIP file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a ZIP project first.");
      return;
    }

    if (reviewMode === "file" && !selectedFile) {
      setError("Please select a file to review.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("review_mode", reviewMode);

      if (reviewMode === "file") {
        formData.append("selected_file", selectedFile);
      }

      const data = await uploadProject(formData);

      console.log("UPLOAD RESPONSE:", data);

      setMessage(
        data.message || "Project uploaded successfully."
      );

      navigate(`/review/${data.review_id}`);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please sign in again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Upload failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    } else {
      handleUpload();
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
            Upload a ZIP of your codebase and get a
            structured review of correctness, security,
            performance, and readability.
          </p>
        </div>
      </div>

      <div className="upload-card">

        {/* Review Mode */}

        <div className="review-mode">

          <h3>Review Mode</h3>

          <label>
            <input
              type="radio"
              value="project"
              checked={reviewMode === "project"}
              onChange={() => {
                setReviewMode("project");
                setSelectedFile("");
                setError("");
              }}
            />

            Entire Project
          </label>

          <label>
            <input
              type="radio"
              value="file"
              checked={reviewMode === "file"}
              onChange={() => {
                setReviewMode("file");
                setError("");
              }}
            />

            Single File
          </label>

        </div>

        {/* File Selection */}

        {reviewMode === "file" && file && (
          <div className="file-selector">

            <label htmlFor="source-file">
              Select File
            </label>

            <select
              id="source-file"
              value={selectedFile}
              onChange={(event) =>
                setSelectedFile(event.target.value)
              }
            >
              <option value="">
                Select a source file
              </option>

              {sourceFiles.map((sourceFile) => (
                <option
                  key={sourceFile}
                  value={sourceFile}
                >
                  {sourceFile}
                </option>
              ))}
            </select>

          </div>
        )}

        {/* ZIP Input */}

        <div className="upload-dropzone">

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            hidden
          />

        </div>

        {error && (
          <p className="upload-error">
            {error}
          </p>
        )}

        {message && (
          <p className="upload-success">
            {message}
          </p>
        )}

        <button
          type="button"
          className="primary-link upload-button"
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : file
            ? "Upload & Review"
            : "Upload your codebase"}
        </button>

        {file && (
          <span className="upload-filename">
            {file.name} (
            {(file.size / 1024 / 1024).toFixed(2)}
            MB)
          </span>
        )}

      </div>
    </div>
  );
}