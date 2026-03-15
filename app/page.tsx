export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E5E5E5] p-6">
      
      {/* Contenedor principal*/}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
        
        {/* Logo Gigante C */}
        <div className="w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[#0A5EB0] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[200px] md:text-[350px] font-bold leading-none" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            C
          </span>
        </div>

        {/* Formulario Blanco */}
        <div className="w-full md:w-[420px] h-[300px] md:h-[700px] bg-white p-10 rounded-xl shadow-sm shrink-0">
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

            {/* Botones Sign In y Register */}
            <div className="space-y-4 pt-2">
              <button className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors">
                Sign In
              </button>
              
              <button className="w-full bg-[#0A5EB0] hover:bg-blue-800 text-white font-bold py-3.5 rounded-md transition-colors">
                Register
              </button>
            </div>

            {/* Enlace Olvidé mi contraseña */}
            <div className="pt-4">
              <a href="#" className="text-sm text-[#0A5EB0] hover:underline font-bold">
                Forgot password?
              </a>
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}