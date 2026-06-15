"use client";

import { useEffect, useRef } from "react";

export function AnimatedMeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Base dark surface */}
      <div className="absolute inset-0 bg-surface-0" />

      {/* Animated blobs */}
      <div
        className="absolute -top-[20%] -start-[10%] h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #C9922A 0%, #8A6118 50%, transparent 70%)",
          animation: "blob1 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[30%] -end-[10%] h-[500px] w-[500px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #8A6118 0%, #C9922A 40%, transparent 70%)",
          animation: "blob2 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-[10%] start-[30%] h-[550px] w-[550px] rounded-full opacity-10 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #E8B84B 0%, #8A6118 50%, transparent 70%)",
          animation: "blob3 26s ease-in-out infinite",
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,146,42,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #0D0D0D 100%)",
        }}
      />

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(80px, -60px) scale(1.15); }
          66% { transform: translate(-40px, 80px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-70px, 80px) scale(1.1); }
          66% { transform: translate(60px, -50px) scale(0.95); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, 60px) scale(1.1); }
          66% { transform: translate(-80px, -40px) scale(0.92); }
        }
      `}</style>
    </div>
  );
}