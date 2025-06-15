
import React from 'react';
import QuadrantView from './QuadrantView';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface OdontogramGridProps {
  className?: string;
}

const OdontogramGrid: React.FC<OdontogramGridProps> = ({ className }) => {
  return (
    <div className={cn("w-full mx-auto p-6 bg-white rounded-xl shadow-lg overflow-hidden", className)}>
      {/* Arcada Superior */}
      <div className="flex items-center justify-center gap-8 mb-8 min-h-0">
        <div className="flex-1">
          <QuadrantView quadrant="upperRight" />
        </div>
        <Separator orientation="vertical" className="h-16 bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <QuadrantView quadrant="upperLeft" />
        </div>
      </div>
      
      {/* Línea divisoria horizontal */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />
      
      {/* Arcada Inferior */}
      <div className="flex items-center justify-center gap-8 min-h-0">
        <div className="flex-1">
          <QuadrantView quadrant="lowerRight" />
        </div>
        <Separator orientation="vertical" className="h-16 bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <QuadrantView quadrant="lowerLeft" />
        </div>
      </div>
    </div>
  );
};

export default OdontogramGrid;
