interface WaveDividerProps {
  bgColor: string;
  fillColor: string;
  path?: string;
}

const defaultPaths = [
  "M0,40 C360,0 720,60 1080,20 C1260,0 1380,30 1440,10 L1440,60 L0,60Z",
  "M0,20 C240,60 480,0 720,40 C960,70 1200,10 1440,30 L1440,60 L0,60Z",
  "M0,30 C180,60 360,0 540,40 C720,70 900,10 1080,45 C1260,70 1380,20 1440,35 L1440,60 L0,60Z",
  "M0,40 C300,10 600,50 900,20 C1100,0 1300,40 1440,25 L1440,60 L0,60Z",
  "M0,20 C360,55 720,5 1080,40 C1260,55 1380,15 1440,30 L1440,60 L0,60Z",
  "M0,35 C200,5 400,55 600,25 C800,0 1000,50 1200,20 C1350,0 1420,40 1440,30 L1440,60 L0,60Z",
  "M0,25 C240,55 480,10 720,40 C960,65 1200,15 1440,35 L1440,60 L0,60Z",
  "M0,30 C360,0 720,55 1080,15 C1260,0 1380,40 1440,25 L1440,60 L0,60Z",
];

export default function WaveDivider({
  bgColor,
  fillColor,
  path,
}: WaveDividerProps) {
  const d =
    path ||
    defaultPaths[Math.floor(Math.random() * defaultPaths.length)];

  return (
    <div className="relative w-full leading-[0] overflow-hidden" style={{ background: bgColor }}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full h-[60px]"
      >
        <path d={d} fill={fillColor} />
      </svg>
    </div>
  );
}
