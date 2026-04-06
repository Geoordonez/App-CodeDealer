import Link from 'next/link';

export default function SingleChatPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      {/* Botón de regresar (Izquierda) */}
      <Link href="/Chats" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl">
        &lt;
      </Link>

      {/* NUEVO: Botón para ir al chat de la IA (Derecha) */}
      <Link href="/chatIA" className="absolute top-6 right-6 flex items-center justify-center gap-2 bg-[#A855F7] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-purple-600 hover:scale-105 transition-all">
        Consultar IA
      </Link>

      <div className="w-full max-w-5xl h-[750px] bg-white rounded-[2.5rem] shadow-sm p-4 relative flex flex-col border-[6px] border-[#A855F7]">
        
        {/* Área de mensajes */}
        <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto">
          {/* Mensaje Recibido */}
          <div className="self-start w-2/3 h-12 bg-gray-200 rounded-r-full rounded-tl-full"></div>
          {/* Mensaje Enviado */}
          <div className="self-end w-2/3 h-12 bg-gray-200 rounded-l-full rounded-tr-full"></div>
          <div className="self-end w-1/2 h-12 bg-gray-200 rounded-l-full rounded-tr-full"></div>
          
        </div>

        {/* Input de mensaje abajo */}
        <div className="p-6">
          <div className="w-full bg-gray-200 rounded-full py-4 px-8 flex items-center gap-3">
            <span className="text-blue-500 text-xl font-bold">+</span>
            <input type="text" placeholder="Escribe un mensaje..." className="bg-transparent w-full focus:outline-none text-gray-600 italic text-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}