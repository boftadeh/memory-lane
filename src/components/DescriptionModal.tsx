import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal';
import { Description, DescriptionSchema } from '@/schemas/description';

type DescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  onSave: (description: string) => void;
};

export default function DescriptionModal({ isOpen, onClose, description, onSave }: DescriptionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Description>({
    resolver: zodResolver(DescriptionSchema),
    defaultValues: {
      description: description
    }
  });

  const onSubmit = (data: Description) => {
    onSave(data.description);
    onClose();
  };

  const handleClose = () => {
    reset({ description });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Description"
      subTitle="Update the description of your memory lane"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control w-full">
          <textarea
            className="textarea textarea-bordered w-full resize-none h-[120px]"
            placeholder="Enter your description..."
            {...register('description')}
            maxLength={500}
          />
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.description.message}</span>
            </label>
          )}
        </div>
        
        <div className="modal-action">
          <button
            type="button"
            className="btn"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
} 