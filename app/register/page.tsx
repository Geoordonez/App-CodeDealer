import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6 relative">
      
      {/* Botón de regreso (Flecha) - Vuelve al Login */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 font-bold text-xl hover:bg-gray-100 transition-colors"
      >
        &lt;
      </Link>

      {/* Contenedor principal*/}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 w-full max-w-7xl">
        
        {/* Logo Gigante C */}
        <div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0A5EB0] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[200px] md:text-[350px] font-bold leading-none" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            C
          </span>
        </div>

        {/* Formulario Blanco */}
        <div className="w-full md:w-[420px] h-[400px] md:h-[700px] bg-white p-10 rounded-xl shadow-sm shrink-0 flex flex-col pt-16 md:pt-24">
          <div className="space-y-6">
            
            {/* Campo Email */}
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="Value"
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0A5EB0] focus:ring-1 focus:ring-[#0A5EB0]"
              />
            </div>

            {/* Campo Password */}
            <div>
              <label className="text-sm font-bold text-[#0A5EB0] mb-1 block">
                Password
              </label>
              <input
                type="password"
                placeholder="Value"
                className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0A5EB0] focus:ring-1 focus:ring-[#0A5EB0]"
              />
            </div>

            {/* Checkbox Remember me */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 text-[#0A5EB0] border-gray-300 rounded focus:ring-[#0A5EB0] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-bold text-[#0A5EB0] cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Botón Register con LINK al Dashboard */}
            <div className="pt-6">
              <Link href="/Dashboard">
                <button className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors">
                  Register
                </button>
              </Link>
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}