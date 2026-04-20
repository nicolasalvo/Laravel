import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function Chat() {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        console.log("Iniciando conexión de Chat...");
        
        axios.get('/messages')
            .then(res => {
                setMessages(res.data);
                setLoading(false);
                setTimeout(scrollToBottom, 100);
            })
            .catch(err => console.error("Error cargando mensajes:", err));

        if (!window.Echo) {
            console.error("Laravel Echo no está cargado.");
            return;
        }

        const channel = window.Echo.channel('chat')
            .listen('.message.sent', (data) => {
                console.log("Recibido vía WebSocket:", data);
                setMessages(prev => {
                    if (prev.find(m => m.id === data.message.id)) return prev;
                    return [...prev, data.message];
                });
            });

        return () => {
            window.Echo.leaveChannel('chat');
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        const tempId = Date.now();
        
        // MENSAJE OPTIMISTA (INSTANTÁNEO)
        const optimisticMessage = {
            id: tempId,
            content: content,
            user_id: auth?.user?.id,
            user: { name: auth?.user?.name || 'Tú' },
            created_at: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');

        axios.post('/messages', { content })
            .then(res => {
                setMessages(prev => prev.map(m => m.id === tempId ? res.data : m));
            })
            .catch(err => {
                console.error("Error envío:", err);
                setMessages(prev => prev.filter(m => m.id !== tempId));
            });
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden font-sans">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Chat En Vivo</h3>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col scroll-smooth"
                style={{ height: 'calc(100% - 130px)' }}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-slate-500 font-medium">Conectando...</span>
                    </div>
                ) : messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.user_id === auth?.user?.id ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            <span className="text-[10px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-tighter">
                                {msg.user_id === auth?.user?.id ? 'Tú' : (msg.user?.name || 'Usuario')}
                            </span>
                            <div className={`max-w-[90%] px-4 py-2.5 rounded-2xl text-[13px] leading-tight shadow-md ${
                                msg.user_id === auth?.user?.id 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-slate-700 text-slate-100 rounded-tl-none border border-slate-600/50'
                            } ${msg.isOptimistic ? 'opacity-70' : 'opacity-100'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-600 text-xs italic">No hay mensajes. ¡Di algo!</div>
                )}
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-slate-900/40 border-t border-slate-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribir mensaje..."
                        className="flex-grow bg-slate-800/80 border-slate-700 text-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                    />
                    <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-all active:scale-90 shadow-lg shadow-indigo-900/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
