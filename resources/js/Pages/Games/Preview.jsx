import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

export default function Preview({ game }) {
    return (
        <AdminLayout title={`Preview: ${game.title}`}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-4">
                <Link
                    href="/admin/games"
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                    Back to Games
                </Link>
            </div>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-4 p-4">
                        <h3 className="text-lg font-bold text-black">
                            {game.title}
                        </h3>
                        <p className="text-gray-600 mt-2 text-black">
                            {game.description}
                        </p>
                        <div className="mt-4">
                            <span className="text-sm font-medium text-gray-500">
                                Status:{" "}
                            </span>
                            {game.is_published ? (
                                <span className="text-green-600 text-sm font-bold">
                                    Published
                                </span>
                            ) : (
                                <span className="text-red-600 text-sm font-bold">
                                    Draft
                                </span>
                            )}
                        </div>
                    </div>

                    <div
                        className="bg-black overflow-hidden shadow-xl sm:rounded-lg w-full"
                        style={{ height: "70vh" }}
                    >
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
        </AdminLayout>
    );
}
