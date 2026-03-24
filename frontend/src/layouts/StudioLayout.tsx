import { Outlet, NavLink } from 'react-router-dom';
import { ROUTES } from '../config/routes';

export default function StudioLayout() {
  const navItems = [
    { name: 'Thư viện Truyện', path: ROUTES.STUDIO.LIBRARY },
    { name: 'Khởi tạo Truyện mới', path: ROUTES.STUDIO.CREATE },
    { name: 'Import Truyện (Reader)', path: ROUTES.STUDIO.IMPORT },
    { name: 'Cấu hình API Key', path: ROUTES.STUDIO.API_KEYS },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/50 backdrop-blur-md flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Trạm Sáng Tác
          </h1>
          <p className="text-xs text-slate-500 mt-1">AstraFlow Studio</p>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <NavLink to={ROUTES.PUBLIC.HOME} className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg">
            Thoát Studio
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>
        <div className="h-full w-full p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
