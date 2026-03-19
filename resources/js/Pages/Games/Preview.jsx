import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Preview({ game }) {
    return (
        <AppLayout title="Preview Game">
            <template name="header">
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Preview: {game.title}
                    </h2>
                    <Link
                        href={route('games.index')}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        Back to Games
                    </Link>
                </div>
            </template>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-4 p-4">
                        <h3 className="text-lg font-bold">{game.title}</h3>
                        <p className="text-gray-600 mt-2">{game.description}</p>
                        <div className="mt-4">
                            <span className="text-sm font-medium text-gray-500">Status: </span>
                            {game.is_published ? (
                                <span className="text-green-600 text-sm font-bold">Published</span>
                            ) : (
                                <span className="text-red-600 text-sm font-bold">Draft</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-black overflow-hidden shadow-xl sm:rounded-lg w-full" style={{ height: '70vh' }}>
                        {game.url ? (
                            <iframe 
                                src={game.url} 
                                title={game.title} 
                                className="w-full h-full border-0" 
                                allowFullScreen 
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-white">
                                <p>No URL provided for this game.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
