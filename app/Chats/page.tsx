import Link from 'next/link';

export default function ChatsPage() {
  const usuarios = Array(7).fill("NOMBRE USUARIO");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      <Link href="/Dashboard" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl">&lt;</Link>

      <div className="w-full max-w-4xl h-[700px] bg-white rounded-[2.5rem] shadow-sm p-8 flex flex-col">
        <h1 className="text-center font-bold text-gray-400 mb-6 tracking-widest">CHATS</h1>
        
        {/* Buscador interno */}
        <div className="w-full mb-8">
          <input type="text" placeholder="🔍 Buscar chat..." className="w-full bg-gray-100 rounded-full py-2 px-6 text-sm focus:outline-none" />
        </div>

        {/* Lista de Chats */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {usuarios.map((name, i) => (
            <Link href="/Chat" key={i} className="w-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-3 rounded-full flex items-center gap-4 hover:scale-[1.01] transition-transform shadow-sm">
              <div className="w-10 h-10 bg-white/40 rounded-full overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="User" />
              </div>
              <span className="text-white font-bold text-xs tracking-tighter">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}