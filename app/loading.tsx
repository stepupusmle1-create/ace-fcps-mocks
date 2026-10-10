export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-48 rounded-lg bg-brand-100" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-brand-50" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-2xl bg-white shadow-sm" />
        <div className="h-28 rounded-2xl bg-white shadow-sm" />
        <div className="h-28 rounded-2xl bg-white shadow-sm" />
      </div>
      <div className="mt-6 h-40 rounded-2xl bg-white shadow-sm" />
    </div>
  );
}
