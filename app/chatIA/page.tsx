"use client";
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Link from 'next/link';

export default function SingleChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy Gemini. ¿En qué puedo ayudarte con CodeDealer?' }
  ]);
  const [loading, setLoading] = useState(false);

  // Conexión con tu API Key del archivo .env.local
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

  const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userText = input;
  const newMessages = [...messages, { role: 'user', text: userText }];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    // 1. IMPORTANTE: Verificamos que traiga los datos de 'proposals'
    const querySnapshot = await getDocs(collection(db, "proposals"));
    const propuestasDB = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Imprime esto en tu consola (F12) para que tú mismo veas si llegan los datos
    console.log("Datos cargados de Firestore:", propuestasDB);

    const contextoPropuestas = JSON.stringify(propuestasDB);

    // 2. CONFIGURACIÓN DEL MODELO
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
        Eres 'CodeDealer AI'. Tu única fuente de verdad es esta lista de propuestas: ${contextoPropuestas}.
        Eres 'CodeDealer AI', un asistente virtual experto en programación y desarrollo de software.
                Tus respuestas deben ser amables, directas y en español.
                Si te preguntan cosas que no tienen nada que ver con programación o tecnología, 
                responde cortésmente que tu especialidad es el código y no puedes ayudar con otros temas.
                adicionalmente tu trabajo principal, las parsonas o programadores van a intentar 
                buscar propuestas, tu vas a ser la herramienta que acturara como un buscador entre las propuetas
                es decir, si yo te digo que quiero programadores que sepa python, tu buscaras las propuestas 
                existentes y me las recomendaras.
        REGLAS CRÍTICAS:
        1. Si el usuario pregunta qué propuestas hay, menciona SOLO lo que está en la lista (ejemplo: "codigo python").
        2. Si la lista está vacía o no hay nada que coincida, di: "No tengo programadores con ese perfil en mi base de datos actual".
        3. PROHIBIDO inventar nombres de tecnologías o perfiles que no estén en el texto proporcionado.
      `
    });
    
    // 3. ENVIAR EL MENSAJE (Sin historial para probar que lea bien el contexto primero)
    // A veces el historial viejo confunde a la IA, probemos enviando el contexto fresco
    const result = await model.generateContent([userText]); 
    const response = await result.response;
    const text = response.text();
    
    setMessages(prev => [...prev, { role: 'ai', text: text }]);
  } catch (error) {
    console.error("Error detallado:", error);
    setMessages(prev => [...prev, { role: 'ai', text: "Hubo un error al leer la base de datos." }]);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      <Link href="/Chat" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl">&lt;</Link>

      <div className="w-full max-w-5xl h-[750px] bg-white rounded-[2.5rem] shadow-sm p-4 relative flex flex-col border-[6px] border-[#A855F7]">
        
        {/* Área de mensajes DINÁMICA */}
        <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`max-w-[80%] p-4 shadow-sm ${
                msg.role === 'user' 
                ? "self-end bg-[#0A5EB0] text-white rounded-l-full rounded-tr-full" 
                : "self-start bg-gray-200 text-gray-800 rounded-r-full rounded-tl-full"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-xs text-purple-500 animate-pulse ml-4">Gemini está pensando...</p>}
        </div>

        {/* Input de mensaje */}
        <div className="p-6">
          <div className="w-full bg-gray-200 rounded-full py-4 px-8 flex items-center gap-3">
            <span className="text-blue-500 text-xl font-bold">+</span>
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              className="bg-transparent w-full focus:outline-none text-gray-600 italic text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading} className="text-[#0A5EB0] font-bold">
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}