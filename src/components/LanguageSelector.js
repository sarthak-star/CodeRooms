import React, { useState } from 'react';
import { LANGUAGE_VERSIONS } from "../constants";
import { FaPlay } from "react-icons/fa";
import {Tooltip} from 'react-tooltip';

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ runCode, language, onSelect, setUserFontSize, userFontSize }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sizeMenu, setsizeMenu] = useState(false);

  const handleSelect = (lang) => {
    onSelect(lang);
    setMenuOpen(false);
  };

  const handleFontChange = (size) => {
    setUserFontSize(size);
    setsizeMenu(false);
  }

  return (
    <div className="py-4 px-3 flex justify-between items-center ">
      <div className="relative inline-block">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-4 py-1 text-lg font-semibold text-white rounded-lg  flex items-center bg-[#A41445]"
        >
          {language}
          <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M14 20l10 10 10-10z" fill='#fff' /><path d="M0 0h48v48h-48z" fill="none" /></svg>
        </button>
        {menuOpen && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-2">
            {languages.map(([lang, version]) => (
              <li
                key={lang}
                className={`px-4 py-2 hover:bg-gray-300 cursor-pointer ${lang === language ? 'text-blue-500 bg-gray-200' : ''
                  }`}
                onClick={() => handleSelect(lang)}
              >
                {lang}
                <span className="text-gray-600 text-sm"> ({version})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div onClick={runCode} >
        <FaPlay data-tooltip-id="my-tooltip" data-tooltip-content="Run Code" className='text-[#A41445] text-4xl cursor-pointer' />
        <Tooltip id="my-tooltip"/>
      </div>
      <div data-tooltip-id="font-size" data-tooltip-content="Change font size" className='relative inline-block' >
        <button
          onClick={() => setsizeMenu(!sizeMenu)}
          className="px-4 py-1 text-lg font-semibold text-white rounded-lg  flex items-center bg-slate-700"
        >
          {userFontSize}px
        </button>
        {sizeMenu && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded mt-2">
            <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer`} onClick={() => handleFontChange(12)}>12px</li>
            <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer`} onClick={() => handleFontChange(14)}>14px</li>
            <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer`} onClick={() => handleFontChange(16)}>16px</li>
            <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer`} onClick={() => handleFontChange(20)}>20px</li>
            <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer`} onClick={() => handleFontChange(22)}>22px</li>
            <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer`} onClick={() => handleFontChange(24)}>24px</li>
          </ul>
        )}
      </div>
      <Tooltip id="font-size"/>
    </div>
  );
};

export default LanguageSelector;
