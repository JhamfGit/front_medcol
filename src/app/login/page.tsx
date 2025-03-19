// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementaremos la lógica de autenticación
    // Por ahora, solo redirigimos al dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo - Formulario de login */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-1">LOGIN</h1>
          <p className="text-center text-gray-500 mb-8">Por favor, ingresa tus credenciales</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Iniciar Sesion
            </button>
          </form>
        </div>
      </div>
      
      {/* Lado derecho - Imagen y mensaje de bienvenida */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-600 bg-opacity-90 flex items-center justify-center">
          <div className="text-white text-center p-8 max-w-md">
            <div className="bg-blue-500 bg-opacity-70 p-8 rounded-3xl mb-8">
              <h2 className="text-3xl font-bold mb-2">Bienvenido a</h2>
              <h1 className="text-4xl font-bold mb-6">MEDCOL DOCS</h1>
              
              <div className="flex justify-center">
                <Image
                  src="/medicamentos.jpg"
                  alt="Images"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>
            
            <div className="bg-yellow-300 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
