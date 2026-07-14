import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className='text-sm text-muted'>{message}</p>

      <div className='mt-6 flex gap-3'>
        <Button variant='ghost' fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button variant='danger' fullWidth loading={loading} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
