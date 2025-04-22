import { TouristPlace } from '@/types';
import dynamic from 'next/dynamic';
import { GlobeMethods } from 'react-globe.gl';
import { useGlobeObject } from './globe-object';
import { useTheme } from 'next-themes';

interface GlobeContainerProps {
  isClient: boolean;
  buildingsData: Array<
    TouristPlace & { altitude: number; radius: number; height: number }
  >;
  globeRef: React.RefObject<GlobeMethods | undefined>;
  onObjectHover: (object: TouristPlace | null) => void;
  setIsMouseOverGlobe: (isOver: boolean) => void;
}

const Globe = dynamic(
  () => import('react-globe.gl').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] w-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

export const GlobeContainer = ({
  isClient,
  buildingsData,
  globeRef,
  onObjectHover,
  setIsMouseOverGlobe,
}: GlobeContainerProps) => {
  const objectsThreeObject = useGlobeObject();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const globeImageUrl = isDarkMode
    ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
    : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

  return (
    <div className="w-full h-[600px] flex items-center justify-center relative">
      {isClient && (
        <div
          onPointerEnter={() => setIsMouseOverGlobe(true)}
          onPointerLeave={() => setIsMouseOverGlobe(false)}
          className="inline-block"
        >
          <Globe
            ref={globeRef}
            globeImageUrl={globeImageUrl}
            backgroundImageUrl=""
            backgroundColor="rgba(0,0,0,0)"
            objectsData={buildingsData}
            objectLat="lat"
            objectLng="lng"
            objectAltitude="altitude"
            objectThreeObject={objectsThreeObject}
            objectLabel={(d) => {
              const place = d as TouristPlace;
              return `
                <div class="bg-transparent backdrop-blur-sm p-3 rounded-xl shadow-lg text-sm" style="min-width: 150px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                  <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px; color: white;">${place.name}</div>
                  <div style="color: rgba(255,255,255,0.9);">${place.country}</div>
                </div>
              `;
            }}
            onObjectHover={(object) =>
              onObjectHover(object as TouristPlace | null)
            }
            width={800}
            height={600}
          />
        </div>
      )}
    </div>
  );
};
