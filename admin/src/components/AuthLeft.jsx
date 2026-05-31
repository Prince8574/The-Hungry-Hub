import { useRef } from "react";

export default function AuthLeft() {
  const leftRef = useRef(null);

  return (
    <div className="auth-left" ref={leftRef}>
      <div className="left-content">
        <span className="left-logo-icon">🍔</span>
        <h1 className="left-logo-text">The Hungry Hub</h1>
        <p className="left-tagline">Admin Control Panel</p>
      </div>
    </div>
  );
}
