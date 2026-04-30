"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, auth } from "@/firebase"; // Importamos auth
import { onAuthStateChanged } from 'firebase/auth';

export default function ChatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 1. OBTENER EL USUARIO LOGUEADO
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // 2. CARGAR USUARIOS REALES DESDE FIRESTORE
  useEffect(() => {
    const q = query(collection(db, "users")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(docs);
    });
    return () => unsubscribe();
  }, []);

  // 3. FILTRAR POR BUSCADOR
  const filteredUsers = usuarios.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] p-6 relative font-sans">
      <Link href="/Dashboard" className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-black transition-all">
        &larr;
      </Link>

      <div className="w-full max-w-2xl h-[750px] bg-white rounded-[3rem] shadow-2xl p-8 flex flex-col border border-gray-100">
        <h1 className="text-center font-black text-gray-300 mb-8 tracking-[0.3em] text-xl">MENSAJES</h1>
        
        <div className="relative w-full mb-8">
          <input 
            type="text" 
            placeholder="Buscar contacto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-12 text-sm focus:ring-2 ring-blue-400 focus:bg-white outline-none transition-all" 
          />
          <span className="absolute left-4 top-3.5 opacity-30">🔍</span>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          
          {!searchTerm && (
            <Link href="/chatIA" className="group w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-3xl flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl animate-pulse">🤖</div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">CodeDealer AI</span>
                <span className="text-purple-100 text-[10px]">Asistente inteligente</span>
              </div>
            </Link>
          )}

          <div className="h-[1px] bg-gray-100 my-2" />

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              // LÓGICA: ¿Este usuario soy yo mismo?
              const esYo = currentUser?.uid === user.id || currentUser?.email === user.email;

              return esYo ? (
                // SI SOY YO: Mostramos una versión bloqueada o simplemente no la mostramos
                <div 
                  key={user.id} 
                  className="w-full bg-gray-50 border border-dashed border-gray-200 p-3 rounded-2xl flex items-center gap-4 opacity-50 cursor-not-allowed"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden grayscale">
                    <img src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="User" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-gray-500 font-bold text-sm uppercase">{user.name} (Tú)</span>
                    <span className="text-gray-400 text-[10px]">No puedes chatear contigo mismo</span>
                  </div>
                </div>
              ) : (
                // SI ES OTRO CLIENTE: Link normal al chat
                <Link 
                  href={`/Chat/${user.id}`} 
                  key={user.id} 
                  className="w-full bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-4 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-all">
                    <img src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="User" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-gray-800 font-bold text-sm uppercase tracking-tight">{user.name}</span>
                    <span className="text-gray-400 text-[10px]">Presiona para chatear</span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm italic">No se encontraron contactos...</div>
          )}
        </div>
      </div>
    </main>
  );
}