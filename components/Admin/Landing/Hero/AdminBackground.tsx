import React from "react";

const AdminBackground: React.FC = () => {
  return (
    <>
      {/* Animated gradient background */}
      <div className="absolute top-0 right-0 w-full h-full z-0 opacity-15 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[15%] right-[15%] w-[55%] h-[65%] rounded-full dark:bg-gradient-to-br dark:from-indigo-600/10 dark:via-pink-500/5 dark:to-violet-600/5 bg-gradient-to-br from-indigo-600/8 via-pink-500/4 to-violet-600/5 blur-3xl"
          style={{
            animation: "pulse-slow 20s ease-in-out infinite alternate",
            transformOrigin: "center"
          }}
        />
      </div>

      {/* Very subtle grid */}
      <div className="absolute inset-0 dark:bg-grid-slate-900/[0.01] bg-grid-slate-700/[0.01] bg-[size:60px_60px] mix-blend-overlay opacity-10"></div>

      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.05),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.03),transparent_50%)]"></div>

      {/* Decorative elements - subtle orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-indigo-100/10 to-pink-100/5 dark:from-indigo-900/5 dark:to-pink-900/5 blur-2xl opacity-30 animate-blob"></div>
      </div>

      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-pink-100/10 to-violet-100/5 dark:from-pink-900/5 dark:to-violet-900/5 blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="absolute top-3/4 right-1/4 w-72 h-72 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-blue-100/10 to-indigo-100/5 dark:from-blue-900/5 dark:to-indigo-900/5 blur-2xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      {/* Additional floating particles for enhanced depth */}
      <div className="absolute top-1/2 left-1/5 w-32 h-32 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-violet-100/8 to-cyan-100/4 dark:from-violet-900/4 dark:to-cyan-900/2 blur-xl opacity-40 animate-blob animation-delay-6000"></div>
      </div>

      <div className="absolute bottom-1/3 left-3/4 w-48 h-48 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-bl from-emerald-100/6 to-blue-100/3 dark:from-emerald-900/3 dark:to-blue-900/2 blur-xl opacity-35 animate-blob animation-delay-8000"></div>
      </div>

      {/* Style for the animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0, 0);
          }
          33% {
            transform: scale(1.05) translate(20px, -10px);
          }
          66% {
            transform: scale(0.95) translate(-10px, 20px);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.01);
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.005);
          }
        }
        
        .animate-blob {
          animation: blob 25s ease-in-out infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animation-delay-8000 {
          animation-delay: 8s;
        }
      `}</style>
    </>
  );
};

export default AdminBackground;