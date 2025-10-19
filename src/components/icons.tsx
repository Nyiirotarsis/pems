export function PacificEventsLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      width="200"
      height="40"
    >
      <defs>
        <style>
          {`
            .pacific-font { font-family: 'serif'; font-size: 24px; fill: hsl(var(--sidebar-primary)); font-weight: bold; }
            .events-font { font-family: 'sans-serif'; font-size: 24px; fill: hsl(var(--sidebar-primary)); font-weight: 300; }
          `}
        </style>
      </defs>
      
      <text x="5" y="28" className="pacific-font">Pacific</text>
      <text x="95" y="28" className="events-font">Events</text>
    </svg>
  );
}
