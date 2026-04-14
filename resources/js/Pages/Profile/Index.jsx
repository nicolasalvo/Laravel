import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Index({ user, flash }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isCameraOn]);

    const { post, processing, errors, setData } = useForm({
        photo: null,
    });

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
            setIsCameraOn(true);
            setCapturedImage(null);
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert(`No se pudo acceder a la cámara. Detalle: ${err.message || err.name}. Asegúrate de que otra aplicación no esté utilizándola o acepta los permisos del navegador.`);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setIsCameraOn(false);
    };

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "profile_capture.jpg", { type: "image/jpeg" });
                    setCapturedImage(URL.createObjectURL(blob));
                    setData('photo', file);
                    stopCamera();
                }
            }, 'image/jpeg', 0.9);
        }
    }, [stream]);

    const handleUpload = (e) => {
        e.preventDefault();
        post('/profile/face-photo', {
            onSuccess: () => {
                setCapturedImage(null);
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900 font-sans p-4 sm:p-8 relative">
            <Head title="Mi Perfil" />
            
            <Link
                href="/dashboard"
                className="absolute top-6 left-6 text-indigo-300 hover:text-white transition-colors duration-300 font-medium flex items-center bg-slate-800/50 py-2 px-4 rounded-lg border border-slate-700/50 backdrop-blur-md"
            >
                &larr; Volver al Dashboard
            </Link>

            <div className="max-w-3xl mx-auto mt-16 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl p-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-sm mb-6">
                    Perfil de Usuario
                </h1>
                
                {flash?.success && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl">
                        {flash.success}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Nombre</p>
                        <p className="text-white text-lg font-medium">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Correo Electrónico</p>
                        <p className="text-white text-lg font-medium">{user.email}</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
                    <h2 className="text-2xl font-bold text-white mb-4">Foto de Registro Facial</h2>
                    <p className="text-slate-300 mb-6">
                        {user.face_photo_path 
                            ? "Ya tienes una foto registrada en el sistema. Puedes tomar una nueva para actualizarla." 
                            : "Necesitas registrar una foto de tu rostro para poder acceder a los juegos y verificar tu identidad."}
                    </p>

                    <div className="flex flex-col items-center">
                        {!isCameraOn && !capturedImage && (
                            <button
                                onClick={startCamera}
                                type="button"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                            >
                                Encender Cámara
                            </button>
                        )}

                        <div className={`relative w-full max-w-md aspect-video bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center my-6 ${(!isCameraOn && !capturedImage) ? 'hidden' : ''}`}>
                            {isCameraOn && (
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                            )}
                            {capturedImage && (
                                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover transform scale-x-[-1]" />
                            )}
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>

                        {isCameraOn && (
                            <div className="flex gap-4">
                                <button
                                    onClick={capturePhoto}
                                    type="button"
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                                >
                                    Tomar Foto
                                </button>
                                <button
                                    onClick={stopCamera}
                                    type="button"
                                    className="bg-rose-500 hover:bg-rose-400 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        {capturedImage && (
                            <form onSubmit={handleUpload} className="w-full flex flex-col items-center gap-4 mt-2">
                                <p className="text-emerald-400 font-medium">¡Foto capturada exitosamente!</p>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                                    >
                                        {processing ? 'Subiendo...' : 'Guardar Foto'}
                                    </button>
                                    <button
                                        onClick={() => setCapturedImage(null)}
                                        type="button"
                                        disabled={processing}
                                        className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                                {errors.photo && <p className="text-red-400 text-sm mt-2">{errors.photo}</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
