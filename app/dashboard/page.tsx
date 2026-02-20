"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiPlus } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        let channel: any;
        let currentUserId: string;

        const setup = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                window.location.href = "/";
                return;
            }

            currentUserId = user.id;

            await fetchBookmarks(user.id);

            channel = supabase
                .channel("bookmarks")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "bookmarks",
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log("Realtime event:", payload);
                        fetchBookmarks(user.id);
                    }
                )
                .subscribe((status) => {
                    console.log("Realtime status:", status);
                });
        };

        setup();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    const fetchBookmarks = async (userId: string) => {
        const { data } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", userId);

        setBookmarks(data || []);
    };
    const addBookmark = async () => {
        if (!title || !url) {
            toast.error("Both fields are required");
            return;
        }

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from("bookmarks")
            .insert([
                {
                    title,
                    url,
                    user_id: user?.id,
                },
            ])
            .select();

        if (error) {
            toast.error("Failed to add bookmark");
        } else if (data) {
            setBookmarks((prev) => [...prev, ...data]);
            setTitle("");
            setUrl("");
            toast.success("Bookmark added successfully 🎉");
        }
    };
    const deleteBookmark = async (id: string) => {
        const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete bookmark");
        } else {
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
            toast.success("Bookmark deleted successfully 🗑");
        }
    };
    return (
        <div className="min-h-screen bg-black text-white flex justify-center py-12 px-4 font-['Poppins'] font-normal">
            <div className="w-full max-w-2xl space-y-8">

                <h1 className="text-3xl font-bold tracking-tight text-center text-purple-400">
                    My Bookmarks
                    <p className="text-center text-zinc-400 text-sm tracking-wide mt-2">
                        Save your favorite links. Access them anytime, anywhere.
                    </p>
                </h1>


                {/* Add Bookmark Form */}
                <div
                    className="bg-zinc-900 p-6 rounded-xl 
             border border-purple-700/40 
             shadow-lg space-y-4
             transition-all duration-300
             hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
             hover:border-purple-500"
                >
                    <div className="flex flex-col gap-4 md:flex-row">
                        <input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="flex-1 bg-black border border-zinc-700 
                       focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                       outline-none px-4 py-3 rounded-lg transition"
                        />

                        <input
                            placeholder="URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            type="url"
                            className="flex-1 bg-black border border-zinc-700 
                       focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                       outline-none px-4 py-3 rounded-lg transition"
                        />

                        <button
                            onClick={addBookmark}
                            disabled={!title.trim() || !url.trim()}
                            className="flex items-center justify-center cursor-pointer gap-2
             bg-gradient-to-r from-purple-600 to-indigo-600 
             disabled:opacity-50 disabled:cursor-not-allowed
             hover:opacity-90 transition px-6 py-3 rounded-lg font-medium"
                        >
                            <FiPlus size={18} />
                            Add
                        </button>
                    </div>

                    {/* Validation message */}
                    {(!title.trim() || !url.trim()) && (
                        <p className="text-sm text-red-400">
                            Both Title and URL are required.
                        </p>
                    )}
                </div>

                {/* Bookmarks List */}
                <div className="space-y-4">
                    {bookmarks.length === 0 && (
                        <p className="text-zinc-400 text-sm">No bookmarks added yet.</p>
                    )}

                    {bookmarks.map((b) => (
                        <div
                            key={b.id}
                            className="bg-zinc-900 border border-zinc-800 
                       hover:border-purple-600 transition
                       p-4 rounded-xl flex justify-between items-center"
                        >
                            <div>
                                <a
                                    href={b.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:underline font-medium"
                                >
                                    {b.title}
                                </a>
                                <p className="text-xs text-zinc-500 truncate max-w-xs">
                                    {b.url}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteBookmark(b.id)}
                                className="flex items-center gap-1 cursor-pointer
             text-red-400 hover:text-red-300 
             transition text-sm font-medium"
                            >
                                <FiTrash2 size={16} />
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}