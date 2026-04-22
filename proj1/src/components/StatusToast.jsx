export default function StatusToast({ message }) {
  return (
    <div
      className={`pointer-events-none fixed right-4 top-20 z-[60] transition duration-300 ${
        message ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <div className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20">
        {message}
      </div>
    </div>
  );
}
