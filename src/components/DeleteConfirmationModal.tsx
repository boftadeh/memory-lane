import Modal from './Modal';
import { useToast } from '@/context/ToastContext';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  memoryName: string;
  isDeleting: boolean;
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  memoryName,
  isDeleting,
}: DeleteConfirmationModalProps) {
  const { showToast } = useToast();

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      showToast('Failed to delete memory. Please try again.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Memory"
      subTitle={`Are you sure you want to delete "${memoryName}"? This action cannot be undone.`}
    >
      <div className="modal-action">
        <button
          type="button"
          className="btn"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-error"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Deleting...
            </>
          ) : (
            'Delete Memory'
          )}
        </button>
      </div>
    </Modal>
  );
} 