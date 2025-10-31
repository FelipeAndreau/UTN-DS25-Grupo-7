import React from 'react';
import { useToast, ToastType } from '../context/ToastContext';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast: React.FC<{
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}> = ({ id, type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500';
      case 'error':
        return 'bg-red-100 border-red-500';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'info':
        return 'bg-blue-100 border-blue-500';
      default:
        return 'bg-blue-100 border-blue-500';
    }
  };

  return (
    <div className={`flex items-center p-4 mb-4 text-sm border-l-4 rounded-md shadow-md ${getBgColor()}`}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;