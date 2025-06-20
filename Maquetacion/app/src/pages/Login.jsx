// src/components/Login.jsx
import { useState } from 'react';

export default function Login({ setUserRole }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
    // Hardcodeamos los accesos
    if (username === 'admin' && password === 'admin123') {
        setUserRole('admin');
    } else if (username === 'user' && password === 'user123') {
        setUserRole('user');
    } else {
        setError('Credenciales inválidas');
    }
};

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
            onSubmit={handleLogin}
            className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">AutoSales Login</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <label className="block mb-2 text-sm font-medium">Usuario</label>
            <input
                type="text"
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <label className="block mb-2 text-sm font-medium">Contraseña</label>
            <input
                type="password"
                className="w-full px-3 py-2 mb-6 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            > Iniciar sesión
            </button>
        </form>
    </div>
);
}