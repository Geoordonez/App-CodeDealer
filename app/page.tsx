"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importamos la función para loguear con correo y contraseña, además del popup de Google
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; 

export default function LoginPage() {
  const router = useRouter();

  // 1. ESTADOS PARA GUARDAR LO QUE ESCRIBE EL USUARIO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 2. FUNCIÓN PARA EL LOGIN NORMAL (CORREO Y CONTRASEÑA)
  const handleEmailLogin = async () => {
    setError(""); // Limpiamos errores previos
    if (!email || !password) {
      setError("Por favor, llena ambos campos.");
      return;
    }

    try {
      // Intentamos loguear al usuario en Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("¡Logueado correctamente con correo!", result.user.email);
      
      // Solo si el login es exitoso, lo mandamos al Dashboard
      router.push('/Dashboard'); 
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  // 3. FUNCIÓN PARA EL LOGIN CON GOOGLE
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("¡Logueado con éxito con Google!", result.user.displayName);
      router.push('/Dashboard'); 
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6">
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
        
        {/* Logo Gigante C */}
        <div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0A5EB0] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[200px] md:text-[350px] font-bold leading-none" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            C
          </span>
        </div>

        {/* Formulario Blanco */}
        <div className="w-full md:w-[420px] h-[300px] md:h-[700px] bg-white p-10 rounded-xl shadow-sm shrink-0 flex flex-col justify-center">
          <div className="space-y-6">
            
            {/* Mostrar mensaje de error si las credenciales fallan */}
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
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0A5EB0] focus:ring-1 focus:ring-[#0A5EB0]"
              />
            </div>

            <div className="space-y-4 pt-2 flex flex-col">
              
              {/* === BOTÓN SIGN IN CORREGIDO === */}
              {/* Ya no usa <Link>, ahora ejecuta handleEmailLogin */}
              <button 
                onClick={handleEmailLogin}
                className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors"
              >
                Sign In
              </button>
              
              {/* Link al Registro (Ese lo dejamos como Link por ahora como pediste) */}
              <Link href="/register" className="w-full">
                <button className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors">
                  Register
                </button>
              </Link>

              {/* BOTÓN DE GOOGLE */}
              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="w-full bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 font-bold py-3.5 rounded-md transition-colors flex items-center justify-center gap-3"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                Continuar con Google
              </button>

            </div>

            <div className="pt-4">
              <a href="#" className="text-sm text-[#0A5EB0] hover:underline font-bold">
                Forgot password?
              </a>
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}