import Link from 'next/link';

export default function MisPropuestasPage() {
  // Lista de tareas según tu mockup
  const tareas = ["TAREA", "TAREA", "TAREA", "TAREA"];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      
      {/* Botón de regreso (Flecha) - Te lleva de vuelta al Dashboard */}
      <Link 
        href="/Dashboard" 
        className="absolute top-6 left-6 md:top-10 md:left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl hover:bg-gray-100 transition-colors"
      >
        &lt;
      </Link>

      {/* Título Superior */}
      <h1 className="absolute top-10 text-center w-full text-2xl font-bold text-gray-700 tracking-widest uppercase">
        Mis Propuestas
      </h1>

      {/* Contenedor principal con degradado azul */}
      <div className="w-full max-w-4xl h-[600px] bg-gradient-to-b from-[#4facfe] to-[#00f2fe] rounded-[2.5rem] shadow-xl flex flex-col items-center p-12 relative overflow-hidden">
        
        {/* Avatar Circular Central */}
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-full border-4 border-white shadow-lg overflow-hidden mb-10">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lista de Tareas Estilo Píldora */}
        <div className="w-full max-w-md flex flex-col gap-4">
          {tareas.map((tarea, index) => (
            <div 
              key={index} 
              className="bg-[#0A5EB0] text-white flex items-center justify-between px-8 py-3 rounded-full shadow-md hover:bg-blue-800 transition-colors cursor-pointer"
            >
              <span className="font-bold tracking-[0.2em]">{tarea}</span>
              {/* Icono de Basura (Eliminar) */}
              <button className="text-white/80 hover:text-white transition-colors">
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Pequeño texto inferior (Widget Name del mockup) */}
        <span className="absolute bottom-4 text-white/50 text-[10px] uppercase tracking-widest">
          Widget Name
        </span>
        
      </div>
    </main>
  );
}