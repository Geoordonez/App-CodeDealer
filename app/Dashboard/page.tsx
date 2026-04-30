"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';

export default function DashboardPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const q = query(collection(db, "proposals"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProposals(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredProposals = proposals.filter(p => 
    p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tecnologias?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    signOut(auth).then(() => router.push('/'));
  };

  // Función para determinar qué foto mostrar
  const getProfileImage = () => {
    if (user?.photoURL) return user.photoURL; // Foto de Google
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`; // Foto fallback
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E5E5E5]">
      <div className="w-12 h-12 border-4 border-[#0A5EB0] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-[#0A5EB0] animate-pulse">CARGANDO CODEDEALER...</p>
    </div>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#D1D5DB] p-4 md:p-6 font-sans">
      
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 relative flex flex-col overflow-hidden border border-white">
        
        {/* HEADER: Perfil + Buscador */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          
          <div className="flex items-center gap-4 bg-gray-50 p-2 pr-6 rounded-2xl border border-gray-100">
            <Link href="/MisPropuestas" className="relative group">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md transition-transform group-hover:scale-105">
                <img 
                  src={getProfileImage()} 
                  alt="Perfil" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </Link>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bienvenido</span>
              <span className="text-gray-800 font-black text-sm leading-tight">
                {user?.displayName?.split(' ')[0] || "Developer"}
              </span>
            </div>
          </div>
          
          <div className="flex-1 w-full relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">🔍</span>
            <input 
              type="text" 
              placeholder="¿Qué tecnología buscas hoy?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-700 font-medium rounded-2xl py-4 pl-14 pr-6 border-2 border-transparent focus:border-[#0A5EB0] focus:bg-white focus:shadow-lg transition-all outline-none"
            />
          </div>

          <button 
            onClick={handleLogout} 
            className="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-black hover:bg-red-500 hover:text-white transition-all uppercase tracking-tighter"
          >
            Salir
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL CON BOTONES FLOTANTES */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          
          {/* LISTA DE TAREAS */}
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Propuestas Recientes</h2>
            
            <div className="grid grid-cols-1 gap-4 pb-10">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((task) => (
                  <Link 
                    href={`/VistaPropuesta/${task.id}`} 
                    key={task.id} 
                    className="group bg-white border border-gray-100 rounded-[2rem] p-5 flex items-center gap-6 shadow-sm hover:shadow-xl hover:border-[#4facfe] transition-all relative overflow-hidden"
                  >
                    {/* Barra de acento lateral */}
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-[#4facfe] to-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:rotate-3 transition-transform">
                      <span className="text-[#0A5EB0] text-xl font-black uppercase">
                        {task.tecnologias?.substring(0, 2)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-gray-800 text-lg group-hover:text-[#0A5EB0] transition-colors uppercase tracking-tight">
                          {task.titulo}
                        </h3>
                        <span className="text-[10px] bg-blue-50 text-[#0A5EB0] px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                          {task.tecnologias}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {task.descripcion}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale">
                  <span className="text-6xl mb-4">📂</span>
                  <p className="font-black uppercase tracking-widest text-sm">Sin resultados</p>
                </div>
              )}
            </div>
          </div>

          {/* BOTONES DE NAVEGACIÓN LATERAL */}
          <div className="flex flex-col gap-4">
            <Link href="/Publicar" className="w-16 h-16 bg-[#0A5EB0] rounded-2xl flex items-center justify-center shadow-lg text-white text-3xl hover:shadow-[0_10px_20px_rgba(10,94,176,0.3)] hover:-translate-y-1 active:scale-95 transition-all group">
              <span className="group-hover:rotate-90 transition-transform">+</span>
            </Link>
            <Link href="/Chats" className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-lg text-2xl hover:-translate-y-1 active:scale-95 transition-all">
              💬
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-[9px] text-gray-300 font-bold tracking-[0.3em] uppercase">
          <span>CodeDealer v1.0</span>
          <span>Guatemala 2026</span>
        </div>
      </div>
    </main>
  );
}