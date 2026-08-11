export default function WatuLogo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon - Stylized W */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* W shape */}
          <path
            d="M20 80 L35 20 L50 60 L65 20 L80 80"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Money symbol */}
          <circle cx="50" cy="85" r="8" fill="white" opacity="0.8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold text-gray-900 leading-tight`}>
            Watu
          </span>
          <span className={`text-xs font-semibold text-orange-600 leading-tight`}>
            CREDIT
          </span>
        </div>
      )}
    </div>
  );
}
