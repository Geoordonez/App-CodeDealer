"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc,
  getDoc,
  where,
  or

} from "firebase/firestore";
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function SingleChatPage() {
  const { id } = useParams(); // El ID del usuario con el que chateas
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [nombreDestinatario, setNombreDestinatario] = useState("Cargando...");
  const scrollRef = useRef<HTMLDivElement>(null);


  // --- Buscar el nombre del usuario con el que chateas ---
  useEffect(() => {
    const buscarNombre = async () => {
      if (!id) return;
      try {
        // Apuntamos al documento de este ID en la colección "users"
        const userRef = doc(db, "users", id as string);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Si lo encontramos, guardamos su nombre
          setNombreDestinatario(userSnap.data().name || "Usuario Desconocido");
        } else {
          setNombreDestinatario("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error obteniendo el nombre:", error);
        setNombreDestinatario("Error");
      }
    };

    buscarNombre();
  }, [id]);


  // 1. Verificar Usuario
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // 2. Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!currentUser || !id) return;

    // Buscamos mensajes donde (yo soy emisor y el otro receptor) O (al revés)
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((m: any) => 
          (m.senderId === currentUser.uid && m.receiverId === id) ||
          (m.senderId === id && m.receiverId === currentUser.uid)
        );
      setMensajes(data);
      // Scroll automático al final
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [currentUser, id]);

  // 3. Enviar Mensaje
  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !currentUser) return;

    await addDoc(collection(db, "messages"), {
      text: nuevoMensaje,
      senderId: currentUser.uid,
      receiverId: id,
      createdAt: serverTimestamp(),
    });

    setNuevoMensaje("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] p-6 relative font-sans">
      
      {/* Regresar */}
      <Link href="/Chats" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 font-bold text-xl hover:bg-gray-100 transition-all">
        ←
      </Link>

      {/* Botón IA */}
      <Link href="/chatIA" className="absolute top-6 right-6 flex items-center justify-center gap-2 bg-[#A855F7] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-purple-600 hover:scale-105 transition-all">
        Consultar IA 🤖
      </Link>

      <div className="w-full max-w-4xl h-[750px] bg-white rounded-[3rem] shadow-2xl relative flex flex-col border-[6px] border-[#A855F7] overflow-hidden">
        
        {/* Cabecera del Chat */}
        <div className="p-6 border-b bg-gray-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">
            {id?.toString().substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chateando con</p>
            <p className="text-sm font-bold text-gray-700">{nombreDestinatario}</p>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto bg-gray-50/50">
          {mensajes.map((m) => (
            <div 
              key={m.id} 
              className={`max-w-[70%] p-4 text-sm font-medium ${
                m.senderId === currentUser?.uid 
                ? "self-end bg-[#A855F7] text-white rounded-l-2xl rounded-tr-2xl shadow-md" 
                : "self-start bg-white text-gray-700 rounded-r-2xl rounded-tl-2xl shadow-sm border border-gray-200"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input de mensaje */}
        <form onSubmit={enviarMensaje} className="p-6 bg-white">
          <div className="w-full bg-gray-100 rounded-2xl py-3 px-6 flex items-center gap-3 border-2 border-transparent focus-within:border-purple-400 transition-all">
            <button type="button" className="text-purple-500 text-2xl font-bold">+</button>
            <input 
              type="text" 
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..." 
              className="bg-transparent w-full focus:outline-none text-gray-700 text-sm font-medium" 
            />
            <button type="submit" className="bg-[#A855F7] text-white p-2 rounded-xl hover:scale-110 transition-transform">
              ➤
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}