import AnoAI from './ui/animated-shader-background';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function AnimatedSection({ children, className = '', id }: AnimatedSectionProps) {
  return (
    <div id={id} className={`relative overflow-hidden ${className}`}>
      <AnoAI />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
