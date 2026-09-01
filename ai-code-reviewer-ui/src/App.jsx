import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Review from "./pages/Review";
import History from "./pages/History";


export default function App() {
  const protectedPage = (page) => (
    <ProtectedRoute>
      <AppLayout>
        {page}
      </AppLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={protectedPage(
          <Dashboard />
        )}
      />

      <Route
        path="/upload"
        element={protectedPage(
          <Upload />
        )}
      />

      <Route
        path="/review/:reviewId"
        element={protectedPage(
          <Review />
        )}
      />

      <Route
        path="/history"
        element={protectedPage(
          <History />
        )}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}