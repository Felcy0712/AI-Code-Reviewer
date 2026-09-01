import { useRef, useState } from "react";
import { UploadCloud, FileArchive } from "lucide-react";
import { uploadProject } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setMessage("");
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
      setError("Please select a ZIP project first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await uploadProject(formData);
      console.log("UPLOAD RESPONSE:", data);
      setMessage(data.message || "Project uploaded successfully.");
      navigate(`/review/${data.review_id}`);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
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

  // Button click handler: open picker if no file yet, otherwise upload
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
         <span className="eyebrow">PROJECT WORKSPACE</span>

        <h1>Upload Project</h1>

        <p>
          Upload a ZIP of your codebase and
          get a structured review of correctness, security, performance, and readability.
        </p>
        </div>
      </div>

    <div className="upload-card">
      <div className="upload-dropzone">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          hidden
        />

        {/*<FileArchive size={32} />*/}

        {/*<strong>
          {file ? file.name : "Choose a ZIP project"}</strong>*/}

        {/*<span>
          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "No file selected"}
        </span>*/}
      </div>

      {error && (<p className="upload-error"> {error} </p>)}

      {message && (<p className="upload-success">{message} </p>)}

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
        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
      </span>
    )}
    </div>
  </div>
  );
}