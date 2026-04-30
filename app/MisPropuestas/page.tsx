"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';

export default function MisPropuestasPage() {
  const [misTareas, setMisTareas] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. ESCUCHAR ESTADO DE USUARIO Y FIRESTORE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Consultamos las propuestas donde el autorEmail coincida con el usuario actual
        const q = query(
          collection(db, "proposals"), 
          where("autorEmail", "==", currentUser.email)
        );

        const unsubFirestore = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }));
          setMisTareas(docs);
          setLoading(false);
        });

        return () => unsubFirestore();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. FUNCIÓN PARA ELIMINAR
  const eliminarPropuesta = async (id: string) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar esta propuesta?");
    if (confirmar) {
      try {
        await deleteDoc(doc(db, "proposals", id));
        alert("Propuesta eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar la propuesta");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] p-6 relative font-sans text-gray-800">
      
      {/* Botón Volver */}
      <Link 
        href="/Dashboard" 
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#0A5EB0] hover:bg-[#0A5EB0] hover:text-white transition-all font-bold text-xl"
      >
        ←
      </Link>

      <div className="w-full max-w-2xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] rounded-[3rem] shadow-2xl flex flex-col items-center p-10 relative overflow-hidden border-8 border-white/20">
        
        {/* Foto de Perfil (Gmail o Fallback) */}
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
              alt="Perfil" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
        </div>

        <div className="text-center mb-8">
           <h2 className="text-white font-black text-2xl uppercase tracking-tighter">
             {user?.displayName || "Mi Perfil"}
           </h2>
           <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mt-1">
             {misTareas.length} Propuestas Publicadas
           </p>
        </div>

        {/* LISTA DINÁMICA */}
        <div className="w-full space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="text-white text-center font-bold animate-pulse">CARGANDO...</div>
          ) : misTareas.length > 0 ? (
            misTareas.map((tarea) => (
              <div 
                key={tarea.id} 
                className="bg-[#0A5EB0]/90 backdrop-blur-md text-white flex items-center justify-between px-6 py-5 rounded-2xl shadow-lg border border-white/10"
              >
                <div className="flex flex-col flex-1 truncate pr-4">
                  {/* TÍTULO REAL DE FIRESTORE */}
                  <span className="font-black text-sm uppercase tracking-widest truncate">
                    {tarea.titulo || "Sin Título"}
                  </span>
                  {/* TECNOLOGÍA REAL DE FIRESTORE */}
                  <span className="text-[10px] text-cyan-200 font-bold uppercase italic mt-1">
                    {tarea.tecnologias || "Tecnología no especificada"}
                  </span>
                </div>
                
                {/* BOTÓN ELIMINAR */}
                <button 
                  onClick={() => eliminarPropuesta(tarea.id)}
                  className="w-10 h-10 bg-white/10 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-all group"
                  title="Eliminar propuesta"
                >
                  <span className="group-hover:scale-110 transition-transform">🗑️</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white/10 rounded-3xl border border-dashed border-white/20">
              <p className="text-white/60 font-bold text-sm uppercase">No tienes propuestas todavía</p>
              <Link href="/Publicar" className="text-white underline text-xs mt-2 block">¡Publica la primera aquí!</Link>
            </div>
          )}
        </div>

        <span className="mt-8 text-white/40 text-[9px] font-black uppercase tracking-[0.5em]">
          CodeDealer System 2026
        </span>
      </div>
    </main>
  );
}