import React from 'react';
import { X } from 'lucide-react';

interface InitialTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: () => void;
  onStartBlank: () => void;
}

const InitialTemplateDialog: React.FC<InitialTemplateDialogProps> = ({
  isOpen,
  onClose,
  onUseTemplate,
  onStartBlank,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold">Begin Your Design</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 pt-0 space-y-4">
          <button
            onClick={onUseTemplate}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Use a Template
          </button>

          <div className="text-center text-gray-500">or</div>

          <button
            onClick={onStartBlank}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Without Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialTemplateDialog;