"use client";
import { useState } from 'react';
import { db } from '../../firebase'; // Tu archivo de configuración
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function PublicarPage() {
  const [titulo, setTitulo] = useState("");
  const [tecnologias, setTecnologias] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublicar = async () => {
    if (!titulo || !tecnologias || !descripcion) return alert("Llena todos los campos");
    
    setLoading(true);
    try {
      // Esta línea es la magia: crea un documento nuevo automáticamente
      await addDoc(collection(db, "proposals"), {
        titulo: titulo,
        tecnologias: tecnologias,
        descripcion: descripcion,
        fecha: new Date().toISOString()
      });

      alert("¡Propuesta publicada con éxito!");
      setTitulo(""); setTecnologias(""); setDescripcion("");
    } catch (error) {
      console.error("Error al publicar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border-t-8 border-[#0A5EB0]">
        <h1 className="text-2xl font-bold text-[#0A5EB0] mb-6">Publicar mi Perfil</h1>
        
        <div className="space-y-4">
          <input 
            placeholder="Título (Ej: Dev Python)" 
            className="w-full p-3 border rounded-lg"
            value={titulo} onChange={(e) => setTitulo(e.target.value)}
          />
          <input 
            placeholder="Tecnologías (Ej: React, Node)" 
            className="w-full p-3 border rounded-lg"
            value={tecnologias} onChange={(e) => setTecnologias(e.target.value)}
          />
          <textarea 
            placeholder="Descripción corta de tu trabajo" 
            className="w-full p-3 border rounded-lg h-32"
            value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
          />
          
          <button 
            onClick={handlePublicar}
            disabled={loading}
            className="w-full bg-[#0A5EB0] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Publicando..." : "Subir Propuesta"}
          </button>
        </div>
        
        <Link href="/Dashboard" className="block text-center mt-4 text-gray-500 text-sm underline">Volver al inicio</Link>
      </div>
    </main>
  );
}