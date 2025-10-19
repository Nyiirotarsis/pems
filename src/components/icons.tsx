export function PacificEventsLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      width="200"
      height="60"
    >
      <defs>
        <style>
          {`
            .pacific-font { font-family: 'Times New Roman', serif; font-size: 32px; fill: hsl(var(--sidebar-primary)); font-weight: bold; }
            .events-font { font-family: 'Arial', sans-serif; font-size: 14px; fill: hsl(var(--sidebar-primary)); letter-spacing: 2px; }
          `}
        </style>
      </defs>
      
      <text x="5" y="35" className="pacific-font">Pa</text>
      
      <g transform="translate(45, 8)">
        {/* Circle for the 'c' */}
        <circle cx="12" cy="27" r="14" fill="none" stroke="hsl(var(--sidebar-primary))" strokeWidth="2.5" />

        {/* Wave inside the circle */}
        <path d="M5,30 Q8,24 12,27 T19,25" stroke="hsl(var(--sidebar-primary))" strokeWidth="2" fill="none" />
         <path d="M5,33 Q8,27 12,30 T19,28" stroke="hsl(var(--sidebar-primary))" strokeWidth="2" fill="none" />
      </g>
      
      <text x="70" y="35" className="pacific-font">ific</text>
      
      <text x="63" y="50" className="events-font">EVENTS</text>
    </svg>
  );
}
