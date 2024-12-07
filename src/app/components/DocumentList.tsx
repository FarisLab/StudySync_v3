import React, { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: 'processing' | 'ready' | 'error';
}

const DocumentList = () => {
  // Mock data for demonstration
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Research Paper.pdf',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2 hours ago',
      status: 'ready',
    },
    {
      id: '2',
      name: 'Study Notes.docx',
      type: 'Word',
      size: '1.1 MB',
      lastModified: '5 hours ago',
      status: 'ready',
    },
    {
      id: '3',
      name: 'Thesis Draft.pdf',
      type: 'PDF',
      size: '5.7 MB',
      lastModified: '1 day ago',
      status: 'processing',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/20 text-green-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleDocumentClick = (doc: Document) => {
    // Handle document selection/preview
    console.log('Selected document:', doc);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white/90">Your Documents</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-colors">
            Sort
          </button>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-colors">
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/10 hover:border-purple-500/50"
            onClick={() => handleDocumentClick(doc)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                {doc.type === 'PDF' ? '📄' : '📝'}
              </div>
              <div>
                <h3 className="text-white/90 font-medium group-hover:text-white">
                  {doc.name}
                </h3>
                <p className="text-white/60 text-sm">
                  {doc.size} • {doc.lastModified}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                  doc.status
                )}`}
              >
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
