import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Render nothing at all when closed, rather than hiding it with CSS.
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* The dark backdrop. Clicking it closes the modal. */}
      <div className='absolute inset-0 bg-ink/40' onClick={onClose} />

      {/* The panel itself sits above the backdrop. */}
      <div className='relative z-10 w-full max-w-md rounded-xl border border-line bg-card p-6'>
        <div className='mb-5 flex items-center justify-between'>
          <h2 className='text-lg font-bold'>{title}</h2>

          <button onClick={onClose} className='text-muted hover:text-ink'>
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
