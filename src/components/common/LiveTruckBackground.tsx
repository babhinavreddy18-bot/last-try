import React from 'react';

export const LiveTruckBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {/* Subtle enterprise light gradient background */}
      <div className="absolute inset-0 bg-[#F8FAFC]" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(248, 250, 252, 0) 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(15, 23, 42, 0.05) 0%, rgba(248, 250, 252, 0) 70%)',
        }}
      />
    </div>
  );
};
