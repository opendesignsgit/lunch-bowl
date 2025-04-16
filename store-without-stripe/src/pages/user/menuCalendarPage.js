import React from 'react';
import MenuCalendar from '../../components/MenuCalendar/MenuCalendar';

const MenuCalendarPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] bg-white shadow-lg rounded-xl overflow-hidden">
        <MenuCalendar />
      </div>
    </div>
  );
};

export default MenuCalendarPage;
