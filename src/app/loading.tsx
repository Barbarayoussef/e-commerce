export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/20" />

        <div className="h-20 w-20 animate-spin rounded-full border-4 border-muted border-t-primary" />

        <div className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-primary animate-bounce"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold tracking-tight text-foreground animate-pulse">
        Shop<span className="text-primary">Cart</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground font-medium uppercase tracking-widest">
        Bringing the products to you...
      </p>
    </div>
  );
}
