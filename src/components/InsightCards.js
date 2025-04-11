import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaUsers, FaDollarSign, FaTrophy } from 'react-icons/fa';

const InsightCard = ({ icon, title, value, description, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      onClick={toggleExpand}
    >
      <div className="p-6 cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="text-darkBrown text-3xl mb-4">{icon}</div>
          <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
            Tap for details
          </div>
        </div>
        
        <h3 className="font-gilda text-xl font-semibold text-darkBrown mb-2">{title}</h3>
        <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
          {value}
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2 text-darkBrown">Impact Details</h4>
              <ul className="space-y-2">
                {details.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InsightCards = () => {
  const insights = [
    {
      icon: <FaChartLine />,
      title: "Annual Club Revenue",
      value: "37%",
      description: "Increase in annual revenue",
      details: [
        "Year 1 revenue of $159,360",
        "Projected to grow to $759,450 by Year 4",
        "Represents 37% addition to current club revenue"
      ]
    },
    {
      icon: <FaUsers />,
      title: "Member Lifetime Value",
      value: "316%",
      description: "Increase in lifetime value",
      details: [
        "Traditional club member value: $1,920",
        "Winner's Circle member value: $8,000",
        "Substantially improved retention metrics"
      ]
    },
    {
      icon: <FaDollarSign />,
      title: "Payback Period",
      value: "28 Months",
      description: "Return on initial investment",
      details: [
        "Initial investment: $375,000",
        "Annual operating costs: $187,500",
        "Positive cash flow beginning in Year 2"
      ]
    },
    {
      icon: <FaTrophy />,
      title: "Market Positioning",
      value: "Premium",
      description: "Competitive differentiation",
      details: [
        "Unique offering in Hudson Valley region",
        "Creates clear upgrade path for existing members",
        "Enhances overall brand perception"
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {insights.map((insight, index) => (
        <InsightCard 
          key={index}
          icon={insight.icon}
          title={insight.title}
          value={insight.value}
          description={insight.description}
          details={insight.details}
        />
      ))}
    </div>
  );
};

export default InsightCards; 