import Link from 'next/link';

export default function VistaPropuestaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      
      {/* Botón de regreso al Dashboard */}
      <Link 
        href="/Dashboard" 
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl hover:bg-gray-100 transition-colors"
      >
        &lt;
      </Link>

      {/* Tarjeta de Detalle */}
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
        
        {/* Contenedor azul central (como en tu mockup) */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-[#4facfe] to-[#00f2fe] rounded-[2rem] p-12 flex flex-col items-center text-center shadow-lg">
          
          {/* Avatar del que publica */}
          <div className="w-20 h-20 bg-white/30 rounded-full mb-6 flex items-center justify-center border-2 border-white overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Avatar" 
              className="w-16 h-16" 
            />
          </div>

          {/* Título de la tarea */}
          <h1 className="text-white font-extrabold text-2xl md:text-3xl tracking-widest uppercase mb-4">
            BUSCO PROGRAMADOR ESPECIALIZADO EN PYTHON
          </h1>

          {/* Descripción */}
          <p className="text-white/90 text-sm md:text-base font-medium tracking-wide leading-relaxed">
            especificación de la tarea...
          </p>
        </div>

        {/* Botón CONTACTAR abajo a la derecha */}
        <Link 
          href="/Chat"
          className="absolute bottom-10 right-10 bg-[#0A5EB0] text-white text-xs font-bold px-6 py-2 rounded-md hover:bg-blue-900 transition-all shadow-md uppercase tracking-tighter"
        >
          CONTACTAR
        </Link>
        
      </div>
    </main>
  );
}