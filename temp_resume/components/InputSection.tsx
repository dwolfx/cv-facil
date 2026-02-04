
import React from 'react';

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export const InputSection: React.FC<Props> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <i className={`fas ${icon}`}></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};
