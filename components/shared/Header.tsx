type Props = {
  step: number;
  onAdminAccess: () => void;
  onExitAdmin: () => void;
};

export const Header = ({
  step,
  onAdminAccess,
  onExitAdmin,
}: Props) => {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-yellow-500/10 px-6 py-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-yellow-400">
          Elegant Barber Shop
        </h1>

        {step === 99 ? (
          <button
            onClick={onExitAdmin}
            className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full"
          >
            ✕ Salir
          </button>
        ) : (
          <button
            onClick={onAdminAccess}
            className="bg-yellow-500 text-black text-xs font-bold px-3 py-2 rounded-full"
          >
            🔒 Admin
          </button>
        )}
      </div>
    </header>
  );
};