import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCalendarAlt, FaCheckCircle, FaSpinner, FaUsers, FaWineGlass, FaTools } from 'react-icons/fa';

const TimelinePhase = ({ phase, index, totalPhases }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="relative"
    >
      {/* Connecting line */}
      {index < totalPhases - 1 && (
        <div className="absolute top-10 left-10 h-full w-0.5 bg-gradient-to-b from-primary-500 to-primary-600 z-0"></div>
      )}
      
      <div className="flex items-start mb-12 relative z-10">
        {/* Timeline node */}
        <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
          phase.status === 'completed' ? 'bg-green-100' : 
          phase.status === 'current' ? 'bg-primary-100' : 'bg-gray-100'
        }`}>
          <span className={`text-2xl ${
            phase.status === 'completed' ? 'text-green-600' : 
            phase.status === 'current' ? 'text-primary-600' : 'text-gray-500'
          }`}>
            {phase.icon}
          </span>
        </div>
        
        {/* Content card */}
        <div className="ml-6 bg-white rounded-xl shadow-md overflow-hidden flex-grow">
          {/* Card header with gradient */}
          <div className={`h-2 ${
            phase.status === 'completed' ? 'bg-green-500' : 
            phase.status === 'current' ? 'bg-primary-500' : 'bg-gray-300'
          }`}></div>
          
          <div className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold font-gilda text-darkBrown">
                {phase.title}
              </h3>
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                {phase.status === 'completed' ? <FaCheckCircle className="text-green-500 mr-2" /> : 
                 phase.status === 'current' ? <FaSpinner className="text-primary-600 mr-2" /> : 
                 <FaCalendarAlt className="text-gray-500 mr-2" />}
                <span className="font-medium">{phase.period}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">{phase.description}</p>
            
            {/* Milestones */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Key Milestones
              </h4>
              <ul className="space-y-2">
                {phase.milestones.map((milestone, i) => (
                  <li key={i} className="flex items-start">
                    <div className={`w-4 h-4 rounded-full mr-3 mt-1 flex-shrink-0 ${
                      phase.status === 'completed' ? 'bg-green-200' : 
                      phase.status === 'current' && i <= 1 ? 'bg-primary-200' : 'bg-gray-200'
                    }`}></div>
                    <span className="text-gray-700">{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Key metric for this phase */}
            {phase.metric && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    {phase.metricIcon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{phase.metricLabel}</p>
                    <p className="text-xl font-bold text-primary-800">{phase.metricValue}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedTimeline = () => {
  const timelineData = [
    {
      title: "Preparation Phase",
      period: "Months 1-3",
      description: "Focus on groundwork and planning for successful implementation.",
      status: "completed",
      icon: <FaTools />,
      milestones: [
        "Finalize membership structure and benefits",
        "Develop technical requirements",
        "Design physical spaces",
        "Create marketing materials"
      ],
      metric: true,
      metricIcon: <FaUsers />,
      metricLabel: "Planning Team",
      metricValue: "6 Cross-functional Members"
    },
    {
      title: "Soft Launch",
      period: "Months 4-6",
      description: "Limited release to select members to test and refine the experience.",
      status: "current",
      icon: <FaWineGlass />,
      milestones: [
        "Complete initial renovations",
        "Invite existing premium members",
        "Train staff on new processes",
        "Begin accepting applications"
      ],
      metric: true,
      metricIcon: <FaUsers />,
      metricLabel: "Initial Members",
      metricValue: "24 Founding Members"
    },
    {
      title: "Full Implementation",
      period: "Months 7-12",
      description: "Scale the program to reach Year 1 membership targets.",
      status: "upcoming",
      icon: <FaCalendarAlt />,
      milestones: [
        "Complete all physical infrastructure",
        "Open general enrollment",
        "Expand staffing",
        "Launch marketing campaign"
      ],
      metric: true,
      metricIcon: <FaUsers />,
      metricLabel: "Year 1 Target",
      metricValue: "64 Total Members"
    }
  ];

  // Animation for the progress bar
  const progressControls = useAnimation();
  const [progressRef, progressInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (progressInView) {
      progressControls.start({
        width: '100%',
        transition: { duration: 1.5, ease: "easeOut" }
      });
    }
  }, [progressControls, progressInView]);

  return (
    <div className="my-12 bg-gray-50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold font-gilda text-center text-darkBrown mb-8">
        Implementation Timeline
      </h2>
      
      {/* Progress tracker */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Progress</span>
          <span className="text-sm font-medium text-primary-600">Phase 2 of 3</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden" ref={progressRef}>
          <motion.div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700"
            initial={{ width: 0 }}
            animate={progressControls}
            style={{ width: "66%" }}
          ></motion.div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="ml-4 pl-4">
        {timelineData.map((phase, index) => (
          <TimelinePhase 
            key={index} 
            phase={phase} 
            index={index} 
            totalPhases={timelineData.length} 
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedTimeline; 