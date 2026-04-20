import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Chat from '@/Components/Chat';

export default function PlayIndex() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        fetch('/api/games')
            .then(res => res.json())
            .then(data => {
                setGames(data);
                setLoading(false);
                
                // Si venimos con un ID de juego en la URL, lo seleccionamos automáticamente
                const urlParams = new URLSearchParams(window.location.search);
                const gameId = urlParams.get('id');
                if (gameId) {
                    const game = data.find(g => g.id.toString() === gameId);
                    if (game) setSelectedGame(game);
                }
            })
            .catch(err => {
                console.error("Error fetching games:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 font-sans p-4 sm:p-8 relative text-white">
            <Head title="Play Games - CRM" />

            {/* Header / Navigation similar to Dashboard */}
            <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full">
                <Link
                    href="/dashboard"
                    className="bg-slate-800/60 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg border border-slate-700/50 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Volver al Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    <a
                        href="/profile"
                        className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold py-2 px-5 rounded-full border border-indigo-500/20 transition-all"
                    >
                        Perfil
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full">
                {selectedGame ? (
                    <div className="mb-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-3xl font-extrabold text-white uppercase tracking-tight">
                                    {selectedGame.title}
                                </h3>
                                <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20 uppercase">
                                    Sesión Activa
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedGame(null)}
                                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all border border-slate-700 shadow-lg active:scale-95 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Volver a la Biblioteca
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[75vh]">
                            {/* Área del Juego */}
                            <div className="lg:col-span-3 bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative">
                                {selectedGame.url ? (
                                    <iframe 
                                        src={selectedGame.url} 
                                        title={selectedGame.title} 
                                        className="w-full h-full border-0 absolute inset-0" 
                                        allowFullScreen 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-slate-500 flex-col gap-4">
                                        <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <p className="font-medium">URL del juego no disponible.</p>
                                    </div>
                                )}
                            </div>

                            {/* Área del Chat */}
                            <div className="lg:col-span-1 h-full">
                                <Chat />
                            </div>
                        </div>
                        
                        <div className="mt-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                            <h4 className="text-slate-200 font-bold mb-2 text-lg">Sobre este juego</h4>
                            <p className="text-slate-400 text-base leading-relaxed">{selectedGame.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                        {loading ? (
                            <div className="col-span-full py-20 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                                <p className="text-slate-400">Cargando biblioteca de juegos...</p>
                            </div>
                        ) : games.length > 0 ? (
                            games.map(game => (
                                <div key={game.id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden flex flex-col group hover:-translate-y-2 p-6 justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                                        <p className="text-slate-400 mb-6 line-clamp-3 text-sm leading-relaxed">{game.description}</p>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                <span className="text-indigo-400 text-[10px]">👑</span>
                                            </div>
                                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Por {game.creator?.name || 'Sistema'}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedGame(game)}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 transition-all duration-300 text-white font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95"
                                    >
                                        Jugar Ahora
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-slate-800/20 rounded-3xl border border-slate-700/50 text-center">
                                <p className="text-slate-500">No hay juegos disponibles en este momento.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
