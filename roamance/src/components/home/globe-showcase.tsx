'use client';

import { SectionHeading } from '@/components/common/section-heading';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { GlobeMethods } from 'react-globe.gl';
import { touristPlaces } from '@/constants';
import { TouristPlace } from '@/types';
import * as THREE from 'three';
import gsap from 'gsap';

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

export function GlobeShowcase() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Create building objects data structure with custom shapes
  const buildingsData = useMemo(
    () =>
      places.map((place) => ({
        ...place,
        altitude: 0.05,
        lat: place.lat,
        lng: place.lng,
        radius: 0.2,
        height: 0.3 + place.size * 0.2,
        color: place.color,
      })),
    [places]
  );

  // Custom 3D object factory for buildings
  const objectsThreeObject = useCallback((d: object) => {
    const place = d as TouristPlace;
    const buildingHeight = 0.3 + place.size * 0.2;
    const buildingGeometry = new THREE.BoxGeometry(0.4, buildingHeight * 2, 0.4);
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: place.color.replace('var(--', '').replace(')', ''),
      transparent: true,
      opacity: 0.8,
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

    // Simplify approach: Place objects at a fixed altitude from the globe center
    const globeRadius = 1;
    const gap = 8; // Increased gap to position buildings clearly outside the globe

    // Calculate position based on lat/lng (spherical to Cartesian conversion)
    const latRad = THREE.MathUtils.degToRad(place.lat);
    const lngRad = THREE.MathUtils.degToRad(place.lng);

    // Calculate outward direction vector
    const dirVector = new THREE.Vector3(
      Math.cos(latRad) * Math.cos(lngRad),
      Math.sin(latRad),
      Math.cos(latRad) * Math.sin(lngRad)
    ).normalize();

    // Position surface point and object point
    const surfacePoint = dirVector.clone().multiplyScalar(globeRadius);
    const objectPosition = dirVector.clone().multiplyScalar(globeRadius + gap);

    // Position the building directly at the object position
    building.position.copy(objectPosition);

    // Orient the building to face outward from the center of the globe
    building.lookAt(new THREE.Vector3(0, 0, 0));
    // Rotate 90 degrees so the building stands up properly
    building.rotateX(Math.PI / 2);

    // Create a visible connector line with improved visibility
    const lineMaterial = new THREE.LineBasicMaterial({
      color: building.material.color.getHex(),
      opacity: 0.7,
      transparent: true,
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      surfacePoint,
      objectPosition
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);

    // Create a more visible marker at the surface connection point
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: building.material.color.getHex()
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(surfacePoint);

    // Add a glow effect sphere around the building for hover highlighting
    const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: building.material.color.getHex(),
      transparent: true,
      opacity: 0,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(objectPosition);

    // Create group and add all elements
    const group = new THREE.Group();
    group.add(line);
    group.add(marker);
    group.add(building);
    group.add(glow);

    // Apply scaling to the group
    group.scale.set(15, 15, 15);

    // Store place data and hover state in the group's userData
    group.userData = {
      placeId: place.id,
      isHovered: false
    };

    return group;
  }, []);

  // Add update function to handle hover animations
  useEffect(() => {
    if (!globeRef.current) return;

    // Animation loop to update object appearances
    const animate = () => {
      if (globeRef.current?.scene) {
        // Find all group objects in the scene
        globeRef.current.scene().traverse((object) => {
          if (object instanceof THREE.Group && object.userData && object.userData.placeId !== undefined) {
            const isSelected = selectedPlace && object.userData.placeId === selectedPlace.id;

            // Find the building and glow objects within the group
            const building = object.children.find(child =>
              child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry
            );

            const glow = object.children.find(child =>
              child instanceof THREE.Mesh &&
              child.geometry instanceof THREE.SphereGeometry &&
              child.material.opacity !== undefined &&
              (child.material as THREE.MeshBasicMaterial).transparent === true
            );

            if (building && glow) {
              // Animate scale on hover
              if (isSelected && !object.userData.isHovered) {
                object.userData.isHovered = true;

                // Scale up the building
                gsap.to(building.scale, {
                  x: 1.3, y: 1.3, z: 1.3,
                  duration: 0.3
                });

                // Make glow visible
                gsap.to(((glow as THREE.Mesh).material as THREE.MeshBasicMaterial), {
                  opacity: 0.3,
                  duration: 0.5
                });
              }
              else if (!isSelected && object.userData.isHovered) {
                object.userData.isHovered = false;

                // Scale back to normal
                gsap.to(building.scale, {
                  x: 1, y: 1, z: 1,
                  duration: 0.3
                });

                // Hide glow
                gsap.to(((glow as THREE.Mesh).material as THREE.MeshBasicMaterial), {
                  opacity: 0,
                  duration: 0.5
                });
              }
            }
          }
        });
      }
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // No explicit cleanup needed for requestAnimationFrame as it will stop when component unmounts
    };
  }, [selectedPlace]);

  useEffect(() => {
    setIsClient(true);

    const timer = setTimeout(() => {
      setPlaces(touristPlaces);
    }, 1000);

    let interval: NodeJS.Timeout;
    const startAutoRotation = () => {
      interval = setInterval(() => {
        if (globeRef.current) {
          const pov = globeRef.current.pointOfView();
          const currentLng = pov ? pov.lng : 0;
          globeRef.current.pointOfView({
            lat: 25,
            lng: currentLng + 1,
            altitude: 2.5,
          });
        }
      }, 100);
    };

    const stopInterval = () => clearInterval(interval);

    if (isClient) {
      setTimeout(() => {
        startAutoRotation();
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
      stopInterval();
    };
  }, [isClient]);

  const handlePlaceHover = (place: TouristPlace | null) => {
    setSelectedPlace(place);
    if (globeRef.current && place) {
      globeRef.current.pointOfView({
        lat: place.lat,
        lng: place.lng,
        altitude: 1.8,
      },
      1000
      );
    }
  };

  return (
    <section className="py-24 overflow-hidden relative bg-background/80">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-forest/5 blur-3xl"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-sunset/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Explore the World"
          titleHighlight="World"
          subtitle="Discover breathtaking destinations around the globe with our interactive 3D map"
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          <div className="lg:w-2/3 h-[500px] flex items-center justify-center relative">
            {isClient && (
              <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
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
                <div class="bg-background/90 backdrop-blur-md p-2 rounded-lg border shadow-lg text-sm">
                  <b>${place.name}</b><br/>
                  ${place.country}
                </div>
              `;
                }}
                onObjectHover={(object) =>
                  handlePlaceHover(object as TouristPlace | null)
                }
                width={500}
                height={500}
              />
            )}
          </div>

          <div className="lg:w-1/3 px-4">
            {selectedPlace ? (
              <motion.div
                className="bg-background/80 backdrop-blur-md p-6 rounded-xl border shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={selectedPlace.id}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      `bg-${selectedPlace.color.split('--')[1]}/20`
                    )}
                  >
                    <MapPin
                      className={cn(
                        'h-5 w-5',
                        `text-${selectedPlace.color.split('--')[1]}`
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedPlace.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlace.country}
                    </p>
                  </div>
                </div>
                <p className="mb-4">{selectedPlace.description}</p>
                <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors">
                  Explore more about {selectedPlace.name}
                </button>
              </motion.div>
            ) : (
              <div className="bg-background/80 backdrop-blur-md p-6 rounded-xl border h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">Interactive Globe</h3>
                <p className="text-muted-foreground">
                  Hover over the 3D buildings to learn more about some of the
                  world&apos;s most famous destinations. Click to explore
                  further details about each location.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  The globe shows 7 of the world&apos;s most iconic tourist
                  destinations across different continents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
