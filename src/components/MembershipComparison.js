import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaChartLine, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MembershipComparison = () => {
  // Membership growth data
  const membershipGrowthData = [
    { year: 'Year 1', total: 64, upgrades: 24, new: 40 },
    { year: 'Year 2', total: 172, upgrades: 62, new: 110 },
    { year: 'Year 3', total: 244, upgrades: 76, new: 168 },
    { year: 'Year 4', total: 305, upgrades: 90, new: 215 }
  ];

  // Membership breakdown data
  const membershipBreakdownData = {
    year1: { upgrades: 24, newMembers: 40, total: 64 },
    year2: { upgrades: 62, newMembers: 110, total: 172 },
    year3: { upgrades: 76, newMembers: 168, total: 244 },
    year4: { upgrades: 90, newMembers: 215, total: 305 }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <h3 className="text-2xl font-bold text-darkBrown mb-6">Membership Growth Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Year-over-Year Growth</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={membershipGrowthData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" name="Total Members" fill="#0369a1" />
                <Bar dataKey="upgrades" name="Upgrades" fill="#0284c7" />
                <Bar dataKey="new" name="New Members" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-primary-800 mb-4">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Growth</span>
                  <FaArrowUp className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-primary-700">376%</p>
                <p className="text-sm text-gray-500">Year 1 to Year 4</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Upgrade Rate</span>
                  <FaArrowUp className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-primary-700">275%</p>
                <p className="text-sm text-gray-500">Year 1 to Year 4</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Members</span>
                  <FaArrowUp className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-primary-700">438%</p>
                <p className="text-sm text-gray-500">Year 1 to Year 4</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Retention Rate</span>
                  <FaArrowUp className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-primary-700">92%</p>
                <p className="text-sm text-gray-500">Year-over-Year Average</p>
              </div>
            </div>
          </div>

          {/* Growth Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Growth Breakdown</h4>
            <div className="space-y-4">
              {Object.entries(membershipBreakdownData).map(([year, data]) => (
                <div key={year} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-gray-800">{year.replace('year', 'Year ')}</h5>
                    <span className="text-primary-600 font-medium">{data.total} Total</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Upgrades</span>
                        <span className="font-medium">{data.upgrades}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${(data.upgrades / data.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">New Members</span>
                        <span className="font-medium">{data.newMembers}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-primary-400 rounded-full"
                          style={{ width: `${(data.newMembers / data.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipComparison; 