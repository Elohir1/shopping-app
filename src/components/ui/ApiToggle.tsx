import React from 'react';
import { API_CONFIG } from '../../api/config';

const ApiToggle = () => {
  // Show only in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-white rounded-lg shadow-lg border z-50">
      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-sm text-gray-600">Mock API</span>
        <input
          type="checkbox"
          checked={API_CONFIG.USE_MOCKS}
          onChange={(e) => {
            API_CONFIG.USE_MOCKS = e.target.checked;
            // Force reload to reset the app state
            window.location.reload();
          }}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
        </div>
      </label>
    </div>
  );
};

export default ApiToggle;