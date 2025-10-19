export function PacificEventsLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 40"
      width="120"
      height="40"
    >
      <defs>
        <style>
          {`
            .pacific-font { font-family: 'serif'; font-size: 24px; fill: hsl(var(--sidebar-primary)); font-weight: bold; }
            .events-font { font-family: 'sans-serif'; font-size: 10px; fill: hsl(var(--sidebar-primary)); font-weight: 300; letter-spacing: 0.1em; }
          `}
        </style>
      </defs>
      
      <text x="5" y="22" className="pacific-font">Pacific</text>
      <text x="7" y="35" className="events-font">EVENTS</text>
    </svg>
  );
}
