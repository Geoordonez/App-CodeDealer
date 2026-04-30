"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Para leer el ID del usuario
import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import Link from 'next/link';

export default function ChatIAPage() {
  const searchParams = useSearchParams();
  const consultandoA = searchParams.get('consultandoA'); // ID del usuario del chat anterior
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy CodeDealer AI. Estoy analizando las propuestas para ayudarte.' }
  ]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);

    try {
      // 1. Cargamos TODAS las propuestas para contexto general
      const querySnapshot = await getDocs(collection(db, "proposals"));
      const todasLasPropuestas = querySnapshot.docs.map(doc => doc.data());

      // 2. Si venimos de un chat, buscamos info específica de ESE usuario
      let infoExtra = "";
      if (consultandoA) {
        const pEspecíficas = todasLasPropuestas.filter((p: any) => p.autorEmail === consultandoA);
        infoExtra = `Actualmente el usuario está interesado en el programador con email: ${consultandoA}. 
                     Sus propuestas son: ${JSON.stringify(pEspecíficas)}.`;
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // Sugerencia: Usa 1.5 flash, es el estándar estable
        systemInstruction: `
          Eres 'CodeDealer AI'. Tu única fuente de verdad es esta lista de propuestas: ${todasLasPropuestas}.
        Eres 'CodeDealer AI', un asistente virtual experto en programación y desarrollo de software.
                Tus respuestas deben ser amables, directas y en español.
                Si te preguntan cosas que no tienen nada que ver con programación o tecnología, 
                responde cortésmente que tu especialidad es el código y no puedes ayudar con otros temas.
                adicionalmente tu trabajo principal, las parsonas o programadores van a intentar 
                buscar propuestas, tu vas a ser la herramienta que acturara como un buscador entre las propuetas
                es decir, si yo te digo que quiero programadores que sepa python, tu buscaras las propuestas 
                existentes y me las recomendaras.
        REGLAS CRÍTICAS:
        
          1.Si el usuario pregunta qué propuestas hay, menciona SOLO lo que está en la lista (ejemplo: "codigo python").
          2. Si la lista está vacía o no hay nada que coincida, di: "No tengo programadores con ese perfil en mi base de datos actual".
          3. PROHIBIDO inventar nombres de tecnologías o perfiles que no estén en el texto proporcionado.
          4. Si no hay datos del usuario '${consultandoA}', indícalo amablemente.
        `
      });

      const result = await model.generateContent([userText]); 
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'ai', text: response.text() }]);
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Lo siento, tuve un problema con la base de datos." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      {/* Botón para volver al chat donde estabas */}
      <Link 
        href={consultandoA ? `/Chat/${consultandoA}` : "/Chats"} 
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 font-bold"
      >
        ←
      </Link>

      <div className="w-full max-w-5xl h-[750px] bg-white rounded-[2.5rem] shadow-2xl p-4 flex flex-col border-[6px] border-[#A855F7]">
        <div className="p-4 border-b border-gray-100 text-center">
          <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">
            Modo Asistente {consultandoA ? `| Analizando a: ${consultandoA}` : ""}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-4 p-8 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? "self-end bg-[#A855F7] text-white rounded-tr-none" 
              : "self-start bg-gray-100 text-gray-800 rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="p-6">
          <div className="flex gap-2 bg-gray-100 rounded-full px-6 py-2 items-center">
            <input 
              className="bg-transparent flex-1 outline-none text-sm p-2"
              placeholder="Pregúntame sobre este programador..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="text-purple-600 font-bold uppercase text-xs">Enviar</button>
          </div>
        </div>
      </div>
    </main>
  );
}