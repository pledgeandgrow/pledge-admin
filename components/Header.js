export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4">
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline hover:border-b-2 hover:border-white">Portal</a></li>
          <li><a href="/dashboard" className="hover:underline hover:border-b-2 hover:border-white">Dashboard</a></li>
        </ul>
      </nav>
    </header>
  );
}
