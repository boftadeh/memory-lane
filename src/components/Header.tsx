'use client';

import { useState } from 'react';
import { CubeIcon, ShareIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/context/ToastContext';

export default function Header() {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("Jae Doe's journey has been a tapestry of curiosity and exploration. From a young age, their inquisitive mind led them through diverse interests. Education shaped their multidisciplinary perspective, while personal experiences added depth and resilience to their story.");
  const { showToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('URL copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy URL to clipboard', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 my-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Jae's memory lane</h1>
          </div>
          <button className="btn btn-ghost btn-circle" onClick={handleShare}>
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body relative">
            <div className="dropdown dropdown-end absolute top-4 right-4">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <EllipsisVerticalIcon className="h-6 w-6" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                <li>
                  <button onClick={() => setIsEditingDescription(true)}>
                    Edit Description
                  </button>
                </li>
              </ul>
            </div>

            {isEditingDescription ? (
              <div className="flex gap-2 pr-12">
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsEditingDescription(false)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setIsEditingDescription(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base-content/70 pr-12">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 