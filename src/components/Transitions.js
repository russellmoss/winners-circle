import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';
import { FaWineGlass } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Loading spinner component
export const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
    <div className="flex flex-col items-center">
      <div className="animate-pulse mb-4">
        <FaWineGlass className="text-4xl text-primary-600" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-16 w-16 relative"
      >
        <div className="absolute h-full w-full border-4 border-primary-200 rounded-full"></div>
        <motion.div 
          className="absolute h-full w-full border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </motion.div>
      <motion.p 
        className="mt-4 text-darkBrown font-medium text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
    </div>
  </div>
);

// Auth loading spinner with wine theme
export const AuthLoadingSpinner = ({ text = "Authenticating..." }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background to-gray-200 z-50">
    <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center max-w-md w-full">
      <div className="mb-6">
        <FaWineGlass className="text-5xl text-primary-600" />
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, repeat: Infinity }}
        className="h-2 bg-primary-600 rounded-full mb-6 w-full"
      ></motion.div>
      <motion.p 
        className="text-darkBrown font-medium text-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
      <p className="text-gray-500 mt-2 text-center text-sm">
        Accessing Winner's Circle Club Analysis
      </p>
    </div>
  </div>
);

// Page transition wrapper
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };
  
  // Page transition options
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Loading overlay for data fetching
export const LoadingOverlay = ({ isLoading, text = "Loading data..." }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-darkBrown bg-opacity-30 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="mr-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"
              ></motion.div>
            </div>
            <p className="text-darkBrown font-medium">{text}</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Section transition for scrolling within the page
export const SectionTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

// Protected route with transitions
export const ProtectedRoute = ({ children }) => {
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
    return <AuthLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Navigate to="/login" />
      </motion.div>
    );
  }

  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
};

export default PageTransition; 