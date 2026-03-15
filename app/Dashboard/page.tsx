import Link from 'next/link';

export default function DashboardPage() {
  // Datos simulados
  const tasks = [
    { id: 1, title: "BUSCO PROGRAMADOR", desc: "ESPECIFICACIÓN DE LA TAREA" },
    { id: 2, title: "BUSCO PROGRAMADOR", desc: "ESPECIFICACIÓN DE LA TAREA" },
    { id: 3, title: "BUSCO PROGRAMADOR", desc: "ESPECIFICACIÓN DE LA TAREA" },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6">
      
      {/* Contenedor principal estilo tablet */}
      <div className="w-full max-w-5xl h-[800px] bg-white rounded-[2rem] shadow-sm p-8 md:p-12 relative flex flex-col">
        
        {/* Header: Avatar + Buscador */}
        <div className="flex items-center gap-4 mb-12">
          
          {/* 1. LINK AL PERFIL (MIS PROPUESTAS) */}
          <Link href="/MisPropuestas" className="group">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex shrink-0 overflow-hidden border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-[#0A5EB0] transition-all">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Mi perfil" 
                className="w-full h-full object-cover" 
              />
            </div>
          </Link>
          
          {/* Buscador */}
          <div className="flex-1 max-w-xl relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Buscar una tarea..." 
              className="w-full bg-gray-100 text-gray-700 font-medium rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#0A5EB0] transition-shadow"
            />
          </div>
        </div>

        {/* 2. ICONOS FLOTANTES CON LINKS */}
        <div className="absolute right-8 top-12 flex flex-col gap-4">
          {/* Link a Publicar */}
          <Link 
            href="/Publicar" 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-[#4facfe] text-3xl font-normal hover:bg-gray-50 hover:scale-110 transition-all"
          >
            +
          </Link>
          {/* Link a Lista de Chats */}
          <Link 
            href="/Chats" 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-[#4facfe] text-2xl hover:bg-gray-50 hover:scale-110 transition-all"
          >
            💬
          </Link>
        </div>

        {/* 3. LISTA DE TAREAS CON LINKS A DETALLE */}
        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto overflow-y-auto pr-4 pb-4">
          {tasks.map((task) => (
            <Link 
              href="/VistaPropuesta" 
              key={task.id} 
              className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] rounded-3xl p-6 flex items-center gap-6 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
            >
              {/* Avatar del creador */}
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.id + 10}`} 
                  alt="Avatar" 
                  className="w-14 h-14 rounded-full" 
                />
              </div>
              
              {/* Textos */}
              <div className="text-white flex flex-col justify-center">
                <h3 className="font-bold text-lg md:text-xl tracking-wide uppercase">
                  {task.title}
                </h3>
                <p className="text-white/90 text-xs md:text-sm mt-1 uppercase font-medium tracking-wider">
                  {task.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}