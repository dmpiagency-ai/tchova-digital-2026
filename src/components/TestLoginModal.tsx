import React, { useState } from 'react';

const TestLoginModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log('Test button clicked');
    setIsOpen(true);
  };

  return (
    <div>
      <div className="text-center py-8 bg-yellow-50 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">Test Section</h3>
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          Test: Open Simple Modal
        </button>
        <p className="mt-2 text-sm text-yellow-600">
          Modal State: {isOpen ? 'Open' : 'Closed'}
        </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Modal</h2>
            <p className="text-gray-600 mb-6">This is a simple test modal</p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestLoginModal;
