import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarModalProps {
  onSelect: (date: string) => void;
  onClose: () => void;
  selected?: string | null;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ onSelect, onClose, selected }) => {
  const [value, setValue] = React.useState(selected ? new Date(selected) : new Date());

  const handleChange = (value: any) => {
    // Manejamos los diferentes tipos que puede devolver react-calendar
    if (value instanceof Date) {
      setValue(value);
      onSelect(value.toISOString().split('T')[0]);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setValue(value[0]);
      onSelect(value[0].toISOString().split('T')[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <Calendar
          onChange={handleChange}
          value={value}
          locale="es-AR"
        />
      </div>
    </div>
  );
};

export default CalendarModal;
