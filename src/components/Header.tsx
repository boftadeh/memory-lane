'use client';

import { CubeIcon, EllipsisVerticalIcon, PencilIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import DescriptionModal from './DescriptionModal';
import Dropdown from './Dropdown';

const DEFAULT_DESCRIPTION = "Jae Doe's journey has been a tapestry of curiosity and exploration. From a young age, their inquisitive mind led them through diverse interests. Education shaped their multidisciplinary perspective, while personal experiences added depth and resilience to their story.";

export default function Header(): JSX.Element {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const { showToast } = useToast();

  const handleShare = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('URL copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy URL to clipboard', 'error');
    }
  };

  const handleEditClick = (): void => {
    setIsEditingDescription(true);
  };

  const handleSave = (newDescription: string): void => {
    setDescription(newDescription);
    showToast('Description updated successfully!');
  };

  const dropdownOptions = [
    {
      label: 'Edit Description',
      labelIcon: <PencilIcon className="h-6 w-6" aria-hidden="true" />,
      onClick: handleEditClick
    }
  ];

  return (
    <div className="container mx-auto px-4 my-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-12 h-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold">Jae's memory lane</h1>
          </div>
          <button 
            className="btn btn-ghost btn-circle" 
            onClick={handleShare}
            type="button"
            aria-label="Share page"
          >
            <ShareIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body relative">
            <div className="absolute top-4 right-4">
              <Dropdown
                actionIcon={<EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />}
                options={dropdownOptions}
              />
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