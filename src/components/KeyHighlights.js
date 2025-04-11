import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaDollarSign, FaTrophy, FaCalendarAlt, FaChartPie } from 'react-icons/fa';

const KeyHighlights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <h3 className="text-2xl font-bold text-darkBrown mb-6">Key Strategic Objectives</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaChartLine className="text-primary-600 text-xl" />
            <h4 className="text-lg font-semibold text-gray-800">Revenue Diversification</h4>
          </div>
          <p className="text-gray-600">
            Expand revenue streams beyond wine sales through accommodation, culinary experiences, and merchandise.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaUsers className="text-primary-600 text-xl" />
            <h4 className="text-lg font-semibold text-gray-800">Enhanced Member Experience</h4>
          </div>
          <p className="text-gray-600">
            Create a comprehensive lifestyle experience with exclusive access to facilities and events.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaDollarSign className="text-primary-600 text-xl" />
            <h4 className="text-lg font-semibold text-gray-800">Market Differentiation</h4>
          </div>
          <p className="text-gray-600">
            Establish a unique position in the luxury wine club market with innovative credit-based model.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaTrophy className="text-primary-600 text-xl" />
            <h4 className="text-lg font-semibold text-gray-800">Brand Elevation</h4>
          </div>
          <p className="text-gray-600">
            Strengthen Milea's premium positioning through exclusive membership benefits and experiences.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaCalendarAlt className="text-primary-600 text-xl" />
            <h4 className="text-lg font-semibold text-gray-800">Infrastructure Readiness</h4>
          </div>
          <p className="text-gray-600">
            Develop necessary facilities and systems to support the premium membership experience.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FaChartPie className="text-primary-600 text-xl" />
            <h4 className="text-lg font-semibold text-gray-800">Operational Efficiency</h4>
          </div>
          <p className="text-gray-600">
            Optimize processes and staffing to deliver exceptional service while maintaining profitability.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyHighlights; 