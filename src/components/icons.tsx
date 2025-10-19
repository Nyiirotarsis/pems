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
      
      <g transform="translate(43, 8)">
        <path
          d="M26.8,25.3c-2.4-1.3-5-2-7.7-2c-6.8,0-12.4,5.6-12.4,12.4s5.6,12.4,12.4,12.4c2.8,0,5.3-0.9,7.4-2.5"
          fill="none"
          stroke="hsl(var(--sidebar-primary))"
          strokeWidth="3"
        />
        <path
          d="M21.5,29.5c1.4-2.8,0.3-6.2-2.5-7.6s-6.2,0.3-7.6,2.5"
          fill="none"
          stroke="hsl(var(--sidebar-primary))"
          strokeWidth="1.5"
        />
        <path
          d="M23.5,31.5c1.4-2.8,0.3-6.2-2.5-7.6s-6.2,0.3-7.6,2.5"
          fill="none"
          stroke="hsl(var(--sidebar-primary))"
          strokeWidth="1.5"
        />
         <path
          d="M25.5,33.5c1.4-2.8,0.3-6.2-2.5-7.6s-6.2,0.3-7.6,2.5"
          fill="none"
          stroke="hsl(var(--sidebar-primary))"
          strokeWidth="1.5"
        />
      </g>
      
      <text x="70" y="35" className="pacific-font">ific</text>
      
      <text x="63" y="50" className="events-font">EVENTS</text>
    </svg>
  );
}