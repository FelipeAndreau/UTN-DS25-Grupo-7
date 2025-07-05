const API_URL = 'https://localhost:5001/api';

export interface Car {
    id?: number;
    make: string;
    model: string;
    year: number;
    price: number;
    description: string;
    imageUrl?: string;
    isAvailable: boolean;
}

const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {})
    };
    const response = await fetch(input, { ...init, headers, credentials: 'include' });
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        throw new Error('Unauthorized');
    }
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return response;
};

export const carService = {
    getAllCars: async (): Promise<Car[]> => {
        const res = await fetchWithAuth(`${API_URL}/cars`);
        return res.json();
    },

    getCarById: async (id: number): Promise<Car> => {
        const res = await fetchWithAuth(`${API_URL}/cars/${id}`);
        return res.json();
    },

    createCar: async (car: Car): Promise<Car> => {
        const res = await fetchWithAuth(`${API_URL}/cars`, {
            method: 'POST',
            body: JSON.stringify(car)
        });
        return res.json();
    },

    searchCars: async (query: string): Promise<Car[]> => {
        const res = await fetchWithAuth(`${API_URL}/cars/search?query=${encodeURIComponent(query)}`);
        return res.json();
    }
};
