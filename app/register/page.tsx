"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importamos la función específica para registrar nuevos usuarios
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; 

export default function RegisterPage() {
  const router = useRouter();

  // 1. ESTADOS PARA GUARDAR LOS DATOS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. FUNCIÓN PARA CREAR LA CUENTA EN FIREBASE
  const handleRegister = async () => {
    setError(""); // Limpiamos errores previos
    
    if (!email || !password) {
      setError("Por favor, llena ambos campos.");
      return;
    }

    try {
      // Le pedimos a Firebase que cree el usuario
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("¡Usuario creado con éxito!", result.user.email);
      
      // Si se crea correctamente, lo mandamos al Dashboard
      router.push('/Dashboard'); 
    } catch (err: any) {
      // errores más comunes de Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError("Ese correo ya está registrado.");
      } else if (err.code === 'auth/weak-password') {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Error al crear la cuenta.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      
      {/* Botón de regreso (Flecha) - Vuelve al Login */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl hover:bg-gray-100 transition-colors"
      >
        &lt;
      </Link>

      {/* Contenedor principal*/}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full max-w-7xl">
        
        {/* Logo Gigante C */}
        <div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0A5EB0] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[200px] md:text-[350px] font-bold leading-none" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            C
          </span>
        </div>

        {/* Formulario Blanco */}
        <div className="w-full md:w-[420px] h-[400px] md:h-[700px] bg-white p-10 rounded-xl shadow-sm shrink-0 flex flex-col pt-16 md:pt-24">
          <div className="space-y-6">
            
            {/* Mostrar mensaje de error si algo falla */}
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            {/* Campo Email */}
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0A5EB0] focus:ring-1 focus:ring-[#0A5EB0]"
              />
            </div>

            {/* Campo Password */}
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">
                Password
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0A5EB0] focus:ring-1 focus:ring-[#0A5EB0]"
              />
            </div>

            {/* Checkbox Remember me */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 text-[#0A5EB0] border-gray-300 rounded focus:ring-[#0A5EB0] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-bold text-[#0A5EB0] cursor-pointer">
                Remember me
              </label>
            </div>

            {/* === BOTÓN REGISTER CORREGIDO === */}
            <div className="pt-6">
              <button 
                onClick={handleRegister}
                className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors"
              >
                Register
              </button>
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}