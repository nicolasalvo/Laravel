import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

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
            })
            .catch(err => {
                console.error("Error fetching games:", err);
                setLoading(false);
            });
    }, []);

    return (
        <AppLayout title="Play Games">
            <template name="header">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Game Library
                </h2>
            </template>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {selectedGame ? (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">{selectedGame.title}</h3>
                                <button 
                                    onClick={() => setSelectedGame(null)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Back to Library
                                </button>
                            </div>
                            <div className="bg-black w-full shadow-xl sm:rounded-lg" style={{ height: '70vh' }}>
                                {selectedGame.url ? (
                                    <iframe 
                                        src={selectedGame.url} 
                                        title={selectedGame.title} 
                                        className="w-full h-full border-0" 
                                        allowFullScreen 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-white">
                                        <p>No URL provided for this game.</p>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-gray-600">{selectedGame.description}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <p>Loading games...</p>
                            ) : games.length > 0 ? (
                                games.map(game => (
                                    <div key={game.id} className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3">{game.description}</p>
                                            <p className="text-sm text-gray-400 mb-4">By: {game.creator?.name}</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedGame(game)}
                                            className="w-full text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
                                        >
                                            Play Now
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No games available to play at the moment.</p>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
