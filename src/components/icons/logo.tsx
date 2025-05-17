
import { FileSignature } from 'lucide-react';
import type { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <FileSignature className="h-8 w-8" />
      <span className="text-2xl font-semibold">Contract Decoder</span> {/* Updated App Name */}
    </div>
  );
};

export default Logo;
