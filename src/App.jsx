import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import SEO from './components/SEO';

const NotFound = () => (
  <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center text-center p-6 font-mono">
    <SEO title="404 Lost in the Void" />
    <h1 className="text-6xl font-black text-purple-600 mb-4 tracking-tighter">404</h1>
    <p className="text-slate-400 mb-8 uppercase tracking-widest text-xs">Signal Lost</p>
    <a href="/" className="px-6 py-3 border border-white/10 hover:bg-white/10 rounded-full transition-all text-xs font-bold uppercase tracking-widest">
      Return to Surface
    </a>
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <SEO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
