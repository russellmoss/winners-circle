import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line, CartesianGrid } from 'recharts';
import { FaChartLine, FaUsers, FaDollarSign, FaTrophy, FaCalendarAlt, FaChartPie, FaLightbulb, FaChevronDown, FaWineGlass, FaTools, FaList, FaDownload } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import ImplementationVisuals from './ImplementationVisuals';
import './App.css';
import './styles/Dashboard.css';
import InsightCards from './components/InsightCards';
import AnimatedTimeline from './components/AnimatedTimeline';
import RevenueDashboard from './components/RevenueDashboard';
import MembershipComparison from './components/MembershipComparison';
import KeyHighlights from './components/KeyHighlights';
import { ProtectedRoute, LoadingOverlay, SectionTransition } from './components/Transitions';
import ModernNavbar, { navSections } from './components/ModernNavbar';
import WinnersCircleSummary from './components/WinnersCircleSummary';

// Navigation button component
const NavButton = ({ section, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(section)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-primary-100 text-primary-700 font-medium' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

// Mobile jump menu component
const MobileJumpMenu = ({ sections, activeSection, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg"
      >
        <FaList />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            {sections.map(section => (
              <button
                key={section.id}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                  activeSection === section.id ? 'bg-primary-50 text-primary-700' : ''
                }`}
                onClick={() => {
                  onSelect(section.id);
                  setIsOpen(false);
                }}
              >
                {section.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Download Report component
const DownloadReport = () => {
  const handleDownload = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = '/Winners_Circle_Analysis.pdf';
    link.download = 'Winners_Circle_Analysis.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-lg text-gray-700 mb-4">
        To read a comprehensive report, click the button below to download the report
      </p>
      <motion.button
        onClick={handleDownload}
        className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaDownload className="text-xl" />
        <span>Download Report</span>
      </motion.button>
    </motion.div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mainRef = useRef(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation sections
  const sections = [
    { id: 'executive-summary', label: 'Executive Summary', icon: <FaChartLine /> },
    { id: 'business-model', label: 'Business Model', icon: <FaDollarSign /> },
    { id: 'strategic', label: 'Strategic Impact', icon: <FaTrophy /> }
  ];

  // Data for lifetime value comparison
  const lifetimeValueData = [
    { name: 'Traditional Wine Club', value: 1920 },
    { name: 'Winner\'s Circle Club', value: 8000 }
  ];

  // Data for projected revenue growth
  const revenueGrowthData = [
    { year: 'Year 1', revenue: 192000 },
    { year: 'Year 2', revenue: 515200 },
    { year: 'Year 3', revenue: 731240 },
    { year: 'Year 4', revenue: 913050 }
  ];

  // Data for implementation costs
  const implementationCostsData = [
    { name: 'Physical Infrastructure', value: 175000 },
    { name: 'Technology Systems', value: 62500 },
    { name: 'Shared Club Manager', value: 85000 },
    { name: 'Operations', value: 87500 }
  ];

  // Data for revenue breakdown by source
  const revenueBreakdownData = [
    { year: 1, directMembership: 128000, beyondCredit: 25600, accommodation: 5760 },
    { year: 2, directMembership: 344000, beyondCredit: 68800, accommodation: 15480 },
    { year: 3, directMembership: 488000, beyondCredit: 97600, accommodation: 21960 },
    { year: 4, directMembership: 610000, beyondCredit: 122000, accommodation: 27450 }
  ];

  // Data for membership growth
  const membershipGrowthData = [
    { year: 0, total: 0, upgrades: 0, new: 0 },
    { year: 1, total: 64, upgrades: 24, new: 40 },
    { year: 2, total: 172, upgrades: 62, new: 110 },
    { year: 3, total: 244, upgrades: 76, new: 168 },
    { year: 4, total: 305, upgrades: 90, new: 215 }
  ];

  // Data for membership breakdown
  const membershipBreakdownData = {
    year1: {
      upgrades: 24,
      newMembers: 40,
      total: 64
    },
    year2: {
      upgrades: 62,
      newMembers: 110,
      total: 172
    },
    year3: {
      upgrades: 76,
      newMembers: 168,
      total: 244
    },
    year4: {
      upgrades: 90,
      newMembers: 215,
      total: 305
    }
  };

  // Colors for the pie chart
  const COLORS = ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Scroll progress handler
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);

      // Check if scrolled for nav styling
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
          currentSection = sectionId;
        }
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-toggle')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Add this function to toggle section collapse
  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    closeMobileMenu();
  };

  // Add loading state for data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate data fetching
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <LoadingOverlay isLoading={isLoading} />
      
      <ModernNavbar 
        activeSection={activeSection}
        sections={sections}
        onNavClick={handleNavClick}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>
      
      <main className="main-content">
        <section id="executive-summary" className="mb-16">
          <SectionTransition>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-gilda font-bold text-darkBrown mb-6">Executive Summary</h2>
              <div className="prose max-w-none">
                <div className="mb-4 md:mb-8 pt-2 md:pt-4">
                  <p className="text-gray-700 mb-4">
                    The Winner's Circle Club represents Milea Estate Vineyard's ultra-premium membership tier, designed to transform the traditional wine club experience into a comprehensive lifestyle proposition.
                  </p>
                  <DownloadReport />
                  <h3 className="text-2xl font-gilda font-bold text-darkBrown mt-8 mb-4">Core Concept</h3>
                  <p className="text-gray-700 mb-4">
                    The Winner's Circle operates on a flexible credit-based model rather than a traditional wine allocation system. Members pay $500 quarterly ($2,000 annually), which is converted to an equivalent credit balance that can be used across the entire Milea ecosystem.
                  </p>
                </div>
              </div>
              <WinnersCircleSummary />
            </div>
          </SectionTransition>
        </section>
        
        <SectionTransition>
          <section id="business-model" className="section-card">
            <div className="section-header" onClick={() => toggleSection('business-model')}>
              <h2 className="text-3xl font-bold font-gilda text-darkBrown">Business Model</h2>
              <button className="section-toggle" aria-label="Toggle section">
                <FaChevronDown className={collapsedSections['business-model'] ? 'collapsed' : ''} />
              </button>
            </div>
            <div className={`section-content ${collapsedSections['business-model'] ? 'collapsed' : ''}`}>
              <MembershipComparison />
              <RevenueDashboard />
            </div>
          </section>
        </SectionTransition>
        
        <SectionTransition>
          <section id="strategic" className="section-card">
            <div className="section-header" onClick={() => toggleSection('strategic')}>
              <h2 className="text-3xl font-bold font-gilda text-darkBrown">Strategic Impact</h2>
              <button className="section-toggle" aria-label="Toggle section">
                <FaChevronDown className={collapsedSections['strategic'] ? 'collapsed' : ''} />
              </button>
            </div>
            <div className={`section-content ${collapsedSections['strategic'] ? 'collapsed' : ''}`}>
              <KeyHighlights />
            </div>
          </section>
        </SectionTransition>
      </main>
    </div>
  );
};

// Main App component with routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;