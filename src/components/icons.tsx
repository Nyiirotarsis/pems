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
            .wave { fill: hsl(var(--sidebar-primary)); }
          `}
        </style>
      </defs>
      
      <text x="5" y="35" className="pacific-font">Pa</text>
      
      <g transform="translate(60, 5)">
        <path d="M-5.5,23.5 C-1.5,13.5 12.5,13.5 12.5,23.5 C12.5,33.5 -1.5,33.5 -5.5,23.5 Z" fill="#FFFFFF"/>
        <path d="M-1,28 C2,23 5,22 8,24" stroke="hsl(var(--sidebar-primary))" strokeWidth="1.5" fill="none" />
        <path d="M-2,25 C1,20 6,19 9,21" stroke="hsl(var(--sidebar-primary))" strokeWidth="1.5" fill="none" />
         <path d="M-3,22 C0,17 7,16 10,18" stroke="hsl(var(--sidebar-primary))" strokeWidth="1.5" fill="none" />
      </g>
      
      <text x="38" y="35" className="pacific-font">cific</text>
      
      <text x="63" y="50" className="events-font">EVENTS</text>
    </svg>
  );
}
