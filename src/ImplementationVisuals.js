import React from 'react';

const ImplementationVisuals = () => {
  return (
    <div className="implementation-visuals">
      <h2 className="section-title">Implementation Timeline</h2>
      
      <div className="timeline-container">
        <div className="timeline-phase">
          <div className="timeline-phase-content">
            <div className="timeline-phase-header">
              <div className="timeline-phase-title">Preparation Phase</div>
              <div className="timeline-phase-period">Months 1-3</div>
            </div>
            <div className="timeline-phase-description">
              Finalize membership structure, develop technology requirements, design physical spaces
            </div>
          </div>
        </div>
        
        <div className="timeline-phase">
          <div className="timeline-phase-content">
            <div className="timeline-phase-header">
              <div className="timeline-phase-title">Soft Launch</div>
              <div className="timeline-phase-period">Months 4-6</div>
            </div>
            <div className="timeline-phase-description">
              Invite select members, complete renovations, launch basic program
            </div>
          </div>
        </div>
        
        <div className="timeline-phase">
          <div className="timeline-phase-content">
            <div className="timeline-phase-header">
              <div className="timeline-phase-title">Full Implementation</div>
              <div className="timeline-phase-period">Months 7-12</div>
            </div>
            <div className="timeline-phase-description">
              Open general enrollment, complete infrastructure, expand staffing
            </div>
          </div>
        </div>
      </div>
      
      <div className="highlights-container">
        <div className="highlights-title">Implementation Highlights</div>
        <div className="highlights-grid">
          <div className="highlight-item">
            <div className="highlight-value">$310K-$440K</div>
            <div className="highlight-label">Total first-year investment</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-value">$187.5K</div>
            <div className="highlight-label">Annual operating costs</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-value">18-20 months</div>
            <div className="highlight-label">Payback period</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-value">Phased</div>
            <div className="highlight-label">Approach to minimize disruption</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationVisuals; 