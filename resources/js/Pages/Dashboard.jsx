import React, { useState, useRef, useCallback, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";

export default function Dashboard({ games = [] }) {
    const { auth } = usePage().props;
    const isManager =
        auth?.user?.roles?.includes("Administrador") ||
        auth?.user?.roles?.includes("Gestor");

    const [selectedGame, setSelectedGame] = useState(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState(null);
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isVerifyModalOpen]);

    const openVerifyModal = (game) => {
        setSelectedGame(game);
        setIsVerifyModalOpen(true);
        setVerificationError(null);
        setVerificationSuccess(false);
        startCamera();
    };

    const closeVerifyModal = () => {
        stopCamera();
        setIsVerifyModalOpen(false);
        setSelectedGame(null);
        setIsVerifying(false);
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setVerificationError(
                `No se pudo acceder a la cámara. Detalle: ${err.message || err.name}. Asegúrate de que otra aplicación (como Discord o Zoom) no esté usando tu cámara.`
            );
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const handleVerification = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsVerifying(true);
        setVerificationError(null);

        const context = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );

        canvasRef.current.toBlob(
            async (blob) => {
                if (blob) {
                    const formData = new FormData();
                    formData.append("validation_photo", blob, "validation.jpg");

                    try {
                        const response = await axios.post(
                            "/verify-face",
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            },
                        );

                        if (response.data.verified) {
                            setVerificationSuccess(true);
                            setTimeout(() => {
                                window.location.href = selectedGame.url || "#";
                            }, 1000);
                        } else {
                            setVerificationError(
                                "Validación facial fallida: Rostro no reconocido (La distancia superó el umbral permitido).",
                            );
                            setIsVerifying(false);
                        }
                    } catch (error) {
                        setIsVerifying(false);
                        setVerificationError(
                            error.response?.data?.error ||
                                "Ocurrió un error inesperado al verificar la identidad.",
                        );
                    }
                }
            },
            "image/jpeg",
            0.9,
        );
    }, [stream, selectedGame]);

    return (
        <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 font-sans p-4 sm:p-8 relative">
            <Head title="Dashboard CRM" />

            {isManager && (
                <Link
                    href="/admin/games"
                    className="absolute top-6 left-6 bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-indigo-900/50 transition-all duration-300 backdrop-blur-sm border border-indigo-500/20 z-10"
                >
                    Administrar Juegos
                </Link>
            )}

            <div className="flex justify-center top-0 flex-col items-end relative z-10">
                <div className="mb-2">
                    <a
                        href="/profile"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-300 backdrop-blur-sm border border-indigo-500/20 inline-block"
                    >
                        Mi Perfil (Registro Facial)
                    </a>
                </div>
                <a
                    href="/logout"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg shadow-rose-900/50 transition-all duration-300 backdrop-blur-sm border border-rose-500/20 inline-block"
                >
                    Cerrar Sesión
                </a>
            </div>

            <div className="flex justify-center mt-10 mb-14 flex-col items-center">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-sm mb-4">
                    Bienvenido al CRM Dashboard
                </h1>
                <p className="text-slate-300 text-lg max-w-lg text-center font-light leading-relaxed">
                    Aquí encontrarás los mejores juegos mecánicos y en 3D para
                    pasar el rato en la academia. Se requiere verificación
                    facial para jugar.
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
                                    onClick={() => openVerifyModal(game)}
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

            {/* Modal de Validación Facial */}
            {isVerifyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white">
                                Verificación Facial Requerida
                            </h3>
                            <button
                                onClick={closeVerifyModal}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <span className="text-2xl leading-none">
                                    &times;
                                </span>
                            </button>
                        </div>

                        <div className="p-6 flex flex-col items-center">
                            <p className="text-slate-300 text-center mb-6">
                                Para jugar a{" "}
                                <span className="font-bold text-indigo-400">
                                    {selectedGame?.title}
                                </span>{" "}
                                debes comprobar que eres el jugador registrado.
                            </p>

                            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center mb-6">
                                {stream ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    ></video>
                                ) : (
                                    <div className="text-slate-500 text-center flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
                                        Cargando cámara...
                                    </div>
                                )}
                                <canvas
                                    ref={canvasRef}
                                    className="hidden"
                                ></canvas>

                                {verificationSuccess && (
                                    <div className="absolute inset-0 bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center flex-col">
                                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                                            <svg
                                                className="w-8 h-8 text-emerald-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="3"
                                                    d="M5 13l4 4L19 7"
                                                ></path>
                                            </svg>
                                        </div>
                                        <p className="text-white font-bold text-xl drop-shadow-md">
                                            ¡Identidad Verificada!
                                        </p>
                                    </div>
                                )}
                            </div>

                            {verificationError && (
                                <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center">
                                    {verificationError}
                                </div>
                            )}

                            <div className="w-full">
                                <button
                                    onClick={handleVerification}
                                    disabled={
                                        !stream ||
                                        isVerifying ||
                                        verificationSuccess
                                    }
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isVerifying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Analizando Rostro...
                                        </>
                                    ) : (
                                        "Verificar Identidad y Jugar"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
