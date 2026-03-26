import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ game }) {
    const { data, setData, put, processing, errors } = useForm({
        title: game.title,
        description: game.description || '',
        image_url: game.image_url || '',
        is_published: !!game.is_published,
        url: game.url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/games/${game.id}`);
    };

    return (
        <AdminLayout title={`Edit Game: ${game.title}`}>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 max-w-2xl mx-auto">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div>
                                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL (Carátula)</label>
                                <input
                                    type="text"
                                    id="image_url"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    value={data.image_url}
                                    onChange={e => setData('image_url', e.target.value)}
                                />
                                {errors.image_url && <div className="text-red-500 text-sm mt-1">{errors.image_url}</div>}
                            </div>

                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-700">Game URL</label>
                                <input
                                    type="url"
                                    id="url"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                    value={data.url}
                                    onChange={e => setData('url', e.target.value)}
                                />
                                {errors.url && <div className="text-red-500 text-sm mt-1">{errors.url}</div>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    checked={data.is_published}
                                    onChange={e => setData('is_published', e.target.checked)}
                                />
                                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                                    Publish this game
                                </label>
                                {errors.is_published && <div className="text-red-500 text-sm mt-1 block w-full">{errors.is_published}</div>}
                            </div>

                            <div className="flex items-center justify-end">
                                <Link
                                    href="/admin/games"
                                    className="mr-4 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-end"
                                >
                                    Update Game
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
