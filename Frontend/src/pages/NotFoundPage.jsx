import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="text-center animate-fade-in">
        <div className="font-display font-black text-[10rem] leading-none text-dark-800 select-none">
          404
        </div>
        <h1 className="font-display font-bold text-2xl text-dark-100 -mt-4 mb-3">Page not found</h1>
        <p className="text-dark-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
