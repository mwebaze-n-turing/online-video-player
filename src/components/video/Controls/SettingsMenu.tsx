'use client';

import React, { useState } from 'react';

const SettingsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="px-2 py-1 rounded hover:bg-white/10 transition">
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-40 bg-gray-800 text-white rounded shadow-lg z-50">
          <ul className="flex flex-col divide-y divide-gray-700">
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Quality</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Speed</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Subtitles</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
