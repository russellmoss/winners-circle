import React from 'react';
import { motion } from 'framer-motion';
import { FaWineGlass, FaGem, FaCreditCard, FaList, FaKey, FaBuilding, FaStar, FaUser, FaClock, FaLock, FaCalendarAlt } from 'react-icons/fa';
import styles from './WinnersCircleSummary.module.css';

const WinnersCircleSummary = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 sm:mb-12"
    >
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${styles.container}`}>
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r from-darkBrown to-primary-800 px-4 sm:px-6 py-6 sm:py-8 text-white ${styles.header}`}>
          <div className="flex items-center mb-3 sm:mb-4">
            <FaWineGlass className="text-2xl sm:text-3xl mr-3 sm:mr-4" />
            <h2 className="text-2xl sm:text-3xl font-gilda font-bold">Winner's Circle Club Summary</h2>
          </div>
          <p className={`text-lg sm:text-xl opacity-90 leading-relaxed text-white ${styles.summaryQuote}`}>
            The Winner's Circle Club represents Milea Estate Vineyard's ultra-premium membership tier, designed to transform the traditional wine club experience into a comprehensive lifestyle proposition.
          </p>
        </div>
        
        {/* Main content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Core Concept */}
          <div className="mb-6 sm:mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center mb-3 sm:mb-4"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3 sm:mr-4 ${styles.iconWrapper}`}>
                <FaGem className="text-primary-600 text-lg sm:text-xl" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold text-darkBrown ${styles.sectionTitle}`}>Core Concept</h3>
            </motion.div>
            <div className="pl-12 sm:pl-16">
              <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                The Winner's Circle operates on a flexible credit-based model rather than a traditional wine allocation system. Members pay $500 quarterly ($2,000 annually), which is converted to an equivalent credit balance that can be used across the entire Milea ecosystem.
              </p>
            </div>
          </div>
          
          {/* Key Features */}
          <div className="mb-6 sm:mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center mb-4 sm:mb-6"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3 sm:mr-4 ${styles.iconWrapper}`}>
                <FaStar className="text-primary-600 text-lg sm:text-xl" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold text-darkBrown ${styles.sectionTitle}`}>Key Features</h3>
            </motion.div>
            
            <div className="pl-12 sm:pl-16 space-y-4 sm:space-y-6">
              {/* Credit-Based Flexibility */}
              <div className={`bg-gray-50 rounded-lg p-4 sm:p-5 border-l-4 border-primary-500 ${styles.featureCard}`}>
                <div className="flex items-start">
                  <FaCreditCard className={`text-primary-600 text-lg sm:text-xl mt-1 mr-3 flex-shrink-0 ${styles.benefitIcon}`} />
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-darkBrown mb-2">Credit-Based Flexibility</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      Unlike allocation-based tiers where members receive predetermined wine selections, Winner's Circle members enjoy complete freedom to allocate their credits according to personal preferences.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Premium Positioning */}
              <div className={`bg-gray-50 rounded-lg p-4 sm:p-5 border-l-4 border-primary-500 ${styles.featureCard}`}>
                <div className="flex items-start">
                  <FaGem className={`text-primary-600 text-lg sm:text-xl mt-1 mr-3 flex-shrink-0 ${styles.benefitIcon}`} />
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-darkBrown mb-2">Premium Positioning</h4>
                    <p className="text-gray-700 text-sm sm:text-base">
                      The club sits atop Milea's existing membership hierarchy (above Jumper, Grand Prix, and Triple Crown tiers), providing a clear upgrade path for existing members.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Comprehensive Redemption Options */}
              <div className={`bg-gray-50 rounded-lg p-4 sm:p-5 border-l-4 border-primary-500 ${styles.featureCard}`}>
                <div className="flex items-start">
                  <FaList className={`text-primary-600 text-lg sm:text-xl mt-1 mr-3 flex-shrink-0 ${styles.benefitIcon}`} />
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-darkBrown mb-2">Comprehensive Redemption Options</h4>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">
                      Credits can be used for:
                    </p>
                    <ul className={`grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 ${styles.featureList}`}>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaWineGlass className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Wine purchases (current releases and library wines)</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaUser className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Culinary program (tapas menu and premium dinner series)</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaBuilding className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Luxury accommodations at Staatsburg House</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaWineGlass className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Merchandise and retail offerings</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaCalendarAlt className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Events and experiences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Exclusive Infrastructure Access */}
              <div className={`bg-gray-50 rounded-lg p-4 sm:p-5 border-l-4 border-primary-500 ${styles.featureCard}`}>
                <div className="flex items-start">
                  <FaKey className={`text-primary-600 text-lg sm:text-xl mt-1 mr-3 flex-shrink-0 ${styles.benefitIcon}`} />
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-darkBrown mb-2">Exclusive Infrastructure Access</h4>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">
                      Beyond credits, membership provides access to:
                    </p>
                    <ul className={`grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 ${styles.featureList}`}>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaBuilding className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Dedicated club lounge with vineyard views</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaLock className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Personal wine storage lockers</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaUser className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Recreational facilities (pools, tennis, bocce, and pickleball courts)</span>
                      </li>
                      <li className={`flex items-center bg-white p-2 sm:p-3 rounded shadow-sm ${styles.hoverCard}`}>
                        <FaKey className="text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Biometric access for extended-hours visitation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Member Benefits */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center mb-4 sm:mb-6"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center mr-3 sm:mr-4 ${styles.iconWrapper}`}>
                <FaUser className="text-primary-600 text-lg sm:text-xl" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold text-darkBrown ${styles.sectionTitle}`}>Member Benefits</h3>
            </motion.div>
            
            <div className="pl-12 sm:pl-16">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 ${styles.benefitsGrid}`}>
                <div className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 ${styles.benefitItem}`}>
                  <div className="flex items-start">
                    <div className={`bg-primary-100 p-2 sm:p-3 rounded-full mr-3 ${styles.iconWrapper}`}>
                      <FaGem className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-darkBrown mb-1 text-sm sm:text-base">Enhanced Value</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">20% discount on all purchases, not just wine. Inclusive of food and lodging.</p>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 ${styles.benefitItem}`}>
                  <div className="flex items-start">
                    <div className={`bg-primary-100 p-2 sm:p-3 rounded-full mr-3 ${styles.iconWrapper}`}>
                      <FaClock className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-darkBrown mb-1 text-sm sm:text-base">Extended Credit Validity</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">Credits remain valid until used.</p>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 ${styles.benefitItem}`}>
                  <div className="flex items-start">
                    <div className={`bg-primary-100 p-2 sm:p-3 rounded-full mr-3 ${styles.iconWrapper}`}>
                      <FaWineGlass className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-darkBrown mb-1 text-sm sm:text-base">Wine Storage Solution</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">Personal climate-controlled wine lockers with 24-bottle capacity.</p>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 ${styles.benefitItem}`}>
                  <div className="flex items-start">
                    <div className={`bg-primary-100 p-2 sm:p-3 rounded-full mr-3 ${styles.iconWrapper}`}>
                      <FaCalendarAlt className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-darkBrown mb-1 text-sm sm:text-base">Priority Access</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">First access to events, accommodations, and culinary experiences.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WinnersCircleSummary; 