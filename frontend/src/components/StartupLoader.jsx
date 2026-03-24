import React, { useEffect, useState } from "react";
import { getAssetUrl } from "../api/API";

const loaderVideo = getAssetUrl("/uploads/Bouncing_Load.mp4");

function StartupLoader() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowFallback(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="startup-loader" aria-label="Loading page" role="status">
      <div className="startup-loader__media-wrap">
        <video
          className="startup-loader__media"
          src={loaderVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setShowFallback(true)}
        />
        {showFallback && (
          <div className="startup-loader__fallback" aria-hidden="true">
            <div className="startup-loader__ring">
              <span className="startup-loader__dot startup-loader__dot--1" />
              <span className="startup-loader__dot startup-loader__dot--2" />
              <span className="startup-loader__dot startup-loader__dot--3" />
            </div>
            <div className="startup-loader__brand">Flaunt</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StartupLoader;
