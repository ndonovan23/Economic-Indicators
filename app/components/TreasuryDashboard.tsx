'use client';

import React, { useState, useEffect } from 'react';

interface YieldData {
  label: string;
  rate: string;
  date: string;
}

const TreasuryDashboard = () => {
  const [yields, setYields] = useState<YieldData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchYields = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/treasury');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received yields:', data);
      setYields(data.yields);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYields();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Treasury & Mortgage Rate Dashboard</h1>

      {/* Refresh Button */}
      <div className="mb-6">
        <button
          onClick={fetchYields}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Yields'}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {yields ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yields.map((item) => (
            <div key={item.label} className={`p-6 rounded-lg shadow-lg ${item.label === '30-Year Mortgage' ? 'bg-green-200' : 'bg-white'}`}>
              <h2 className="text-2xl font-semibold text-gray-700">{item.label}</h2>
              <p className="mt-2 text-gray-600">Rate: {item.rate}%</p>
              <p className="mt-1 text-gray-500 text-sm">As of: {item.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Loading yields...</p>
      )}
    </div>
  );
};

export default TreasuryDashboard;


