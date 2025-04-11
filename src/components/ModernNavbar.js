import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWineGlass, FaChartLine, FaDollarSign, FaTrophy, FaSignOutAlt, FaBars, FaTimes, FaArrowUp } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';

const ModernNavbar = ({ activeSection, sections, onNavClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const auth = getAuth();
  const navbarRef = useRef(null);
  
  // Track scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Close mobile menu first
      setIsMobileMenuOpen(false);
      
      // Calculate header height for offset
      const headerHeight = navbarRef.current ? navbarRef.current.offsetHeight : 80;
      
      // Scroll to element with offset
      window.scrollTo({
        behavior: 'smooth',
        top: element.offsetTop - headerHeight - 20
      });
      
      // Update active section via callback
      onNavClick(sectionId);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect handled by ProtectedRoute
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Navigation item component
  const NavItem = ({ section, isActive }) => {
    const isHovered = hoverItem === section.id;
    
    return (
      <div 
        className="relative"
        onMouseEnter={() => setHoverItem(section.id)}
        onMouseLeave={() => setHoverItem(null)}
      >
        <button
          className={`relative px-4 py-2 font-medium text-base transition-colors duration-200 rounded-lg ${
            isActive 
              ? 'text-primary-700' 
              : 'text-gray-600 hover:text-primary-600'
          }`}
          onClick={() => scrollToSection(section.id)}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{section.icon}</span>
            <span>{section.label}</span>
          </span>
          
          {isActive && (
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-primary-600 w-full"
              layoutId="activeSection"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}
        </button>
        
        {/* Preview tooltip on hover */}
        <AnimatePresence>
          {isHovered && section.preview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full z-50 w-64 p-4 bg-white rounded-lg shadow-xl border border-gray-100 mt-1"
            >
              <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
              <h4 className="font-semibold text-gray-900 mb-1">{section.label}</h4>
              <p className="text-sm text-gray-600">{section.preview}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  return (
    <>
      <header 
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md py-2' 
            : 'bg-background py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and brand */}
            <div className="flex items-center space-x-2">
              <FaWineGlass className="text-2xl text-primary-600" />
              <span className="font-bold text-xl text-darkBrown">
                Winner's Circle
              </span>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {sections.map((section) => (
                <NavItem 
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                />
              ))}
            </nav>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-3">
                <nav className="flex flex-col space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => scrollToSection(section.id)}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-md transition-colors text-gray-600 hover:bg-gray-50"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-600 border border-gray-200 z-40"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Spacer to compensate for fixed header */}
      <div className={`h-${isScrolled ? '16' : '24'}`} />
    </>
  );
};

// Define your sections for use with this navbar
export const navSections = [
  {
    id: 'executive-summary',
    label: 'Executive Summary',
    icon: <FaChartLine />,
    preview: 'Overview of the Winner\'s Circle Club concept and key metrics'
  },
  {
    id: 'business-model',
    label: 'Business Model',
    icon: <FaWineGlass />,
    preview: 'Analysis of the credit-based membership structure and benefits'
  },
  {
    id: 'implementation',
    label: 'Implementation',
    icon: <FaTrophy />,
    preview: 'Timeline, resources, and requirements for successful execution'
  },
  {
    id: 'financial',
    label: 'Financial Impact',
    icon: <FaDollarSign />,
    preview: 'Revenue projections, ROI analysis, and payback period calculation'
  }
];

export default ModernNavbar; 