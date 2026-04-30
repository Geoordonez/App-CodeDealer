"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Importamos updateProfile
import { auth, db } from '../../firebase'; // Importamos 'db'
import { doc, setDoc } from "firebase/firestore"; // Importamos funciones de Firestore

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Nuevo estado para el nombre
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    
    if (!email || !password || !name) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    try {
      // 1. Crear el usuario en Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 2. Actualizar el perfil de Auth con el nombre
      await updateProfile(user, {
        displayName: name
      });

      // 3. CREAR EL EXPEDIENTE EN FIRESTORE (Paso crucial)
      // Usamos el UID único como ID del documento
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`, // Foto inicial aleatoria
        role: "programador", // Rol inicial
        createdAt: new Date().toISOString()
      });

      console.log("¡Usuario y perfil creados con éxito!");
      router.push('/Dashboard'); 
    } catch (err: any) {
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
      <Link href="/" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl hover:bg-gray-100 transition-colors">
        &lt;
      </Link>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full max-w-7xl">
        <div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0A5EB0] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[200px] md:text-[350px] font-bold leading-none">C</span>
        </div>

        <div className="w-full md:w-[420px] bg-white p-10 rounded-xl shadow-sm shrink-0 flex flex-col">
          <div className="space-y-4">
            <h2 className="text-[#0A5EB0] font-black text-2xl text-center mb-4">CREAR CUENTA</h2>
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            {/* CAMPO NOMBRE (Añadido) */}
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">Nombre Completo</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 text-gray-800 focus:ring-1 focus:ring-[#0A5EB0] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">Email</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 text-gray-800 focus:ring-1 focus:ring-[#0A5EB0] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 text-gray-800 focus:ring-1 focus:ring-[#0A5EB0] outline-none"
              />
            </div>

            <button 
              onClick={handleRegister}
              className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-all mt-4"
            >
              Finalizar Registro
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}