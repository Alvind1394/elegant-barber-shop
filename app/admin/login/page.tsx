'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {

      if (
        !email ||
        !password
      ) {
        toast.error(
          'Completa todos los campos'
        );

        return;
      }

      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      setLoading(false);

      if (error) {

        toast.error(
          error.message
        );

        return;
      }

      router.push('/admin');
    };

  return (
    <main className="
      min-h-screen
      bg-[#050505]
      flex
      items-center
      justify-center
      p-6
    ">

      <div className="
        w-full
        max-w-md
        bg-[#111111]
        border
        border-yellow-500/10
        rounded-3xl
        p-8
      ">

        <h1 className="
          text-4xl
          font-black
          text-yellow-400
          mb-2
        ">
          Admin Login
        </h1>

        <p className="
          text-zinc-500
          mb-8
        ">
          Acceso privado
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              bg-black
              border
              border-zinc-800
              rounded-2xl
              px-5
              py-4
              outline-none
              focus:border-yellow-400/40
            "
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              bg-black
              border
              border-zinc-800
              rounded-2xl
              px-5
              py-4
              outline-none
              focus:border-yellow-400/40
            "
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-black
              py-4
              rounded-2xl
              transition-all
            "
          >
            {
              loading
                ? 'Entrando...'
                : 'Entrar'
            }
          </button>

        </div>

      </div>

    </main>
  );
}