"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function VistaPropuestaPage() {
  const { id } = useParams(); 
  const router = useRouter();
  
  const [tarea, setTarea] = useState<any>(null);
  const [autor, setAutor] = useState<any>(null); // Datos del perfil real del creador
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Detectar usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Obtener datos de la propuesta y su autor
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "proposals", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dataPropuesta = { id: docSnap.id, ...docSnap.data() } as any;
          setTarea(dataPropuesta);

          // Buscamos al autor en la colección 'users' para sacar su foto
          if (dataPropuesta.autorId) {
            const userRef = doc(db, "users", dataPropuesta.autorId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setAutor(userSnap.data());
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 3. LÓGICA DE REDIRECCIÓN (IGUAL QUE EN CHATSPAGE)
  const manejarContacto = () => {
    if (!currentUser || !tarea) return;

    // Aquí enviamos al ID de la cuenta del autor, EXACTAMENTE igual que el href={`/Chat/${user.id}`}
    router.push(`/Chat/${tarea.autorId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] font-black text-[#0A5EB0] animate-pulse uppercase tracking-widest">
      Cargando Propuesta...
    </div>
  );

  if (!tarea) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] font-black text-red-500 uppercase">
      Propuesta no encontrada
    </div>
  );

  // ¿Soy yo mismo el dueño de la propuesta?
  const esMia = currentUser?.uid === tarea.autorId || currentUser?.email === tarea.autorEmail;

  // LÓGICA DE FOTO DE PERFIL (Igual que en tu ChatsPage)
  const fotoPerfil = autor?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tarea.autorId}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] p-6 relative font-sans">
      
      {/* Botón de regreso */}
      <Link 
        href="/Dashboard" 
        className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-black transition-all"
      >
        &larr;
      </Link>

      <div className="w-full max-w-4xl h-[650px] bg-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden border border-gray-100">
        
        {/* Encabezado Visual */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-xl relative border border-white/20">
          
          <span className="absolute top-6 right-8 bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/30 backdrop-blur-md">
            {tarea.tecnologias}
          </span>

          {/* Avatar del Programador con la lógica unificada */}
          <div className="w-24 h-24 bg-white rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-transform hover:scale-105">
            <img 
              src={fotoPerfil} 
              alt="Avatar del creador" 
              className="w-full h-full object-cover" 
            />
          </div>

          <h1 className="text-white font-black text-2xl md:text-3xl tracking-tighter uppercase mb-4 leading-none">
            {tarea.titulo}
          </h1>

          <div className="w-full bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <p className="text-white text-sm md:text-base font-medium leading-relaxed italic opacity-90">
              "{tarea.descripcion}"
            </p>
          </div>
        </div>

        {/* Botón de contacto */}
        <div className="mt-12 w-full flex justify-center">
          {esMia ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 py-4 px-10 rounded-2xl flex flex-col items-center opacity-60">
              <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Publicado por ti</span>
              <span className="text-gray-300 text-[9px] font-bold">No puedes contactarte a ti mismo</span>
            </div>
          ) : (
            <button 
              onClick={manejarContacto}
              className="bg-[#0A5EB0] text-white text-xs font-black px-12 py-5 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-[0_15px_30px_rgba(10,94,176,0.2)] hover:-translate-y-1 active:scale-95 uppercase tracking-[0.2em] flex items-center gap-3"
            >
              <span>Hablar con Developer</span>
              <span className="text-lg">💬</span>
            </button>
          )}
        </div>

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] text-gray-300 font-bold uppercase tracking-[0.5em]">
          CodeDealer Secure Link v1.0
        </p>
        
      </div>
    </main>
  );
}