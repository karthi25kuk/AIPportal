import {Route,Routes,Link} from 'react-router-dom' 
import Login from './Login.jsx'
import Register from './Register.jsx'
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-3xl font-bold text-blue-400">AIP Portal</div>
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white transition px-4 py-2">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Big Title + Description */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-8xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Academic Industry Partnership Portal
          </h1>
          <p className="text-xl md:text-xl text-slate-300 mb-8">
            A platform that connects students, colleges, and industries for internships, live projects, and placements.
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Who is This For?
          </h2>
          <p className="text-center text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
            AIP Portal is designed for Bridging the Gap Between Academia and Industry
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:bg-slate-700 transition">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-3">Students</h3>
              <p className="text-slate-300">
                Access opportunities that align with your skills, interests, and career goals in one centralized platform.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:bg-slate-700 transition">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-white mb-3">Industries</h3>
              <p className="text-slate-300">
                Connect with talented students from various academic backgrounds and discover potential future employees.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:bg-slate-700 transition">
              <div className="text-4xl mb-4">🏫</div>
              <h3 className="text-2xl font-bold text-white mb-3">Colleges</h3>
              <p className="text-slate-300">
                Monitor student participation in internships and ensure meaningful industry exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="gap-8 mb-8 flex flex-col md:flex-row items-center justify-between">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">AIP Portal</h3>
              <p className="text-slate-400">
                Helping students gain real-world experience and industries find young talent.
              </p>
            </div>
            <div>
              <Link to="/adminlogin" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg transition transform hover:scale-105">
                Admin Login
              </Link>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-slate-400">
              <p>&copy; 2026 AIP Portal. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition">Twitter</a>
                <a href="#" className="hover:text-white transition">LinkedIn</a>
                <a href="#" className="hover:text-white transition">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Home;