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
            .pacific-font { font-family: 'serif'; font-size: 32px; fill: hsl(var(--sidebar-primary)); }
            .events-font { font-family: 'sans-serif'; font-size: 14px; fill: hsl(var(--sidebar-primary)); letter-spacing: 2px; font-weight: 500; }
          `}
        </style>
      </defs>
      
      {/* Pa */}
      <text x="5" y="35" className="pacific-font">Pa</text>
      
      {/* Stylized c */}
      <g transform="translate(48, 8)">
        <path d="M 15 5 C 9.477 5 5 9.477 5 15 L 5 15 C 5 20.523 9.477 25 15 25 L 15 25 C 20.523 25 25 20.523 25 15 L 25 15 C 25 9.477 20.523 5 15 5 Z M 15 7 C 19.418 7 23 10.582 23 15 C 23 19.418 19.418 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 Z" fill="hsl(var(--sidebar-primary))" />
        <path d="M 8 15 C 8 13.5 9 12.5 11 12.5 C 13 12.5 14 13.5 14 15 C 14 16.5 13 17.5 11 17.5 C 9 17.5 8 16.5 8 15 Z" fill="hsl(var(--sidebar-primary))" />
        <path d="M7,19.5c2.1-1.2,4.6-1.5,7-0.9c2.3,0.6,4.4,2.2,5.8,4.3" stroke="hsl(var(--sidebar-primary))" stroke-width="1.2" fill="none"/>
        <path d="M7,17.5c2.1-1.2,4.6-1.5,7-0.9c2.3,0.6,4.4,2.2,5.8,4.3" stroke="hsl(var(--sidebar-primary))" stroke-width="1.2" fill="none" />
        <path d="M7,15.5c2.1-1.2,4.6-1.5,7-0.9c2.3,0.6,4.4,2.2,5.8,4.3" stroke="hsl(var(--sidebar-primary))" stroke-width="1.2" fill="none" />
      </g>
      
      {/* ific */}
      <text x="75" y="35" className="pacific-font">ific</text>
      
      {/* EVENTS */}
      <text x="70" y="50" className="events-font">EVENTS</text>
    </svg>
  );
}