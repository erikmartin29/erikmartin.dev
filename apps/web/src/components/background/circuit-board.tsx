export function CircuitBoard() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="circuit-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              {/* Circuit Lines */}
              <path
                d="M20 20 H 80 V 80 H 20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-900 dark:text-white"
              />
              <path
                d="M50 20 V 0 M50 80 V 100 M20 50 H 0 M80 50 H 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-900 dark:text-white"
              />
              
              {/* Connection Dots */}
              <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-accent" />
              <circle cx="80" cy="20" r="1.5" fill="currentColor" className="text-accent" />
              <circle cx="80" cy="80" r="1.5" fill="currentColor" className="text-accent" />
              <circle cx="20" cy="80" r="1.5" fill="currentColor" className="text-accent" />
              
              {/* Random Tech Decor */}
              <rect x="45" y="45" width="10" height="10" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-gray-900 dark:text-white opacity-50" />
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>
      
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[100px]" />
    </div>
  );
}
