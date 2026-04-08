"use client";

import { useState } from 'react';
import { X, PlayCircle, Link } from 'lucide-react';

interface UploadDropzoneProps {
  onSuccess: (videoId: string) => void;
  onClose: () => void;
}

export default function UploadDropzone({ onSuccess, onClose }: UploadDropzoneProps) {
  const [youtubeId, setYoutubeId] = useState('');

  const handleSubmit = () => {
    if (youtubeId.trim()) {
      onSuccess(youtubeId.trim());
    }
  };

  const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const videoId = extractYouTubeID(pastedText);
    if(videoId) {
        setYoutubeId(videoId);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 m-4 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
            <PlayCircle className="w-8 h-8"/>
        </div>

        <h2 className="text-2xl font-bold font-display text-black mb-2">Ajouter une vidéo</h2>
        <p className="text-gray-500 mb-8">Collez le lien de votre vidéo YouTube.</p>

        <div className="space-y-4">
            <div className="relative">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                    type="text"
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="coller le lien ici (ex: youtu.be/...)"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
            </div>
          <button
            onClick={handleSubmit}
            disabled={!youtubeId.trim()}
            className="w-full py-4 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Valider la vidéo
          </button>
        </div>
      </div>
    </div>
  );
}
