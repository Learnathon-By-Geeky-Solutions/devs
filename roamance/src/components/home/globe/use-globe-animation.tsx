import { TouristPlace } from '@/types';
import gsap from 'gsap';
import { useEffect } from 'react';
import { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';

export const useGlobeAnimation = (
  globeRef: React.RefObject<GlobeMethods | undefined>,
  selectedPlace: TouristPlace | null,
  isClient: boolean,
  isMouseOverGlobe: boolean
) => {
  useEffect(() => {
    if (!globeRef.current) return;
    let lastTime = performance.now();
    const animate = () => {
      if (!globeRef.current?.scene) {
        requestAnimationFrame(animate);
        return;
      }
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const time = currentTime * 0.001;
      const pov = globeRef.current.pointOfView();
      if (!pov) {
        requestAnimationFrame(animate);
        return;
      }
      const cameraLat = THREE.MathUtils.degToRad(pov.lat);
      const cameraLng = THREE.MathUtils.degToRad(pov.lng);
      const cameraVector = new THREE.Vector3(
        Math.cos(cameraLat) * Math.cos(cameraLng),
        Math.sin(cameraLat),
        Math.cos(cameraLat) * Math.sin(cameraLng)
      ).normalize();

      globeRef.current.scene().traverse((object) => {
        if (
          !(object instanceof THREE.Group) ||
          !object.userData ||
          object.userData.placeId === undefined
        )
          return;

        if (object.userData.dirVector) {
          const dotProduct = cameraVector.dot(object.userData.dirVector);
          const isVisible = dotProduct > 0.25;

          if (selectedPlace && object.userData.placeId === selectedPlace.id) {
            object.visible = true;
            object.userData.hideLabel = false;
          } else {
            object.visible = isVisible;
            object.userData.hideLabel = !isVisible;
            if (!isVisible) return;
          }
        }

        const isSelected =
          selectedPlace && object.userData.placeId === selectedPlace.id;
        const pinGroup = object.children.find(
          (child) => child instanceof THREE.Group
        );
        const ring = object.userData.ring;
        const outerRing = object.userData.outerRing;
        if (ring && outerRing) {
          const phase = object.userData.pulsePhase || 0;
          const pulse = 0.3 + 0.2 * Math.sin(time * 1.5 + phase);
          const outerPulse =
            0.2 + 0.15 * Math.sin(time * 1.2 + phase + Math.PI);
          (ring.material as THREE.MeshBasicMaterial).opacity = pulse;
          (outerRing.material as THREE.MeshBasicMaterial).opacity = outerPulse;
          ring.rotation.z += delta * 0.2;
          outerRing.rotation.z -= delta * 0.15;
        }
        const glow = object.children.find(
          (child) =>
            child instanceof THREE.Mesh &&
            child.geometry instanceof THREE.SphereGeometry
        );
        if (pinGroup && glow) {
          if (isSelected && !object.userData.isHovered) {
            object.userData.isHovered = true;
            if (pinGroup.scale.x !== 1.3) {
              gsap.to(pinGroup.scale, {
                x: 1.3,
                y: 1.3,
                z: 1.3,
                duration: 0.3,
              });
            }
            gsap.to((glow as THREE.Mesh).material as THREE.MeshBasicMaterial, {
              opacity: 0.3,
              duration: 0.5,
            });
          } else if (!isSelected && object.userData.isHovered) {
            object.userData.isHovered = false;
            if (pinGroup.scale.x !== 1) {
              gsap.to(pinGroup.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
              });
            }
            gsap.to((glow as THREE.Mesh).material as THREE.MeshBasicMaterial, {
              opacity: 0,
              duration: 0.5,
            });
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [selectedPlace, globeRef]);

  useEffect(() => {
    let rotationFrame: number;
    const rotate = () => {
      if (globeRef.current && !selectedPlace && !isMouseOverGlobe) {
        const pov = globeRef.current.pointOfView();
        const currentLng = pov ? pov.lng : 0;
        globeRef.current.pointOfView({
          lat: 25,
          lng: currentLng + 0.5,
          altitude: 2.5,
        });
      }
      rotationFrame = requestAnimationFrame(rotate);
    };

    if (isClient) {
      rotationFrame = requestAnimationFrame(rotate);
    }

    return () => {
      cancelAnimationFrame(rotationFrame);
    };
  }, [isClient, selectedPlace, isMouseOverGlobe, globeRef]);
};
