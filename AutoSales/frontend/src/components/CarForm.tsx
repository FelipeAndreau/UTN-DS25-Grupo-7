import { useState } from 'react';

interface CarFormProps {
    onCarAdded: () => void;
}

export const CarForm = ({ onCarAdded }: CarFormProps) => {
    const [car, setCar] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        isAvailable: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Car added locally!');
        onCarAdded();
        setCar({
            make: '',
            model: '',
            year: new Date().getFullYear(),
            price: 0,
            description: '',
            isAvailable: true
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Make:</label>
                <input
                    type="text"
                    value={car.make}
                    onChange={(e) => setCar({ ...car, make: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Model:</label>
                <input
                    type="text"
                    value={car.model}
                    onChange={(e) => setCar({ ...car, model: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Year:</label>
                <input
                    type="number"
                    value={car.year}
                    onChange={(e) => setCar({ ...car, year: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price:</label>
                <input
                    type="number"
                    value={car.price}
                    onChange={(e) => setCar({ ...car, price: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Add Car
            </button>
        </form>
    );
};