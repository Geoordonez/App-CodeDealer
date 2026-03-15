import Link from 'next/link';

export default function PublicarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      <Link href="/Dashboard" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl">&lt;</Link>

      <div className="w-full max-w-4xl h-[600px] bg-gradient-to-b from-[#4facfe] to-[#00f2fe] rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-12 relative">
        <div className="w-full max-w-2xl text-center space-y-12">
          {/* Input de Título estilo Mockup */}
          <input 
            type="text" 
            placeholder="EDITAR TITULO" 
            className="w-full bg-transparent border-none text-center text-3xl md:text-5xl font-extrabold text-white placeholder:text-white/70 focus:outline-none uppercase tracking-widest"
          />
          
          {/* Botón Central */}
          <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-12 rounded-full border-2 border-white transition-all text-xl tracking-widest">
            EDITAR
          </button>
        </div>

        {/* Botón Publicar pequeño abajo a la derecha */}
        <button className="absolute bottom-8 right-10 bg-[#0A5EB0] text-white text-[10px] px-4 py-1 rounded-sm font-bold hover:bg-blue-900 transition-colors">
          PUBLICAR
        </button>
      </div>
    </main>
  );
}