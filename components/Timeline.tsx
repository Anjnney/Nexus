
import React from 'react';
import { EVENTS } from '../constants';
import { CheckCircle2, Clock } from 'lucide-react';

export const Timeline: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-product font-bold text-gray-900 mb-2">TechSprint Roadmap</h2>
        <p className="text-gray-500">Stay on track with key dates and milestones.</p>
      </div>

      <div className="space-y-4">
        {EVENTS.map((event, index) => (
          <div 
            key={index} 
            className={`flex items-stretch bg-white rounded-2xl border ${
              event.isCompleted ? 'border-green-100 bg-green-50/20' : 'border-gray-100'
            } shadow-sm overflow-hidden transition-all hover:shadow-md`}
          >
            <div className={`w-24 flex flex-col items-center justify-center border-r p-4 ${
              event.isCompleted ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
            }`}>
              <span className="text-xl font-bold">{event.date.split(' ')[0]}</span>
              <span className="text-xs uppercase font-bold tracking-tighter">{event.date.split(' ')[1]}</span>
            </div>
            
            <div className="flex-1 p-6 flex items-center justify-between">
              <div>
                <h4 className={`text-lg font-bold ${event.isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                  {event.title}
                </h4>
                <p className="text-gray-500">{event.description}</p>
              </div>
              
              <div>
                {event.isCompleted ? (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>Upcoming</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
