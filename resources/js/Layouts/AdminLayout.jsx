import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function AdminLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Head title={title} />
            <nav className="bg-slate-800 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard" className="text-xl font-bold text-indigo-400">
                                    Admin Panel
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
                                Volver al Dashboard
                            </Link>
                            <a href="/logout" className="bg-rose-600/90 hover:bg-rose-500 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold">
                                Cerrar Sesión
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {title}
                    </h2>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
