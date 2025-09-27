'use client';

import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';

export default function ResumeDownload({ className = '', variant = 'button' }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Method 1: Direct file download (if you have a static PDF file)
      const link = document.createElement('a');
      link.href = '/resume/Mosiur-Resume.pdf'; // Place your PDF in public/resume/
      link.download = 'Mosiur-Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: Track download analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'resume_download', {
          event_category: 'engagement',
          event_label: 'resume_pdf',
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Sorry, there was an error downloading the resume. Please try again.');
    } finally {
      setTimeout(() => setIsDownloading(false), 1000); // Reset after 1 second
    }
  };

  // Generate resume dynamically (alternative approach)
  const handleGenerateAndDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to generate resume');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Mosiur-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Sorry, there was an error generating the resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (variant === 'link') {
    return (
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 disabled:opacity-50 ${className}`}>
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <span>
              <DownloadIcon />
            </span>
            <span>Download Resume</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:hover:scale-100 disabled:opacity-50 flex items-center space-x-2 ${className}`}>
      {isDownloading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <span>
            <DownloadIcon size={20} />
          </span>
          <span>Download Resume</span>
        </>
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}
