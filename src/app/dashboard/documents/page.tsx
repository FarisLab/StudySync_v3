'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import DisplayPanel from '../../components/DisplayPanel';
import DocumentUpload from '../../components/DocumentUpload';
import DocumentList from '../../components/DocumentList';
import PageTransition from '../../components/PageTransition';

export default function Documents() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Sidebar />
        <DisplayPanel>
          <PageTransition>
            <div className="space-y-8">
              {/* Document Upload Section */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h2 className="text-xl font-semibold text-white/90 mb-4">Upload Documents</h2>
                <DocumentUpload />
              </div>

              {/* Document List Section */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <DocumentList />
              </div>
            </div>
          </PageTransition>
        </DisplayPanel>
      </div>
    </div>
  );
}
