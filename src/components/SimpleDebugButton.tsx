import React, { useState, useCallback } from 'react';

const SimpleDebugButton: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleReactClick = useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold mb-2">Simple Debug Button</h4>
      <p className="text-sm mb-2">Click count: {clickCount}</p>
      <button
        onClick={handleReactClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Click Me
      </button>
    </div>
  );
};

export default SimpleDebugButton;
