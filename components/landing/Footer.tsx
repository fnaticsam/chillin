export default function Footer() {
  return (
    <footer className="bg-ink text-paper/35 py-10 text-center text-sm border-t border-paper/[0.06]">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <p>&copy; {new Date().getFullYear()} Chillin. All rights reserved.</p>
      </div>
    </footer>
  );
}
