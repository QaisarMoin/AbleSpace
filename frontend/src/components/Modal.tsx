import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg max-w-lg w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
