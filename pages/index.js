import Head from 'next/head';

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <Head>
        <title>Login</title>
      </Head>
      <div className="absolute top-0 left-0 right-0 flex justify-center mt-8">
        <img src="/logo-white.png" alt="Logo" className="h-32" />
      </div>
      <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Pledge Portal</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
          <p className="text-red-500 text-xs italic">Please choose a password.</p>
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Sign In
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-800" href="#">
            Forgot Password?
          </a>
        </div>
      </form>
      <div className="fixed bottom-0 left-0 w-full bg-black text-white text-center py-4">
        <a href="/dashboard" className="text-white">Pledge Portal 2025</a>
      </div>
    </div>
  );
}
