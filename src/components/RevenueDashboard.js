import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa';

// Custom tooltip component with enhanced styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="value">{`$${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const RevenueDashboard = () => {
  const data = [
    { name: '2024', revenue: 250000 },
    { name: '2025', revenue: 350000 },
    { name: '2026', revenue: 500000 },
    { name: '2027', revenue: 750000 },
    { name: '2028', revenue: 1000000 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="revenue-dashboard"
    >
      <div className="dashboard-header">
        <h2>Revenue Projections</h2>
        <div className="header-icon">
          <FaChartLine />
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueDashboard; 