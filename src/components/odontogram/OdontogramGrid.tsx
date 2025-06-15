
import React from 'react';
import QuadrantView from './QuadrantView';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface OdontogramGridProps {
  className?: string;
}

const OdontogramGrid: React.FC<OdontogramGridProps> = ({ className }) => {
  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-hidden", className)}>
      {/* Arcada Superior */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <QuadrantView quadrant="upperRight" />
        </div>
        <Separator orientation="vertical" className="h-12 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <QuadrantView quadrant="upperLeft" />
        </div>
      </div>
      
      {/* Línea divisoria horizontal */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />
      
      {/* Arcada Inferior */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 min-w-0">
          <QuadrantView quadrant="lowerRight" />
        </div>
        <Separator orientation="vertical" className="h-12 bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <QuadrantView quadrant="lowerLeft" />
        </div>
      </div>
    </div>
  );
};

export default OdontogramGrid;
