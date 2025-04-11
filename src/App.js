import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line, CartesianGrid } from 'recharts';
import { FaChartLine, FaUsers, FaDollarSign, FaTrophy, FaCalendarAlt, FaChartPie, FaLightbulb, FaChevronDown, FaWineGlass, FaTools } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';
import ImplementationVisuals from './ImplementationVisuals';
import './App.css';
import { motion } from 'framer-motion';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main Dashboard component
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data for lifetime value comparison
  const lifetimeValueData = [
    { name: 'Traditional Wine Club', value: 1920 },
    { name: 'Winner\'s Circle Club', value: 8000 }
  ];

  // Data for projected revenue growth
  const revenueGrowthData = [
    { year: 1, directSpend: 128000, additionalSpend: 25600, accommodationSpend: 5760, total: 159360 },
    { year: 2, directSpend: 296000, additionalSpend: 59200, accommodationSpend: 13320, total: 368520 },
    { year: 3, directSpend: 438000, additionalSpend: 87600, accommodationSpend: 19800, total: 545400 },
    { year: 4, directSpend: 562238, additionalSpend: 112448, accommodationSpend: 25290, total: 699976 }
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
    { year: 2, directMembership: 296000, beyondCredit: 59200, accommodation: 13320 },
    { year: 3, directMembership: 438000, beyondCredit: 87600, accommodation: 19800 },
    { year: 4, directMembership: 562238, beyondCredit: 112448, accommodation: 25290 }
  ];

  // Data for membership growth
  const membershipGrowthData = [
    { year: 0, total: 0, upgrades: 0, new: 0 },
    { year: 1, total: 64, upgrades: 24, new: 40 },
    { year: 2, total: 148, upgrades: 62, new: 110 },
    { year: 3, total: 220, upgrades: 76, new: 168 },
    { year: 4, total: 281, upgrades: 90, new: 215 }
  ];

  // Data for membership breakdown
  const membershipBreakdownData = {
    year1: {
      upgrades: 24,
      newMembers: 40,
      total: 64
    },
    year2: {
      upgrades: 38,
      newMembers: 70,
      total: 148
    },
    year3: {
      upgrades: 14,
      newMembers: 58,
      total: 220
    },
    year4: {
      upgrades: 14,
      newMembers: 47,
      total: 281
    }
  };

  // Colors for the pie chart
  const COLORS = ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'];

  const navItems = [
    { 
      id: 'executive-summary', 
      label: 'Executive Summary', 
      preview: "Overview of the Winner's Circle Club concept and key financial metrics" 
    },
    { 
      id: 'business-model', 
      label: 'Business Model', 
      preview: 'Detailed analysis of the credit-based membership structure and revenue model' 
    },
    { 
      id: 'implementation', 
      label: 'Implementation', 
      preview: 'Physical infrastructure requirements, technology needs, and staffing considerations' 
    },
    { 
      id: 'strategic', 
      label: 'Strategic Impact', 
      preview: 'Analysis of competitive positioning and market differentiation opportunities' 
    },
    { 
      id: 'recommendations', 
      label: 'Recommendations', 
      preview: 'Implementation roadmap, success metrics, and risk mitigation strategies' 
    }
  ];

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

  return (
    <div className="min-h-screen bg-background" ref={mainRef}>
      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Navigation */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo">
            <FaWineGlass className="logo-icon" />
            <span>Winner's Circle Club</span>
          </div>
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger"></span>
          </button>
          <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-darkBrown opacity-60"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-gilda">Winner's Circle Club</h1>
          <p className="mt-6 max-w-3xl text-xl text-white">
            An analysis of Milea Estate's ultra-premium membership tier
          </p>
          
          {/* Add pull quote */}
          <div className="hero-pull-quote mt-12">
            "The Winner's Circle Club represents a significant opportunity for Milea to enhance its membership program, create distinctive competitive advantage, and substantially increase revenue."
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Executive Summary */}
        <section id="executive-summary" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('executive-summary')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Executive Summary</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['executive-summary'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['executive-summary'] ? 'collapsed' : ''}`}>
            {/* Key Insights Section */}
            <motion.div 
              className="insights-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Key Insights
              </motion.h2>
              
              <div className="insights-container">
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="insight-icon">📈</div>
                  <div className="insight-value">37%</div>
                  <div className="insight-label">Annual Club Revenue</div>
                  <div className="insight-description">Increase in annual club revenue</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="insight-icon">💎</div>
                  <div className="insight-value">316%</div>
                  <div className="insight-label">Member Lifetime Value</div>
                  <div className="insight-description">Increase in member lifetime value</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="insight-icon">💰</div>
                  <div className="insight-value">-57%</div>
                  <div className="insight-label">First-Year ROI</div>
                  <div className="insight-description">With 28-month payback period</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="insight-icon">⭐</div>
                  <div className="insight-value">Enhanced</div>
                  <div className="insight-label">Member Experience</div>
                  <div className="insight-description">Improved retention and satisfaction</div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Add infographic */}
            <div className="infographic">
              <div className="infographic-title">Strategic Benefits</div>
              <div className="infographic-container">
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaTrophy />
                  </div>
                  <div className="infographic-label">Market Position</div>
                  <div className="infographic-description">Premium tier differentiation</div>
                </div>
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="infographic-label">Visit Frequency</div>
                  <div className="infographic-description">Increased member visits</div>
                </div>
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaChartPie />
                  </div>
                  <div className="infographic-label">Revenue Mix</div>
                  <div className="infographic-description">Diversified income streams</div>
                </div>
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaLightbulb />
                  </div>
                  <div className="infographic-label">Brand Elevation</div>
                  <div className="infographic-description">Enhanced perception</div>
                </div>
              </div>
            </div>
            
            {/* Executive Summary Text */}
            <div className="prose prose-lg max-w-none text-darkBrown mt-8">
              <p>
                This analysis examines the structure, benefits, and potential financial impact of implementing the Winner's Circle Club as Milea Estate's ultra-premium membership tier. Positioned above the existing Jumper, Grand Prix, and Triple Crown tiers, the Winner's Circle represents a significant evolution in Milea's membership strategy that emphasizes flexibility, exclusivity, and enhanced experiences beyond traditional wine allocations.
              </p>
              <p>
                With a quarterly commitment of $500 ($2,000 annually), this credit-based membership transforms the traditional wine club relationship into a comprehensive lifestyle proposition. By offering privileged access to exclusive spaces, wine storage, and premium experiences, the Winner's Circle Club promises to enhance member satisfaction, increase retention rates, and drive substantial additional revenue across all profit centers.
              </p>
              <p>
                Based on our analysis, implementing the Winner's Circle will generate $159,360 in first-year revenue, representing a 37% addition to Milea's current annual club revenue of $432,000. This revenue grows to $699,976 by Year 4 through a combination of membership upgrades from existing club members and new premium member acquisitions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Visual Divider */}
        <div className="section-divider">
          <FaWineGlass className="divider-icon" />
        </div>
        
        {/* Business Model Structure */}
        <section id="business-model" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('business-model')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Business Model Structure</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['business-model'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['business-model'] ? 'collapsed' : ''}`}>
            {/* Add pull quote */}
            <div className="pull-quote">
              "The Winner's Circle operates on a quarterly credit model rather than a traditional wine allocation system, offering members complete flexibility in how they use their credits across the entire Milea ecosystem."
            </div>
            
            {/* Add comparison table */}
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Wine Club</th>
                  <th>Winner's Circle Club</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Membership Model</td>
                  <td>Allocation-based</td>
                  <td className="highlight">Credit-based</td>
                </tr>
                <tr>
                  <td>Quarterly Commitment</td>
                  <td>$180</td>
                  <td className="highlight">$500</td>
                </tr>
                <tr>
                  <td>Redemption Options</td>
                  <td>Wine only</td>
                  <td className="highlight">All Milea offerings</td>
                </tr>
                <tr>
                  <td>Member Discount</td>
                  <td>10-15%</td>
                  <td className="highlight">20%</td>
                </tr>
              </tbody>
            </table>
            
            <div className="prose prose-lg max-w-none text-darkBrown">
              <h3>Core Framework</h3>
              <p>
                The Winner's Circle operates on a quarterly credit model rather than a traditional wine allocation system:
              </p>
              <ol>
                <li><strong>Credit-Based Membership</strong>: Members pay $500 quarterly ($2,000 annually), converted to an equivalent $500 credit balance on their account.</li>
                <li>
                  <strong>Comprehensive Flexibility</strong>: Credits are redeemable across the entire Milea ecosystem:
                  <ul>
                    <li>Wine purchases (current releases and library wines)</li>
                    <li>Culinary program (tapas menu and premium dinner series)</li>
                    <li>Luxury accommodations at Staatsburg House</li>
                    <li>Merchandise and retail offerings</li>
                    <li>Events and experiences</li>
                  </ul>
                </li>
                <li>
                  <strong>Premium Tier Positioning</strong>: The club sits atop Milea's existing membership hierarchy:
                  <ul>
                    <li>Jumper, Grand Prix, and Triple Crown tiers remain unchanged</li>
                    <li>Winner's Circle provides a clear upgrade path for existing members</li>
                    <li>Creates aspirational target for newer members as they mature</li>
                  </ul>
                </li>
                <li>
                  <strong>Infrastructure Access</strong>: Beyond credits, membership provides access to exclusive spaces and amenities including:
                  <ul>
                    <li>Dedicated club lounge with vineyard views</li>
                    <li>Wine storage lockers</li>
                    <li>Recreational facilities (pools, tennis, bocce, and pickleball courts)</li>
                    <li>Biometric access for extended-hours visitation</li>
                  </ul>
                </li>
              </ol>

              <h3>Value Proposition</h3>
              <p>
                The Winner's Circle delivers multidimensional value beyond traditional wine clubs:
              </p>
              <ol>
                <li><strong>Complete Purchase Flexibility</strong>: Unlike allocation-based tiers where members receive predetermined wine selections, Winner's Circle members allocate their credits according to personal preferences.</li>
                <li><strong>Exclusive Space Access</strong>: Private club lounge provides a comfortable, premium environment for relaxation and socialization away from general tasting room crowds.</li>
                <li><strong>Wine Storage Solution</strong>: Personal wine lockers eliminate the "wine accumulation problem" while maintaining a connection to the winery and encouraging visitation.</li>
                <li><strong>Premium Recognition</strong>: Special treatment and recognition across all touchpoints create a sense of belonging and status.</li>
                <li><strong>Hospitality Integration</strong>: Privileged access to Staatsburg House connects wine lifestyle to luxury accommodations.</li>
                <li><strong>Event Priority</strong>: Guaranteed access to limited-capacity experiences and events that frequently sell out.</li>
              </ol>
            </div>
          </div>
        </section>
        
        {/* Visual Divider */}
        <div className="section-divider">
          <FaChartLine className="divider-icon" />
        </div>
        
        {/* Member Benefits & Experience */}
        <section id="benefits" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('benefits')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Member Benefits & Experience</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['benefits'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['benefits'] ? 'collapsed' : ''}`}>
            <div className="prose prose-lg max-w-none text-darkBrown">
              <h3>Credit System</h3>
              <ul>
                <li><strong>Quarterly Credits</strong>: $500 applied automatically to member accounts each quarter</li>
                <li><strong>Extended Validity</strong>: Credits remain valid for 12 months from issuance to provide flexibility</li>
                <li><strong>Seamless Redemption</strong>: Credits automatically applied to purchases across all facilities</li>
                <li><strong>Supplemental Value</strong>: 20% discount on all purchases beyond credit usage (compared to 10-15% for standard tiers)</li>
              </ul>

              <h3>Access Privileges</h3>
              <ul>
                <li><strong>Club Lounge</strong>: Exclusive access to dedicated member space with premium furnishings</li>
                <li><strong>Recreational Facilities</strong>: Access to pools, tennis, bocce, and pickleball courts during operational hours</li>
                <li><strong>Biometric Entry</strong>: Fingerprint/facial recognition access to secure areas and facilities</li>
                <li><strong>Extended Hours</strong>: After-hours access to select areas beyond regular tasting room hours</li>
              </ul>

              <h3>Wine Storage</h3>
              <ul>
                <li><strong>Dedicated Lockers</strong>: Personal climate-controlled wine lockers</li>
                <li><strong>Storage Capacity</strong>: Standard allocation of space for 24 bottles with option to expand</li>
                <li><strong>Consumption Flexibility</strong>: Ability to retrieve and enjoy stored wines in club lounge</li>
                <li><strong>Receiving Service</strong>: Acceptance and storage of wine shipments</li>
              </ul>

              <h3>Culinary Privileges</h3>
              <ul>
                <li><strong>Standard Menu</strong>: 20% discount on tapas menu items beyond credit usage</li>
                <li><strong>Culinary Series</strong>: Priority access and guaranteed reservations for premium dinner events</li>
                <li><strong>Private Dining</strong>: Ability to reserve club spaces for intimate gatherings</li>
                <li><strong>Menu Customization</strong>: Custom menu options for private events</li>
              </ul>

              <h3>Accommodation Benefits</h3>
              <ul>
                <li><strong>Priority Booking</strong>: First access to reservation windows for Staatsburg House</li>
                <li><strong>Exclusive Rates</strong>: 20% discount on accommodations beyond credit usage</li>
                <li><strong>Special Packages</strong>: Access to member-only accommodation packages</li>
                <li><strong>Extended Stay Options</strong>: Flexible check-in/check-out times when available</li>
              </ul>

              <h3>Event Access</h3>
              <ul>
                <li><strong>Priority Invitations</strong>: First notification and access to all winery events</li>
                <li><strong>Reserved Seating</strong>: Dedicated seating areas at public events</li>
                <li><strong>Exclusive Events</strong>: Member-only tastings, dinners, and experiences</li>
                <li><strong>Bring-a-Guest Privileges</strong>: Ability to extend benefits to accompanied guests (up to 6)</li>
              </ul>

              <h3>Personalized Services</h3>
              <ul>
                <li><strong>Dedicated Concierge</strong>: Personal point of contact for reservations and requests</li>
                <li><strong>Wine Advisor</strong>: Professional guidance on collection development and wine selection</li>
                <li><strong>Custom Experiences</strong>: Tailored experiences based on preferences and interests</li>
                <li><strong>Recognition Program</strong>: Staff recognition of members across all touchpoints</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Visual Divider */}
        <div className="section-divider">
          <FaTools className="divider-icon" />
        </div>
        
        {/* Implementation Requirements */}
        <section id="implementation" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('implementation')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Implementation Requirements</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['implementation'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['implementation'] ? 'collapsed' : ''}`}>
            <div className="prose prose-lg max-w-none text-darkBrown">
              <p>
                The implementation of the Winner's Circle program will follow a phased approach to ensure a smooth transition and minimize disruption to existing operations. This section outlines the timeline, resource requirements, and key milestones for successful execution.
              </p>
            </div>
            
            {/* Implementation Visuals Component */}
            <ImplementationVisuals />
            
            <div className="prose prose-lg max-w-none text-darkBrown">
              <p>
                The phased implementation approach allows for iterative testing and refinement of the program before full-scale rollout. This minimizes risk and ensures that member feedback is incorporated throughout the development process.
              </p>
              
              <p>
                Key success factors include clear communication with existing members, training of staff on new processes, and careful management of the transition period. Regular progress reviews and adjustments to the implementation plan will be conducted as needed.
              </p>
              
              <h3>Implementation Timeline</h3>
              <h4>Phase 1: Preparation (Months 1-3)</h4>
              <ul>
                <li>Finalize membership structure and benefits</li>
                <li>Develop technology infrastructure</li>
                <li>Create marketing materials and membership collateral</li>
                <li>Begin physical space renovations</li>
                <li>Identify prospects from existing wine club members</li>
              </ul>

              <h4>Phase 2: Soft Launch (Months 4-6)</h4>
              <ul>
                <li>Complete initial renovations</li>
                <li>Invite select existing members to join as founding members</li>
                <li>Train staff on new processes and procedures</li>
                <li>Launch basic program with initial group of 24 upgraded members</li>
                <li>Begin accepting new member applications</li>
              </ul>

              <h4>Phase 3: Full Implementation (Months 7-12)</h4>
              <ul>
                <li>Complete all physical infrastructure</li>
                <li>Open general membership enrollment</li>
                <li>Expand staffing to support growing membership</li>
                <li>Reach Year 1 target of 64 total members</li>
                <li>Begin marketing to potential members beyond existing customer base</li>
              </ul>

              <h4>Growth Targets</h4>
              <ul>
                <li><strong>Year 1 End</strong>: 64 members (24 upgrades + 40 new)</li>
                <li><strong>Year 2 End</strong>: 148 members (cumulative 62 upgrades + 110 new)</li>
                <li><strong>Year 3 End</strong>: 220 members (cumulative 76 upgrades + 168 new)</li>
                <li><strong>Year 4 End</strong>: 281 members (cumulative 90 upgrades + 215 new)</li>
              </ul>

              <h3>Physical Infrastructure</h3>
              
              <h4>Club Lounge</h4>
              <ul>
                <li>Renovation of existing space adjacent to tasting room</li>
                <li>Capacity for approximately 20 members</li>
                <li>Comfortable seating areas with vineyard views</li>
                <li>Self-service wine dispensing system</li>
                <li>Limited food service capabilities</li>
                <li>Sound isolation from main tasting room</li>
              </ul>

              <h4>Wine Storage Facility</h4>
              <ul>
                <li>Climate-controlled environment (55°F, 70% humidity)</li>
                <li>Individual lockers with secure access</li>
                <li>Central location within facility</li>
                <li>Adjacent to club lounge for convenient consumption</li>
                <li>Digital inventory management system</li>
              </ul>

              <h4>Recreational Amenities</h4>
              <ul>
                <li>Secure access controls for all facilities</li>
                <li>Reservation system for tennis and pickleball courts</li>
                <li>Pool area with dedicated member section</li>
                <li>Changing facilities and towel service</li>
                <li>Maintenance and service protocols</li>
              </ul>

              <h3>Technology Infrastructure</h3>
              <ul>
                <li><strong>Integrated CRM</strong>: Comprehensive member profile and activity tracking</li>
                <li><strong>Credit Management System</strong>: Platform for issuing, tracking, and redeeming credits</li>
                <li><strong>Biometric Access Controls</strong>: Secure entry system for restricted areas</li>
                <li><strong>Reservation Platform</strong>: System for managing space and amenity bookings</li>
                <li><strong>Mobile Application</strong>: Member portal for account management and reservations</li>
              </ul>

              <h3>Staffing Requirements</h3>
              <ul>
                <li><strong>Club Manager</strong>: Dedicated oversight of Winner's Circle program and member experience</li>
                <li><strong>Member Services Team</strong>: Staff focused on member communication and relationship management</li>
                <li><strong>Lounge Attendants</strong>: Service personnel for club spaces</li>
                <li><strong>Concierge Services</strong>: Reservation and request handling for members</li>
                <li><strong>Wine Advisors</strong>: Knowledgeable staff for collection guidance and recommendations</li>
              </ul>
            </div>
            
            {/* Implementation Costs Chart */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-darkBrown mb-4">Implementation Costs</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={implementationCostsData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {implementationCostsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Cost']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-gray-600">
                Total first-year investment ranges from $310,000 to $440,000 (average: $375,000), with annual operating costs of $187,500.
              </p>
            </div>
          </div>
        </section>
        
        {/* Visual Divider */}
        <div className="section-divider">
          <FaTools className="divider-icon" />
        </div>
        
        {/* Financial Analysis */}
        <section id="financial" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('financial')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Financial Analysis & Revenue Impact</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['financial'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['financial'] ? 'collapsed' : ''}`}>
            <div className="prose prose-lg max-w-none text-darkBrown">
              <h3>Membership Growth Projections</h3>
              <p>Based on Milea's current base of 600 traditional club members, we project the following growth for the Winner's Circle:</p>
              <ul>
                <li><strong>Year 1</strong>: 64 members
                  <ul>
                    <li>24 upgrades from traditional club</li>
                    <li>40 new member acquisitions</li>
                  </ul>
                </li>
                <li><strong>Year 2</strong>: 148 members
                  <ul>
                    <li>38 additional upgrades from traditional club</li>
                    <li>70 additional new member acquisitions</li>
                    <li>24 retained upgrades + 40 retained new members from Year 1</li>
                  </ul>
                </li>
                <li><strong>Year 3</strong>: 220 members
                  <ul>
                    <li>14 additional upgrades from traditional club</li>
                    <li>58 additional new member acquisitions</li>
                    <li>62 retained upgrades + 110 retained new members from Years 1-2</li>
                  </ul>
                </li>
                <li><strong>Year 4</strong>: 281 members
                  <ul>
                    <li>14 additional upgrades from traditional club</li>
                    <li>47 additional new member acquisitions</li>
                    <li>76 retained upgrades + 168 retained new members from Years 1-3</li>
                  </ul>
                </li>
              </ul>

              <h3>Membership Conversion Assumptions</h3>
              <p>Our growth model is based on the following conversion rates from Milea's existing member base of 600:</p>
              <ul>
                <li><strong>Year 1</strong>: 4% upgrade rate (24 members) + 40 new acquisitions</li>
                <li><strong>Year 2</strong>: Additional 6.3% upgrade rate (38 members) + 70 new acquisitions</li>
                <li><strong>Year 3</strong>: Additional 2.3% upgrade rate (14 members) + 58 new acquisitions</li>
                <li><strong>Year 4</strong>: Additional 2.3% upgrade rate (14 members) + 47 new acquisitions</li>
              </ul>

              <h3>Accommodation Revenue Calculation</h3>
              <p>Formula: members × 10% × 3 nights × $300 per night</p>
              <ul>
                <li>Year 1: 64 members × 10% × 3 nights × $300 = $5,760</li>
                <li>Year 2: 148 members × 10% × 3 nights × $300 = $13,320</li>
                <li>Year 3: 220 members × 10% × 3 nights × $300 = $19,800</li>
                <li>Year 4: 281 members × 10% × 3 nights × $300 = $25,290</li>
              </ul>

              <h3>Revenue Impact Analysis</h3>
              <p>Based on our membership growth projections and average member spending:</p>
              <ul>
                <li><strong>Year 1</strong>: $159,360 total revenue
                  <ul>
                    <li>Direct membership spend: $128,000</li>
                    <li>Additional spend (20%): $25,600</li>
                    <li>Accommodation revenue: $5,760</li>
                  </ul>
                </li>
                <li><strong>Year 2</strong>: $368,520 total revenue
                  <ul>
                    <li>Direct membership spend: $296,000</li>
                    <li>Additional spend (20%): $59,200</li>
                    <li>Accommodation revenue: $13,320</li>
                  </ul>
                </li>
                <li><strong>Year 3</strong>: $545,400 total revenue
                  <ul>
                    <li>Direct membership spend: $438,000</li>
                    <li>Additional spend (20%): $87,600</li>
                    <li>Accommodation revenue: $19,800</li>
                  </ul>
                </li>
                <li><strong>Year 4</strong>: $699,976 total revenue
                  <ul>
                    <li>Direct membership spend: $562,238</li>
                    <li>Additional spend (20%): $112,448</li>
                    <li>Accommodation revenue: $25,290</li>
                  </ul>
                </li>
              </ul>

              <h3>Implementation Costs</h3>
              <ul>
                <li><strong>Physical Infrastructure</strong>: $150,000-$200,000 one-time investment</li>
                <li><strong>Technology Systems</strong>: $50,000-$75,000 implementation plus $15,000 annual maintenance</li>
                <li><strong>Shared Club Manager</strong>: $85,000 annual salary (shared between Milea Estate and HV Vineyards)</li>
                <li><strong>Ongoing Operations</strong>: $75,000-$100,000 annual operational expenses</li>
              </ul>
              <p><strong>Total First-Year Investment</strong>: $310,000-$440,000 (average: $375,000)<br />
              <strong>Annual Operating Costs</strong>: $187,500 (average of $175,000-$200,000)</p>

              <h3>Return on Investment</h3>
              <ul>
                <li><strong>First-Year ROI</strong>: ($159,360 revenue - $187,500 operating costs) / $375,000 investment = -57% ROI</li>
                <li><strong>Year 2 ROI</strong>: ($368,520 revenue - $187,500 operating costs) / $187,500 operating costs = 97% ROI</li>
                <li><strong>Year 3 ROI</strong>: ($545,400 revenue - $187,500 operating costs) / $187,500 operating costs = 191% ROI</li>
                <li><strong>Year 4 ROI</strong>: ($699,976 revenue - $187,500 operating costs) / $187,500 operating costs = 273% ROI</li>
              </ul>

              <h3>Payback Period Analysis</h3>
              <ul>
                <li><strong>Initial Investment</strong>: $375,000</li>
                <li><strong>Year 1 Net Cash Flow</strong>: -$28,140 ($159,360 revenue - $187,500 operating costs)</li>
                <li><strong>Year 2 Net Cash Flow</strong>: $181,020 ($368,520 revenue - $187,500 operating costs)</li>
                <li><strong>Cumulative through Year 2</strong>: $152,880</li>
                <li><strong>Year 3 Net Cash Flow</strong>: $357,900 ($545,400 revenue - $187,500 operating costs)</li>
                <li><strong>Payback Timing</strong>: Approximately 28 months
                  <ul>
                    <li>Initial 24 months: $152,880 recovered</li>
                    <li>Remaining $222,120 recovered in ~4 months of Year 3</li>
                  </ul>
                </li>
              </ul>

              <h3>Multi-Year Financial Impact</h3>
              <ul>
                <li><strong>Total 4-Year Revenue</strong>: $1,773,346
                  <ul>
                    <li>Year 1: $159,360 (9% of total)</li>
                    <li>Year 2: $368,520 (21% of total)</li>
                    <li>Year 3: $545,400 (31% of total)</li>
                    <li>Year 4: $699,976 (39% of total)</li>
                  </ul>
                </li>
                <li><strong>Total 4-Year Investment</strong>: $937,500
                  <ul>
                    <li>Initial investment: $375,000</li>
                    <li>Operating costs: $187,500 × 3 years = $562,500</li>
                  </ul>
                </li>
                <li><strong>4-Year Cumulative ROI</strong>: [($1,773,346 - $937,500) / $937,500] × 100% = 89%</li>
                <li><strong>Average Annual Revenue Growth</strong>: [(699,976 / 159,360)^(1/3) - 1] × 100% = 64%</li>
              </ul>

              <h3>Revenue Growth Breakdown</h3>
              <ul>
                <li><strong>Year 1 to Year 2</strong>: 131% growth ($159,360 to $368,520)</li>
                <li><strong>Year 2 to Year 3</strong>: 48% growth ($368,520 to $545,400)</li>
                <li><strong>Year 3 to Year 4</strong>: 28% growth ($545,400 to $699,976)</li>
                <li><strong>Year 3 to Year 4</strong>: 28% growth ($545,400 to $700,066)</li>
                <li><strong>Compound Annual Growth Rate</strong>: 64%</li>
              </ul>
            </div>
            
            {/* Revenue Growth Chart */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-darkBrown mb-4">Projected Revenue Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Revenue']} />
                  <Line type="monotone" dataKey="total" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-gray-600">
                Projected revenue growth from $159,360 in Year 1 to $700,066 in Year 4, representing a compound annual growth rate of 64%.
              </p>
            </div>
            
            {/* Lifetime Value Comparison */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-darkBrown mb-4">Membership Lifetime Value Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lifetimeValueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Lifetime Value ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Lifetime Value']} />
                  <Bar dataKey="value" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-gray-600">
                The Winner's Circle Club increases member lifetime value from $1,920 to $8,000, representing a 317% increase.
              </p>
            </div>
          </div>
        </section>
        
        {/* Visual Divider */}
        <div className="section-divider">
          <FaLightbulb className="divider-icon" />
        </div>
        
        {/* Strategic Impact Analysis */}
        <section id="strategic" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('strategic')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Strategic Impact Analysis</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['strategic'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['strategic'] ? 'collapsed' : ''}`}>
            {/* Add pull quote */}
            <div className="pull-quote">
              "The Winner's Circle positions Milea uniquely in the Hudson Valley wine region, creating competitive differentiation and transforming the winery from a tasting visit to a lifestyle destination."
            </div>
            
            {/* Strategic Benefits Infographic */}
            <motion.div 
              className="insights-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Strategic Benefits
              </motion.h2>
              
              <div className="insights-container">
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="insight-icon">
                    <FaTrophy />
                  </div>
                  <div className="insight-value">Premium</div>
                  <div className="insight-label">Market Position</div>
                  <div className="insight-description">Premium tier differentiation</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="insight-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="insight-value">Increased</div>
                  <div className="insight-label">Visit Frequency</div>
                  <div className="insight-description">Increased member visits</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="insight-icon">
                    <FaChartPie />
                  </div>
                  <div className="insight-value">Diversified</div>
                  <div className="insight-label">Revenue Mix</div>
                  <div className="insight-description">Diversified income streams</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="insight-icon">
                    <FaLightbulb />
                  </div>
                  <div className="insight-value">Enhanced</div>
                  <div className="insight-label">Brand Elevation</div>
                  <div className="insight-description">Enhanced perception</div>
                </motion.div>
              </div>
            </motion.div>
            
            <div className="prose prose-lg max-w-none text-darkBrown">
              <h3>Existing Club Optimization</h3>
              <p>The introduction of the Winner's Circle creates several advantages for Milea's club structure:</p>
              <ol>
                <li><strong>Aspirational Upgrade Path</strong>: Creates a clear progression for members as their wine journey evolves</li>
                <li><strong>Segmentation Efficiency</strong>: Allows more tailored experiences for different member segments:
                  <ul>
                    <li>Jumper, Grand Prix and Triple Crown: Product-focused relationships</li>
                    <li>Winner's Circle: Experience-focused relationships</li>
                  </ul>
                </li>
                <li><strong>Retention Enhancement</strong>: Provides an alternative to cancellation for members who have "maxed out" their storage capacity</li>
                <li><strong>Visit Frequency Increase</strong>: Club lounge access and storage likely to increase Winner's Circle member visits beyond the current average of 6 visits annually</li>
              </ol>

              <h3>Market Positioning</h3>
              <p>The Winner's Circle positions Milea uniquely in the Hudson Valley wine region:</p>
              <ol>
                <li><strong>Competitive Differentiation</strong>: Few regional wineries offer comparable premium membership options</li>
                <li><strong>Luxury Alignment</strong>: Better matches the expectations of high-value customers who frequent premium wine regions</li>
                <li><strong>Destination Enhancement</strong>: Transforms Milea from a tasting visit to a lifestyle destination</li>
                <li><strong>Brand Elevation</strong>: Association with premium experiences enhances overall brand perception</li>
              </ol>

              <h3>Long-Term Business Benefits</h3>
              <p>Beyond immediate revenue, the Winner's Circle offers several lasting advantages:</p>
              <ol>
                <li><strong>Capital Planning</strong>: Predictable quarterly revenue improves investment planning</li>
                <li><strong>Inventory Flexibility</strong>: Reduced allocation requirements for wine production</li>
                <li><strong>Weather Resilience</strong>: Shifting revenue mix away from visitation-dependent sources provides better protection against seasonal fluctuations</li>
                <li><strong>Data Enhancement</strong>: Premium members provide deeper insights into preferences and behaviors</li>
                <li><strong>Word-of-Mouth Marketing</strong>: Exclusive experiences generate greater advocacy and referrals</li>
              </ol>
            </div>
          </div>
        </section>
        
        {/* Visual Divider */}
        <div className="section-divider">
          <FaLightbulb className="divider-icon" />
        </div>
        
        {/* Implementation Recommendations */}
        <section id="recommendations" className="section-card animate-fade-in">
          <div className="section-header" onClick={() => toggleSection('recommendations')}>
            <h2 className="text-3xl font-bold font-gilda text-darkBrown">Implementation Recommendations</h2>
            <button className="section-toggle" aria-label="Toggle section">
              <FaChevronDown className={collapsedSections['recommendations'] ? 'collapsed' : ''} />
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections['recommendations'] ? 'collapsed' : ''}`}>
            {/* Success Metrics Visualization */}
            <motion.div 
              className="insights-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Success Metrics
              </motion.h2>
              
              <div className="insights-container">
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="insight-icon">
                    <FaUsers />
                  </div>
                  <div className="insight-value">Growth</div>
                  <div className="insight-label">Membership Growth</div>
                  <div className="insight-description">vs. targets</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="insight-icon">
                    <FaChartLine />
                  </div>
                  <div className="insight-value">Retention</div>
                  <div className="insight-label">Rate Improvement</div>
                  <div className="insight-description">Member loyalty metrics</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="insight-icon">
                    <FaDollarSign />
                  </div>
                  <div className="insight-value">Utilization</div>
                  <div className="insight-label">Credit Usage</div>
                  <div className="insight-description">Percentage of credits used</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="insight-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="insight-value">Frequency</div>
                  <div className="insight-label">Visit Rate</div>
                  <div className="insight-description">Member visitation patterns</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="insight-icon">
                    <FaChartPie />
                  </div>
                  <div className="insight-value">Spending</div>
                  <div className="insight-label">Additional Revenue</div>
                  <div className="insight-description">Beyond credit usage</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="insight-icon">
                    <FaTools />
                  </div>
                  <div className="insight-value">Usage</div>
                  <div className="insight-label">Facility Rates</div>
                  <div className="insight-description">Amenity utilization</div>
                </motion.div>
                
                <motion.div
                  className="insight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="insight-icon">
                    <FaLightbulb />
                  </div>
                  <div className="insight-value">Satisfaction</div>
                  <div className="insight-label">Member Scores</div>
                  <div className="insight-description">Experience ratings</div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Add pull quote */}
            <div className="pull-quote">
              "The Winner's Circle Club represents a significant opportunity for Milea to enhance its membership program, create distinctive competitive advantage, and substantially increase revenue."
            </div>
            
            <div className="prose prose-lg max-w-none text-darkBrown">
              <h3>Conclusion</h3>
              <p>
                The Winner's Circle Club represents a significant opportunity for Milea to enhance its membership program, create distinctive competitive advantage, and substantially increase revenue. By offering a premium credit-based tier above the existing Jumper, Grand Prix, and Triple Crown levels, Milea can better serve its most valuable customers while attracting new high-value members.
              </p>
              <p>
                The projected first-year revenue of $159,360 represents a 37% addition to the current annual club revenue of $432,000, bringing the total combined club revenue to $591,360. Over four years, the program is projected to generate total revenue of $1,773,346 against total investments of $937,500, yielding a cumulative ROI of 89%. While the implementation requires significant investment in infrastructure, technology, and staffing, with a payback period of approximately 28 months, the strong ongoing returns make this a compelling strategic initiative.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-darkBrown text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <p className="text-center text-sm">© {new Date().getFullYear()} Milea Estate Vineyard. All rights reserved.</p>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-sm">Winner's Circle Club Analysis</p>
            </div>
          </div>
        </div>
      </footer>
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