import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { FaChartLine, FaDollarSign, FaTrophy, FaDownload } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import './App.css';
import './styles/Dashboard.css';
import RevenueDashboard from './components/RevenueDashboard';
import MembershipComparison from './components/MembershipComparison';
import KeyHighlights from './components/KeyHighlights';
import { ProtectedRoute, LoadingOverlay, SectionTransition } from './components/Transitions';
import ModernNavbar from './components/ModernNavbar';
import WinnersCircleSummary from './components/WinnersCircleSummary';

// Define action types
const SET_ACTIVE_SECTION = 'SET_ACTIVE_SECTION';
const SET_LOADING = 'SET_LOADING';
const SET_SCROLL_TOP = 'SET_SCROLL_TOP';
const SET_MOBILE_MENU = 'SET_MOBILE_MENU';

// Initial state
const initialState = {
  activeSection: 'executive-summary',
  isLoading: false,
  showScrollTop: false,
  isMobileMenuOpen: false
};

// Reducer function
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_SECTION:
      return { ...state, activeSection: action.payload };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_SCROLL_TOP:
      return { ...state, showScrollTop: action.payload };
    case SET_MOBILE_MENU:
      return { ...state, isMobileMenuOpen: action.payload };
    default:
      return state;
  }
};

// Main Dashboard component
const Dashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { activeSection, isLoading, showScrollTop, isMobileMenuOpen } = state;
  const navigate = useNavigate();
  const auth = getAuth();
  const timeoutRef = useRef(null);

  // Navigation sections
  const sections = [
    { id: 'executive-summary', label: 'Executive Summary', icon: <FaChartLine /> },
    { id: 'business-model', label: 'Business Model', icon: <FaDollarSign /> },
    { id: 'strategic', label: 'Strategic Impact', icon: <FaTrophy /> }
  ];

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const scrollPosition = window.scrollY;
      dispatch({ type: SET_SCROLL_TOP, payload: scrollPosition > 500 });
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu')) {
        dispatch({ type: SET_MOBILE_MENU, payload: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch, isMobileMenuOpen]);

  const closeMobileMenu = () => {
    dispatch({ type: SET_MOBILE_MENU, payload: false });
  };

  const handleNavClick = useCallback((sectionId) => {
    dispatch({ type: SET_ACTIVE_SECTION, payload: sectionId });
    closeMobileMenu();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [auth, navigate]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar 
        activeSection={activeSection}
        sections={sections}
        onNavClick={handleNavClick}
      />
      <main className="pt-20">
        <LoadingOverlay isLoading={isLoading} />
        
        <SectionTransition>
          <section id="executive-summary" className="py-12">
            <div className="container mx-auto px-4">
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
            </div>
          </section>
          
          <section id="business-model" className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-gilda font-bold text-darkBrown mb-6">Business Model</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-gilda font-bold text-darkBrown mb-4">Revenue Streams</h3>
                    <p className="text-gray-700 mb-4">
                      The Winner's Circle Club generates revenue through multiple streams:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mb-4">
                      <li>Annual membership fees ($2,000 per member)</li>
                      <li>Additional spending beyond credit allocation</li>
                      <li>Accommodation bookings at the estate</li>
                      <li>Event participation and private tastings</li>
                    </ul>
                    <p className="text-gray-700">
                      Our financial projections indicate that the club will contribute significantly to Milea's overall revenue, with expected growth from $192,000 in Year 1 to $913,050 in Year 4.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-gilda font-bold text-darkBrown mb-4">Cost Structure</h3>
                    <p className="text-gray-700 mb-4">
                      The implementation of the Winner's Circle Club requires both upfront investment and ongoing operational costs:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mb-4">
                      <li>Initial infrastructure investment ($175,000)</li>
                      <li>Technology systems implementation ($62,500)</li>
                      <li>Shared club manager position ($85,000 annually)</li>
                      <li>Ongoing operations and marketing ($87,500 annually)</li>
                    </ul>
                    <p className="text-gray-700">
                      Despite these costs, the projected profit margins are substantial, with a break-even point expected in Year 2.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section id="strategic" className="py-12">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-gilda font-bold text-darkBrown mb-6">Strategic Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-gilda font-bold text-darkBrown mb-4">Brand Enhancement</h3>
                    <p className="text-gray-700 mb-4">
                      The Winner's Circle Club positions Milea Estate as a premium destination, enhancing our brand value and market positioning. This exclusive tier creates aspirational appeal for our broader customer base.
                    </p>
                    <p className="text-gray-700">
                      The club's focus on experiential offerings rather than just wine allocations differentiates Milea from competitors and establishes us as a lifestyle brand rather than just a wine producer.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-gilda font-bold text-darkBrown mb-4">Market Expansion</h3>
                    <p className="text-gray-700 mb-4">
                      By targeting high-net-worth individuals and wine enthusiasts, the Winner's Circle Club enables Milea to tap into a new customer segment with significant purchasing power.
                    </p>
                    <p className="text-gray-700">
                      The club's credit-based model encourages members to explore our full range of offerings, potentially converting them into regular customers of our standard wine club and retail products.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SectionTransition>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;