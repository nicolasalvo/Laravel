import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ games = [] }) {
    const { auth } = usePage().props;
    const isManager =
        auth?.user?.roles?.includes("Administrador") ||
        auth?.user?.roles?.includes("Gestor");
    return (
        <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 font-sans p-4 sm:p-8 relative">
            <Head title="Dashboard CRM" />

            {isManager && (
                <Link
                    href="/admin/games"
                    className="absolute top-6 left-6 bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-indigo-900/50 transition-all duration-300 backdrop-blur-sm border border-indigo-500/20"
                >
                    Administrar Juegos
                </Link>
            )}

            <a
                href="/logout"
                className="absolute top-6 right-6 bg-rose-600/90 hover:bg-rose-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-rose-900/50 transition-all duration-300 backdrop-blur-sm border border-rose-500/20"
            >
                Cerrar Sesión
            </a>

            <div className="flex justify-center mt-10 mb-14 flex-col items-center">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-sm mb-4">
                    Bienvenido al CRM Dashboard
                </h1>
                <p className="text-slate-300 text-lg max-w-lg text-center font-light leading-relaxed">
                    Aquí encontrarás los mejores juegos mecánicos y en 3D para
                    pasar el rato en la academia.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-10 max-w-7xl mx-auto pb-10">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden flex flex-col group hover:-translate-y-2 relative"
                    >
                        <div className="relative overflow-hidden h-52">
                            <img
                                src={
                                    game.image_url ||
                                    "https://via.placeholder.com/300x200?text=No+Image"
                                }
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                alt={game.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

                            {game.is_published ? (
                                <span className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-900/50 backdrop-blur-sm border border-emerald-400/30 tracking-wider uppercase">
                                    Disponible
                                </span>
                            ) : (
                                <span className="absolute top-3 left-3 bg-rose-500/80 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-rose-900/50 backdrop-blur-sm border border-rose-400/30 tracking-wider uppercase">
                                    No Disponible
                                </span>
                            )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
                                {game.title}
                            </h2>
                            <p className="text-slate-400 text-sm mb-4 flex-grow leading-relaxed">
                                {game.description}
                            </p>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <span className="text-indigo-400 text-[10px]">
                                        👑
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    Por {game.creator?.name || "Sistema"}
                                </p>
                            </div>

                            {game.is_published ? (
                                <button
                                    onClick={() =>
                                        (window.location.href = game.url || "#")
                                    }
                                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 tracking-wide"
                                >
                                    ¡Jugar Ahora!
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-slate-700/40 text-slate-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed border border-slate-600/30 uppercase tracking-wider text-sm"
                                >
                                    Próximamente
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
