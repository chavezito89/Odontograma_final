
import React from 'react';
import QuadrantView from './QuadrantView';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface OdontogramGridProps {
  className?: string;
}

const OdontogramGrid: React.FC<OdontogramGridProps> = ({ className }) => {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';
  
  // Tamaño dinámico del contenedor según el estado del sidebar
  const containerPadding = isCollapsed ? 'p-8' : 'p-6';
  const quadrantGap = isCollapsed ? 'gap-12' : 'gap-8';
  const separatorHeight = isCollapsed ? 'h-20' : 'h-16';

  return (
    <div className={cn(
      "w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden", 
      containerPadding,
      className
    )}>
      {/* Arcada Superior */}
      <div className={cn("flex items-center justify-center mb-8 min-h-0", quadrantGap)}>
        <div className="flex-1">
          <QuadrantView quadrant="upperRight" />
        </div>
        <Separator orientation="vertical" className={cn(separatorHeight, "bg-gray-200 flex-shrink-0")} />
        <div className="flex-1">
          <QuadrantView quadrant="upperLeft" />
        </div>
      </div>
      
      {/* Línea divisoria horizontal */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />
      
      {/* Arcada Inferior */}
      <div className={cn("flex items-center justify-center min-h-0", quadrantGap)}>
        <div className="flex-1">
          <QuadrantView quadrant="lowerRight" />
        </div>
        <Separator orientation="vertical" className={cn(separatorHeight, "bg-gray-200 flex-shrink-0")} />
        <div className="flex-1">
          <QuadrantView quadrant="lowerLeft" />
        </div>
      </div>
    </div>
  );
};

export default OdontogramGrid;
