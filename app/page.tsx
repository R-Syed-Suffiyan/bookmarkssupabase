"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function Home() {

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  return (
    <div className="relative h-screen w-full font-['Poppins'] font-normal">

      {/* Background Image */}
      <Image
        src="/login-background.png"
        alt="Background"
        fill
        className="object-cover object-center"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Login Card */}
      <div className="relative flex h-full items-center justify-center">
        <div className="w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/book-mark.png"
              alt="Logo"
              width={80}
              height={80}
              className="animate-scale-up rounded-2xl"
            />
          </div>

          <h1 className="text-2xl font-semibold text-center mb-6">
            Bookmarks
          </h1>

          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 cursor-pointer
             bg-gradient-to-r from-indigo-500 to-purple-600 
             hover:opacity-90 transition-all duration-300 
             text-white py-3 rounded-lg font-medium shadow-lg"
          >
            <FcGoogle size={22} />
            Login with Google
          </button>

        </div>
      </div>

    </div>
  );
}