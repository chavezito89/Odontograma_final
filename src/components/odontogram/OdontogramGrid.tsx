
import React from 'react';
import QuadrantView from './QuadrantView';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface OdontogramGridProps {
  className?: string;
}

const OdontogramGrid: React.FC<OdontogramGridProps> = ({ className }) => {
  return (
    <div className={cn("w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg", className)}>
      {/* Arcada Superior */}
      <div className="flex items-center justify-center gap-12 mb-12">
        <QuadrantView quadrant="upperRight" />
        <Separator orientation="vertical" className="h-20 bg-gray-200" />
        <QuadrantView quadrant="upperLeft" />
      </div>
      
      {/* Línea divisoria horizontal */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12" />
      
      {/* Arcada Inferior */}
      <div className="flex items-center justify-center gap-12">
        <QuadrantView quadrant="lowerRight" />
        <Separator orientation="vertical" className="h-20 bg-gray-200" />
        <QuadrantView quadrant="lowerLeft" />
      </div>
    </div>
  );
};

export default OdontogramGrid;
