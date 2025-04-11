import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line, CartesianGrid } from 'recharts';
import { FaChartLine, FaUsers, FaDollarSign, FaTrophy, FaCalendarAlt, FaChartPie, FaLightbulb, FaChevronDown, FaWineGlass, FaTools } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';
import './App.css';

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

  // Data for quarterly revenue comparison chart
  const revenueComparisonData = [
    { name: 'Traditional Wine Club', revenue: 180 },
    { name: 'Winner\'s Circle Club', revenue: 500 }
  ];

  // Data for lifetime value comparison
  const lifetimeValueData = [
    { name: 'Traditional Wine Club', value: 1920 },
    { name: 'Winner\'s Circle Club', value: 8000 }
  ];

  // Data for projected revenue growth
  const revenueGrowthData = [
    { month: 1, revenue: 50000 },
    { month: 2, revenue: 100000 },
    { month: 3, revenue: 150000 },
    { month: 4, revenue: 200000 },
    { month: 5, revenue: 250000 },
    { month: 6, revenue: 300000 },
    { month: 7, revenue: 350000 },
    { month: 8, revenue: 400000 },
    { month: 9, revenue: 450000 },
    { month: 10, revenue: 500000 },
    { month: 11, revenue: 550000 },
    { month: 12, revenue: 612000 }
  ];

  // Data for implementation costs
  const implementationCostsData = [
    { name: 'Physical Infrastructure', value: 175000 },
    { name: 'Technology Systems', value: 62500 },
    { name: 'Staffing', value: 135000 },
    { name: 'Operations', value: 87500 }
  ];

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

  // Add this function to toggle section collapse
  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu when a section is selected
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
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
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
          <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={closeMobileMenu}
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
            {/* Add key takeaways box */}
            <div className="key-takeaway">
              <h3>Key Insights</h3>
              <ul>
                <li>142% increase in annual club revenue</li>
                <li>317% increase in member lifetime value</li>
                <li>33% first-year ROI with 9-10 month payback period</li>
                <li>Enhanced member retention and satisfaction</li>
              </ul>
            </div>
            
            {/* Add infographic */}
            <div className="infographic">
              <div className="infographic-title">Revenue Impact Overview</div>
              <div className="infographic-container">
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaDollarSign />
                  </div>
                  <div className="infographic-label">Annual Revenue</div>
                  <div className="infographic-value">$612K</div>
                  <div className="infographic-description">Incremental revenue from Winner's Circle</div>
                </div>
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaUsers />
                  </div>
                  <div className="infographic-label">Member Value</div>
                  <div className="infographic-value">$8K</div>
                  <div className="infographic-description">Lifetime value per member</div>
                </div>
                <div className="infographic-item">
                  <div className="infographic-icon">
                    <FaChartLine />
                  </div>
                  <div className="infographic-label">ROI</div>
                  <div className="infographic-value">33%</div>
                  <div className="infographic-description">First-year return on investment</div>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-darkBrown">
              <p>
                This analysis examines the structure, benefits, and potential financial impact of implementing the Winner's Circle Club as Milea Estate's ultra-premium membership tier. Positioned above the existing Jumper, Grand Prix, and Triple Crown tiers, the Winner's Circle represents a significant evolution in Milea's membership strategy that emphasizes flexibility, exclusivity, and enhanced experiences beyond traditional wine allocations.
              </p>
              <p>
                With a quarterly commitment of $500 ($2,000 annually), this credit-based membership transforms the traditional wine club relationship into a comprehensive lifestyle proposition. By offering privileged access to exclusive spaces, wine storage, and premium experiences, the Winner's Circle Club promises to enhance member satisfaction, increase retention rates, and drive substantial additional revenue across all profit centers.
              </p>
              <p>
                Based on our analysis, implementing the Winner's Circle could generate approximately $612,000 in annual incremental revenue through a combination of membership upgrades from existing club members and new premium member acquisitions. This represents a significant enhancement to Milea's current club revenue of approximately $432,000 annually.
              </p>
            </div>
            
            {/* Revenue Comparison Chart */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-darkBrown mb-4">Quarterly Revenue Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={revenueComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Quarterly Revenue ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => ['$' + value, 'Quarterly Revenue']} />
                  <Bar dataKey="revenue" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-gray-600">
                The Winner's Circle Club generates $500 in quarterly revenue per member compared to $180 for the traditional wine club tiers.
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
            {/* Add timeline infographic */}
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-date">Months 1-3</div>
                  <div className="timeline-title">Preparation Phase</div>
                  <div className="timeline-description">Finalize membership structure, develop technology requirements, design physical spaces</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-date">Months 4-6</div>
                  <div className="timeline-title">Soft Launch</div>
                  <div className="timeline-description">Invite select members, complete renovations, launch basic program</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-date">Months 7-12</div>
                  <div className="timeline-title">Full Implementation</div>
                  <div className="timeline-description">Open general enrollment, complete infrastructure, expand staffing</div>
                </div>
              </div>
            </div>
            
            {/* Add key takeaways box */}
            <div className="key-takeaway">
              <h3>Implementation Highlights</h3>
              <ul>
                <li>Total first-year investment: $395,000-$525,000</li>
                <li>Annual operating costs: $210,000-$265,000</li>
                <li>9-10 month payback period</li>
                <li>Phased approach to minimize disruption</li>
              </ul>
            </div>
            
            <div className="prose prose-lg max-w-none text-darkBrown">
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
                Total first-year investment ranges from $395,000 to $525,000, with annual operating costs between $210,000 and $265,000.
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
              <h3>Membership Conversion Assumptions</h3>
              <p>Based on Milea's current metrics of 600 members across existing tiers:</p>
              <ul>
                <li><strong>Existing Member Upgrades</strong>: We project a 5% conversion rate from current tiers to the Winner's Circle, resulting in approximately 30 members transitioning to the premium tier.</li>
                <li><strong>Tasting Room Conversions</strong>: While the current club conversion rate is 4% of visitors, we estimate a 0.5% conversion rate directly to the Winner's Circle from the 8,400 non-member visitors, resulting in 42 new premium members annually.</li>
                <li><strong>Total First-Year Membership</strong>: 72 members (30 upgrades + 42 new acquisitions)</li>
              </ul>

              <h3>Revenue Impact Analysis</h3>
              <h4>Direct Membership Revenue:</h4>
              <ul>
                <li><strong>Existing Member Upgrade Revenue</strong>: 
                  <ul>
                    <li>Current: 30 members × $180/quarter = $21,600/quarter</li>
                    <li>Winner's Circle: 30 members × $500/quarter = $60,000/quarter</li>
                    <li><strong>Net Increase</strong>: $38,400/quarter or $153,600/annually</li>
                  </ul>
                </li>
                <li><strong>New Member Revenue</strong>:
                  <ul>
                    <li>42 new members × $500/quarter = $84,000/quarter or $336,000 annually</li>
                    <li>Without the Winner's Circle, we might have converted approximately 5% of these 42 members (2 members) to traditional tiers at $180/quarter = $1,440/quarter</li>
                    <li><strong>Net Increase</strong>: $82,560/quarter or $330,240 annually</li>
                  </ul>
                </li>
                <li><strong>Total Direct Revenue Increase</strong>: $121,560/quarter or $483,840 annually</li>
              </ul>

              <h4>Additional Revenue Streams:</h4>
              <ul>
                <li><strong>Beyond-Credit Spending</strong>: Premium members typically spend 40% beyond their commitment value
                  <ul>
                    <li>72 members × $2,000 annual commitment × 40% additional = $57,600 annually</li>
                  </ul>
                </li>
                <li><strong>Enhanced Retention Value</strong>: Reducing attrition from 15% to 10% for Winner's Circle members
                  <ul>
                    <li>Extends average membership from 32 months to 48 months</li>
                    <li>Increases lifetime value from $1,920 to $8,000 per member</li>
                  </ul>
                </li>
                <li><strong>Accommodation Revenue</strong>: Increased bookings at Staatsburg House
                  <ul>
                    <li>Estimated at $70,000 annually from member stays</li>
                  </ul>
                </li>
                <li><strong>Total Annual Revenue Impact</strong>: $612,000 incremental revenue</li>
              </ul>

              <h3>Implementation Costs</h3>
              <ul>
                <li><strong>Physical Infrastructure</strong>: $150,000-$200,000 one-time investment</li>
                <li><strong>Technology Systems</strong>: $50,000-$75,000 implementation plus $15,000 annual maintenance</li>
                <li><strong>Staffing</strong>: $120,000-$150,000 additional annual labor costs</li>
                <li><strong>Ongoing Operations</strong>: $75,000-$100,000 annual operational expenses</li>
              </ul>
              <p><strong>Total First-Year Investment</strong>: $395,000-$525,000<br />
              <strong>Annual Operating Costs</strong>: $210,000-$265,000</p>

              <h3>Return on Investment</h3>
              <ul>
                <li><strong>First-Year ROI</strong>: $612,000 revenue against $460,000 average investment = 33% ROI</li>
                <li><strong>Ongoing Annual ROI</strong>: $612,000 revenue against $237,500 average operating costs = 158% ROI</li>
                <li><strong>Payback Period</strong>: Approximately 9-10 months</li>
              </ul>
            </div>
            
            {/* Revenue Growth Chart */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-darkBrown mb-4">Projected Revenue Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-gray-600">
                Projected revenue growth over 12 months, reaching $612,000 in incremental annual revenue.
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
            {/* Add key takeaways box */}
            <div className="key-takeaway">
              <h3>Success Metrics</h3>
              <ul>
                <li>Membership growth vs. targets</li>
                <li>Retention rate improvement</li>
                <li>Credit utilization percentage</li>
                <li>Visitation frequency</li>
                <li>Additional spending beyond credits</li>
                <li>Facility usage rates</li>
                <li>Member satisfaction scores</li>
              </ul>
            </div>
            
            {/* Add pull quote */}
            <div className="pull-quote">
              "The Winner's Circle Club represents a significant opportunity for Milea to enhance its membership program, create distinctive competitive advantage, and substantially increase revenue."
            </div>
            
            <div className="prose prose-lg max-w-none text-darkBrown">
              <h3>Phase 1: Preparation (Months 1-3)</h3>
              <ul>
                <li>Finalize membership structure and benefits</li>
                <li>Develop technology requirements and begin system implementation</li>
                <li>Design physical spaces and begin renovations</li>
                <li>Create marketing materials and membership collateral</li>
                <li>Train staff on new program and service standards</li>
                <li>Identify prospects from existing wine club members</li>
              </ul>

              <h3>Phase 2: Soft Launch (Months 4-6)</h3>
              <ul>
                <li>Invite select existing members to join as founding members</li>
                <li>Complete club lounge renovations</li>
                <li>Launch basic program with limited membership (25-30 members)</li>
                <li>Implement core technology systems</li>
                <li>Gather feedback and refine operational processes</li>
              </ul>

              <h3>Phase 3: Full Implementation (Months 7-12)</h3>
              <ul>
                <li>Open general membership enrollment</li>
                <li>Complete all physical infrastructure</li>
                <li>Expand staffing to support growing membership</li>
                <li>Refine credit redemption and reservation systems</li>
                <li>Develop member event calendar and exclusive experiences</li>
                <li>Begin marketing to potential members beyond existing customer base</li>
              </ul>

              <h3>Conclusion</h3>
              <p>
                The Winner's Circle Club represents a significant opportunity for Milea to enhance its membership program, create distinctive competitive advantage, and substantially increase revenue. By offering a premium credit-based tier above the existing Jumper, Grand Prix, and Triple Crown levels, Milea can better serve its most valuable customers while attracting new high-value members.
              </p>
              <p>
                The projected first-year revenue impact of $612,000 would represent an approximately 142% increase over the current annual club revenue of $432,000. While the implementation requires significant investment in infrastructure, technology, and staffing, the ongoing return on investment makes this a compelling strategic initiative.
              </p>
              <p>
                The combination of increased direct revenue, enhanced retention, and additional spending streams creates a powerful financial case for implementation. Beyond the numbers, the Winner's Circle would position Milea as a premier destination in the Hudson Valley wine region and create a foundation for continued growth and innovation in the member experience.
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