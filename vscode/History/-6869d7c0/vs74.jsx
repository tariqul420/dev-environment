export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center relative p-4 text-white">
      <aside>
        <p className="text-center">
          Copyright © {new Date().getFullYear()} - All right reserved by Md
          Mosiur Rahman
        </p>
      </aside>
    </footer>
  );
}
