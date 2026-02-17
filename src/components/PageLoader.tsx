import { useEffect, useState } from "react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Carregando..."
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Logo Container */}
      <div 
        className="flex items-center gap-3"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {/* SVG Logo */}
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 439" className="w-12 h-8">
          <path fill="#263533" d="M55.6,138.8h207.9c39.1,0,71,31.8,71,70.6v11.1H178.1C101.4,220.5,55.6,210.6,55.6,138.8L55.6,138.8z"/>
          <path fill="#00E13C" d="M509.7,203.1c3.5,15.3,5.3,31.7,5.3,49.1c0,35.5-8,67.2-24.2,94.8c-16,27.5-39.7,50.2-70.9,68c-0.6,0.4-1.4,0.8-2,1.2c11.4-1,22.7-2.5,34-4.6c20.9-4.6,40.1-11.9,57.9-22c31.1-17.9,54.9-40.5,70.9-68.1c16.2-27.5,24.2-59.1,24.2-94.7c0-0.5,0-1,0-1.4c-10.1-21.8-24.9-40.7-44-56.8c-25-21.1-55.9-35.5-92.8-43.6c-20.7-4.6-43.3-7.1-67.7-7.5c32.2,2.4,58,11.9,77.4,28.7c10.8,9.4,19,20.2,24.6,32.8C505.8,186.5,508.2,194.5,509.7,203.1L509.7,203.1z"/>
          <path fill="#FFCC00" d="M154.6,245.4h81.7l-1,173.8c-71.8-0.3-81.5-39.9-81.1-106.2L154.6,245.4z"/>
          <path fill="#00EF64" d="M195,336.7c-0.2,0-0.3,0-0.5,0c0,4.3,0.2,8.4,0.5,12.2V336.7z M543.7,86.5C504.9,54,452,37,385.1,35.4c-0.2,0.7-0.4,1.3-0.6,2c7-0.6,14.6,3.8,15.4,13c2.1,24-5.1,48.5-20.1,66.4l3.7,0.1v0.1c40.2,0,71.6,9.8,94.3,29.3c22.7,19.6,34,46.3,34,80.6c0,34.2-11.4,60.8-34,80.3c-22.7,19.4-54.2,29.1-94.3,29.1c-39.8,0-79.7,0.2-119.5,0.3v79c15.5,2.2,33.2,2.9,53.1,2.9c45.7,0,90.5,1.4,134.8-6.7c20.9-4.6,40.1-11.9,57.9-22c31.2-17.9,54.9-40.5,70.9-68.1c16.2-27.5,24.2-59.1,24.2-94.7C604.8,167.5,584.4,120.7,543.7,86.5z"/>
          <path fill="#283533" d="M90.2,112.2l293.1,4.6v0.1c5.8,0,11.4,0.2,16.9,0.6c67.9,1.3,121.4,18.3,160.5,51.2c19.2,16.1,33.9,35,44,56.8c-0.3-58.8-20.7-105.1-61.2-139c-40.7-34.2-97.1-51.2-169-51.2h-11.4l-262.3-4.7H75.5c-52.7,0-54.9,78.6-2.2,81.2C78.7,112,84.4,112.2,90.2,112.2L90.2,112.2z"/>
        </svg>
        
        {/* Brand Name */}
        <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          TchovaDigital
        </span>
      </div>
      
      {/* Minimal loading indicator */}
      <div className="mt-6 w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
          style={{
            animation: 'loadingProgress 1.5s ease-out forwards',
          }}
        />
      </div>
      
      <style>{`
        @keyframes loadingProgress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
