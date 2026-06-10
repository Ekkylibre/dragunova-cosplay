export default function Footer() {
  return (
    <footer className="border-t border-paper/10 py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-[0.65rem] uppercase tracking-[0.25em] text-paper-dim">
        <p>
          © {new Date().getFullYear()} Dragunova Cosplay · Tous droits
          réservés
        </p>
      </div>
    </footer>
  );
}
