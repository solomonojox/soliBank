import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="loader-container">
      {loading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <Dashboard /> // render the Dashboard component when loading is complete
      )}
    </div>
  );
}

export default Loader;