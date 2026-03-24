import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard() {
    const games = [
        {
            id: 1,
            title: "Slope",
            description: "Juego de estrategia 3D",
            estado: "Disponible",
            image: "../../../Files/CaratulaSlope.png",
            creador: "Nicolas Oxovi",
            ruta: "/games/slope/index.html",
        },
        {
            id: 2,
            title: "Snake 3D",
            description: "Clásico reinventado",
            estado: "No Disponible",
            image: "../../../Files/CaratulaSnake.png",
            creador: "Nicolas Oxovi",
            ruta: "",
        },
        {
            id: 3,
            title: "Tetris Max",
            description: "Desafío mental",
            estado: "No Disponible",
            image: "../../../Files/CaratulaTetris.png",
            creador: "Nicolas Oxovi",
            ruta: "",
        },
        {
            id: 4,
            title: "Space Invaders",
            description: "Acción espacial",
            estado: "No Disponible",
            image: "../../../Files/CaratulaSpaceInvaders.png",
            creador: "Nicolas Oxovi",
            ruta: "",
        },
        {
            id: 5,
            title: "Geometry Dash",
            description: "Juego de estrategia 3D",
            estado: "No Disponible",
            image: "../../../Files/CaratulaGeometryDash.png",
            creador: "Nicolas Oxovi",
            ruta: "",
        },
    ];
    return (
        <div className="font-sans p-5 text-gray-800 relative">
            <Head title="Dashboard CRM" />
            <a
                href="/logout" 
                className="absolute top-5 right-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Cerrar Sesión
            </a>
            <div className="flex justify-center mt-5 flex-col">
                <h1 className="text-white text-3xl font-bold text-center">
                    Bienvenido al CRM Dashboard
                </h1>
                <p className="mt-2 text-white text-center">
                    Aquí encontrarás los mejores juegos para pasar el rato
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative"
                    >
                        <div className="relative">
                            <img
                                src={game.image}
                                className="w-full h-48 bg-gray-200 object-cover border-b border-gray-100"
                                alt={game.title}
                            />
                            {game.estado === "Disponible" ? (
                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                    {game.estado}
                                </span>
                            ) : (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                    {game.estado}
                                </span>
                            )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow relative z-0">
                            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
                                {game.title}
                            </h2>
                            <p className="text-gray-500 text-sm text-center mb-4 flex-grow">
                                {game.description}{" "}
                            </p>
                            <p className="text-gray-500 text-sm text-center mb-4 flex-grow">
                                Creado por: {game.creador}
                            </p>
                            <button
                                onClick={() =>
                                    (window.location.href = game.ruta)
                                }
                                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm"
                            >
                                Jugar Ahora
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
