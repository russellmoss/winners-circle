import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, ComposedChart, LabelList
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartBar, FaChartLine, FaChartPie, FaExchangeAlt } from 'react-icons/fa';

// Custom tooltip component with enhanced styling
const CustomTooltip = ({ active, payload, label, valuePrefix = '$' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
        <p className="font-semibold text-gray-700">{label}</p>
        <div className="space-y-1 mt-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600">{entry.name}: </span>
              <span className="font-bold ml-1">
                {valuePrefix}{typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
};

// Chart selector button component
const ChartButton = ({ active, icon, label, onClick }) => (
  <button
    className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${
      active 
        ? 'bg-primary-600 text-white' 
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <span className="mr-2">{icon}</span>
    <span>{label}</span>
  </button>
);

// Year selector button component
const YearButton = ({ year, active, onClick }) => (
  <button
    className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
      active 
        ? 'bg-primary-100 text-primary-800 border border-primary-300' 
        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
    }`}
    onClick={() => onClick(year)}
  >
    {year}
  </button>
);

const RevenueDashboard = () => {
  const [activeChart, setActiveChart] = useState('bar');
  const [selectedYears, setSelectedYears] = useState(['Year 1', 'Year 2', 'Year 3', 'Year 4']);
  const [highlightedMetric, setHighlightedMetric] = useState(null);
  
  // Revenue data for different years
  const revenueData = [
    { 
      year: 'Year 1', 
      directMembership: 128000, 
      beyondCredit: 25600, 
      accommodation: 5760,
      total: 159360
    },
    { 
      year: 'Year 2', 
      directMembership: 344000, 
      beyondCredit: 68800, 
      accommodation: 15480,
      total: 428280
    },
    { 
      year: 'Year 3', 
      directMembership: 488000, 
      beyondCredit: 97600, 
      accommodation: 21960,
      total: 607560
    },
    { 
      year: 'Year 4', 
      directMembership: 610000, 
      beyondCredit: 122000, 
      accommodation: 27450,
      total: 759450
    }
  ];
  
  // Filter data based on selected years
  const filteredData = revenueData.filter(item => 
    selectedYears.includes(item.year)
  );
  
  // Pie chart data calculation
  const calculatePieData = (year) => {
    const yearData = revenueData.find(d => d.year === year);
    if (!yearData) return [];
    
    return [
      { name: 'Direct Membership', value: yearData.directMembership },
      { name: 'Beyond Credit', value: yearData.beyondCredit },
      { name: 'Accommodation', value: yearData.accommodation }
    ];
  };
  
  // Colors for the charts
  const COLORS = ['#0369a1', '#0ea5e9', '#7dd3fc', '#38bdf8'];
  
  // Growth calculation (year over year)
  const calculateGrowth = () => {
    return revenueData.map((item, index) => {
      if (index === 0) {
        return {
          year: item.year,
          revenue: item.total,
          growth: 0
        };
      }
      
      const previousYear = revenueData[index - 1];
      const growthRate = ((item.total - previousYear.total) / previousYear.total) * 100;
      
      return {
        year: item.year,
        revenue: item.total,
        growth: growthRate.toFixed(1)
      };
    });
  };
  
  const growthData = calculateGrowth();
  
  // Toggle year selection
  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      // Don't allow deselecting all years
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };
  
  // Format large numbers
  const formatDollar = (value) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Revenue distribution calculation
  const calculateDistribution = (data) => {
    const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
    return data.map(item => ({
      year: item.year,
      percentage: ((item.total / totalRevenue) * 100).toFixed(1)
    }));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-gilda font-bold text-darkBrown mb-4">
          Revenue Dashboard
        </h2>
        <p className="text-gray-600 mb-4">
          Interactive analysis of projected revenue across different years and categories.
        </p>
        
        {/* Chart selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <ChartButton 
            active={activeChart === 'bar'} 
            icon={<FaChartBar />} 
            label="Revenue by Category" 
            onClick={() => setActiveChart('bar')} 
          />
          <ChartButton 
            active={activeChart === 'line'} 
            icon={<FaChartLine />} 
            label="Growth Trend" 
            onClick={() => setActiveChart('line')} 
          />
          <ChartButton 
            active={activeChart === 'pie'} 
            icon={<FaChartPie />} 
            label="Revenue Distribution" 
            onClick={() => setActiveChart('pie')} 
          />
          <ChartButton 
            active={activeChart === 'composed'} 
            icon={<FaExchangeAlt />} 
            label="Comparison View" 
            onClick={() => setActiveChart('composed')} 
          />
        </div>
        
        {/* Year filter */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Year</h3>
          <div className="flex flex-wrap gap-2">
            {revenueData.map(item => (
              <YearButton 
                key={item.year}
                year={item.year}
                active={selectedYears.includes(item.year)}
                onClick={toggleYear}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Chart container */}
      <div className="h-[400px] mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeChart === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="directMembership" 
                    name="Direct Membership" 
                    fill={COLORS[0]} 
                    stackId="a"
                  />
                  <Bar 
                    dataKey="beyondCredit" 
                    name="Beyond Credit" 
                    fill={COLORS[1]} 
                    stackId="a"
                  />
                  <Bar 
                    dataKey="accommodation" 
                    name="Accommodation" 
                    fill={COLORS[2]} 
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {activeChart === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={growthData.filter(item => selectedYears.includes(item.year))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    yAxisId="left" 
                    tickFormatter={(value) => `$${value / 1000}k`} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tickFormatter={(value) => `${value}%`} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Total Revenue"
                    stroke={COLORS[0]}
                    fill={COLORS[0]}
                    fillOpacity={0.3}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone"
                    dataKey="growth"
                    name="Growth Rate"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  >
                    <LabelList dataKey="growth" position="top" formatter={(value) => `${value}%`} />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            )}
            
            {activeChart === 'pie' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {selectedYears.slice(0, 2).map(year => (
                  <div key={year} className="h-full">
                    <h3 className="text-center font-medium text-gray-700 mb-2">{year}</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={calculatePieData(year)}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {calculatePieData(year).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatDollar(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            )}
            
            {activeChart === 'composed' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    name="Total Revenue" 
                    fill="#0369a1" 
                    barSize={40}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="directMembership" 
                    name="Direct Membership" 
                    stroke="#10b981" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beyondCredit" 
                    name="Beyond Credit" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueData.map((data, index) => (
          <motion.div
            key={data.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
              highlightedMetric === data.year 
                ? 'border-primary-600' 
                : 'border-gray-300'
            }`}
            onMouseEnter={() => setHighlightedMetric(data.year)}
            onMouseLeave={() => setHighlightedMetric(null)}
          >
            <h3 className="text-lg font-medium text-gray-700">{data.year}</h3>
            <div className="text-2xl font-bold text-primary-700 mt-1">
              {formatDollar(data.total)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {index > 0 ? (
                <span className={`font-medium ${
                  ((data.total - revenueData[index-1].total) / revenueData[index-1].total) > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {((data.total - revenueData[index-1].total) / revenueData[index-1].total) > 0 ? '+' : ''}
                  {(((data.total - revenueData[index-1].total) / revenueData[index-1].total) * 100).toFixed(1)}%
                </span>
              ) : (
                <span className="font-medium text-primary-600">Baseline</span>
              )}
              {index > 0 && ' vs previous year'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RevenueDashboard; 