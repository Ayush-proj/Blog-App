/*  src/components/YouTubeEmbed.jsx  */
'use client'               // keep it if you’re in a Next.js app that uses the app router

/**
 * Simple, responsive YouTube embed.
 *
 * Props:
 *   - videoId (string)   – the part after “watch?v=” in a YouTube URL
 *   - className (string) – optional extra Tailwind / CSS classes for the wrapper
 */
export default function YouTubeEmbed({ videoId, className = '' }) {
  const src = `https://www.youtube.com/embed/${videoId}`

  return (
    <div className={`aspect-video overflow-hidden rounded-lg shadow-md ${className}`}>
      <iframe
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  )
}
