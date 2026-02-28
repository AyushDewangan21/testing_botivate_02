"use client";
import React from "react";

export default function MetalAnimatedBackground({
    metal,
}: {
    metal: "gold" | "silver";
}) {
    const isGold = metal === "gold";

    /* Floating square color */
    const boxColor = isGold
        ? "rgba(212,175,55,0.14)"
        : "rgba(180,190,200,0.16)";

    /* PAGE BACKGROUND TINT (VERY LIGHT) */
    const pageTint = isGold
        ? "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.10), transparent 60%)"
        : "radial-gradient(circle at 50% 0%, rgba(170,180,195,0.12), transparent 60%)";

    return (
        <>
            <style jsx global>{`
        .metal-bg-wrapper {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: ${pageTint};
        }

        .metal-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .metal-bg li {
          position: absolute;
          display: block;
          list-style: none;
          width: 25px;
          height: 25px;
          background: ${boxColor};
          animation: floatMetal 22s linear infinite;
          bottom: -150px;
          border-radius: 6px;
          backdrop-filter: blur(2px);
        }

        .metal-bg li:nth-child(1) { left: 86%; width: 80px; height: 80px; }
        .metal-bg li:nth-child(2) { left: 12%; width: 30px; height: 30px; animation-delay: 2s; animation-duration: 14s; }
        .metal-bg li:nth-child(3) { left: 70%; width: 100px; height: 100px; animation-delay: 6s; }
        .metal-bg li:nth-child(4) { left: 42%; width: 150px; height: 150px; animation-duration: 18s; }
        .metal-bg li:nth-child(5) { left: 65%; width: 40px; height: 40px; animation-delay: 1s; }
        .metal-bg li:nth-child(6) { left: 15%; width: 110px; height: 110px; animation-delay: 4s; }

        @keyframes floatMetal {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-900px) rotate(360deg); opacity: 0; }
        }
      `}</style>

            <div className="metal-bg-wrapper">
                <ul className="metal-bg">
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                </ul>
            </div>
        </>
    );
}