import React from 'react';

function ProgressBar({ value }) {
  return (
    <div className="progress-card">
      <div className="progress-header">
        <span>Progress</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
