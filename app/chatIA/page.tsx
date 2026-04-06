"use client";
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Enviamos el mensaje de verdad
      const result = await model.generateContent(userText);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: text }]);
    } catch (error) {
      console.error("Error detallado:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error de conexión real con Gemini." }]);
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