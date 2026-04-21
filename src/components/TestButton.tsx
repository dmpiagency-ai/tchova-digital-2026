import React, { useEffect, useRef } from 'react';

interface TestButtonProps {
  label: string;
  onClick: () => void;
}

const TestButton: React.FC<TestButtonProps> = ({ label, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = () => {
      console.log('TestButton clicked');
      onClick();
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener('click', handleClick);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleClick);
      }
    };
  }, [onClick]);

  return (
    <button
      ref={buttonRef}
      className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
    >
      {label}
    </button>
  );
};

export default TestButton;
