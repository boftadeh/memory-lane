'use client';

import { useState, useRef } from 'react';
import { CubeIcon, ShareIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/context/ToastContext';
import DescriptionModal from './DescriptionModal';

export default function Header() {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("Jae Doe's journey has been a tapestry of curiosity and exploration. From a young age, their inquisitive mind led them through diverse interests. Education shaped their multidisciplinary perspective, while personal experiences added depth and resilience to their story.");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('URL copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy URL to clipboard', 'error');
    }
  };

  const handleEditClick = () => {
    setIsEditingDescription(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSave = (newDescription: string) => {
    setDescription(newDescription);
    showToast('Description updated successfully!');
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
            <div className="dropdown dropdown-end absolute top-4 right-4" ref={dropdownRef}>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <EllipsisVerticalIcon className="h-6 w-6" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                <li>
                  <button onClick={handleEditClick}>
                    Edit Description
                  </button>
                </li>
              </ul>
            </div>

            <p className="text-base-content/70 pr-12">{description}</p>
          </div>
        </div>
      </div>

      <DescriptionModal
        isOpen={isEditingDescription}
        onClose={() => setIsEditingDescription(false)}
        description={description}
        onSave={handleSave}
      />
    </div>
  );
} 