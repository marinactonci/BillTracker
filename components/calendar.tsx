"use client";

import React, { useState } from 'react';
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import { Button } from 'antd';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // October 2024
  const [events, setEvents] = useState([
    { date: new Date(2024, 9, 3), title: 'Design review', time: '10AM' },
    { date: new Date(2024, 9, 3), title: 'Sales meeting', time: '2PM' },
    { date: new Date(2024, 9, 7), title: 'Date night', time: '6PM' },
    { date: new Date(2024, 9, 5), title: "Sam's birthday party", time: '2PM' },
    { date: new Date(2024, 9, 22), title: 'Maple syrup museum', time: '3PM' },
    { date: new Date(2024, 9, 22), title: 'Hockey game', time: '7PM' },
    { date: new Date(2024, 9, 4), title: 'Cinema with friends', time: '9PM' },
  ]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const rows = [];
    let cells = [];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Adjust for Monday start
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Previous month's days
    const prevMonthDays = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      cells.push(
        <td key={`prev-${day}`} className="border border-gray-200 p-1 text-gray-400 align-top">
          <div className="h-full flex flex-col">
            <div className="font-semibold text-sm">{day}</div>
          </div>
        </td>
      );
    }

    // Current month's days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter(event =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
      );

      cells.push(
        <td key={day} className={`border h-32 border-gray-200 p-1 align-top ${isToday(date)? 'bg-blue-50' : ''}`}>
          <div className="h-full flex flex-col">
            <div className={`font-semibold text-sm ${isToday(date) ? 'text-blue-600' : ''}`}>{day}</div>
            <div className="flex-grow overflow-y-auto">
              {dayEvents.map((event, index) => (
                <div key={index} className="text-xs mt-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500">{event.time}</div>
                </div>
              ))}
            </div>
          </div>
        </td>
      );

      if (cells.length === 7) {
        rows.push(<tr key={day} className="h-24">{cells}</tr>);
        cells = [];
      }
    }

    // Next month's days
    const remainingCells = 7 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(
        <td key={`next-${i}`} className="border border-gray-200 p-1 text-gray-400 align-top">
          <div className="h-full flex flex-col">
            <div className="font-semibold text-sm">{i}</div>
          </div>
        </td>
      );
    }
    if (cells.length > 0) {
      rows.push(<tr key="last" className="h-24">{cells}</tr>);
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 py-2 border-b border-gray-200">
          <h2 className="text-xl font-bold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <div className="flex items-center space-x-2">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
              <CaretLeftFilled />
            </button>
            <button onClick={goToToday} className="px-3 py-1 border border-gray-300 rounded text-sm">Today</button>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
              <CaretRightFilled />
            </button>
            <Button type="primary" className="bg-blue-500">Add event</Button>
          </div>
        </div>
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <th key={day} className="border border-gray-200 p-1 text-left text-lg font-bold text-gray-500">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full h-screen p-4 bg-white">
      {renderCalendar()}
    </div>
  );
};

export default Calendar;