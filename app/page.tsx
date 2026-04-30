"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase'; // Importamos 'db'
import { doc, setDoc } from "firebase/firestore"; // Importamos funciones de Firestore

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- FUNCIÓN PARA GUARDAR O ACTUALIZAR EL USUARIO EN FIRESTORE ---
  const syncUserWithFirestore = async (user: any) => {
    try {
      // Usamos el UID de Authentication como ID del documento en Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName || "Usuario de CodeDealer",
        email: user.email,
        photo: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        role: "programador", // Rol por defecto
        lastLogin: new Date().toISOString()
      }, { merge: true }); // 'merge' para no borrar datos existentes
    } catch (e) {
      console.error("Error sincronizando usuario:", e);
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Por favor, llena ambos campos.");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Sincronizamos con Firestore antes de redirigir
      await syncUserWithFirestore(result.user);
      router.push('/Dashboard'); 
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Sincronizamos con Firestore antes de redirigir
      await syncUserWithFirestore(result.user);
      router.push('/Dashboard'); 
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  // ... El resto de tu código del return se queda igual ...
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6">
      {/* Tu código visual aquí se mantiene idéntico */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
        <div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0A5EB0] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[200px] md:text-[350px] font-bold leading-none">C</span>
        </div>
        <div className="w-full md:w-[420px] h-auto bg-white p-10 rounded-xl shadow-sm shrink-0 flex flex-col justify-center">
          <div className="space-y-6">
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md border border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md border border-gray-300" />
            </div>
            <div className="space-y-4 pt-2 flex flex-col">
              <button onClick={handleEmailLogin} className="w-full bg-[#0A5EB0] text-white font-bold py-3.5 rounded-md">Sign In</button>
              <Link href="/register" className="w-full"><button className="w-full bg-[#0A5EB0] text-white font-bold py-3.5 rounded-md">Register</button></Link>
              <button onClick={handleGoogleLogin} className="w-full border-2 border-gray-200 py-3.5 rounded-md flex items-center justify-center gap-3">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
                Continuar con Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}