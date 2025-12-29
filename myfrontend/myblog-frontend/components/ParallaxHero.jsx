import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function ParallaxHero() {
  const [offsetY, setOffsetY] = useState(0)
  const navigate = useNavigate()
  
  // You can change this URL to any image you want!
  const backgroundImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80"

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${offsetY * 0.5}px)`,
          backgroundAttachment: "fixed",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content - stays fixed while background moves */}
      <div className="relative z-10 text-center px-6 space-y-6">
        <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl animate-fade-in">
          Discover Amazing Stories
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Dive into a world of knowledge, creativity, and inspiration
        </p>
        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={() => navigate('/blog')}
            className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            Start Reading
          </button>
          <button 
            onClick={() => {
              // Scroll to latest posts section
              const postsSection = document.querySelector('#latest-posts');
              postsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
