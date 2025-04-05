import { TouristPlace } from '@/types';
import { useCallback } from 'react';
import * as THREE from 'three';

export const useGlobeObject = () => {
  const objectsThreeObject = useCallback((d: object) => {
    const place = d as TouristPlace;

    const latRad = THREE.MathUtils.degToRad(place.lat);
    const lngRad = THREE.MathUtils.degToRad(place.lng);

    const dirVector = new THREE.Vector3(
      Math.cos(latRad) * Math.cos(lngRad),
      Math.sin(latRad),
      Math.cos(latRad) * Math.sin(lngRad)
    ).normalize();

    const scaleFactor = 100 / 3;
    const markerScale = 0.75;

    const globeRadius = 1;

    const surfacePoint = dirVector.clone().multiplyScalar(globeRadius);

    const group = new THREE.Group();

    const cssVarRegex = /var\(\s*(--[a-zA-Z0-9-_]+)\s*\)/;
    const cssVarMatch = cssVarRegex.exec(place.color);
    const pinColor =
      cssVarMatch && typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement)
            .getPropertyValue(cssVarMatch[1])
            .trim()
        : place.color;

    const sphereGeometry = new THREE.SphereGeometry(
      0.12 * scaleFactor * markerScale,
      16,
      16
    );
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: pinColor,
      metalness: 0.5,
      roughness: 0.2,
      emissive: new THREE.Color(pinColor),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.95,
    });
    sphereMaterial.depthTest = false;
    sphereMaterial.depthWrite = false;
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    const stemGeometry = new THREE.CylinderGeometry(
      0.03 * scaleFactor * markerScale,
      0.08 * scaleFactor * markerScale,
      0.25 * scaleFactor * markerScale,
      12
    );

    const stemMaterial = new THREE.MeshStandardMaterial({
      color: pinColor,
      metalness: 0.3,
      roughness: 0.4,
      emissive: new THREE.Color(pinColor),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.97,
    });
    stemMaterial.depthTest = false;
    stemMaterial.depthWrite = false;
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);

    const pin = new THREE.Group();
    pin.add(sphere);
    pin.add(stem);

    stem.position.set(0, -0.15 * scaleFactor * markerScale, 0);

    pin.position.copy(surfacePoint);
    const radial = surfacePoint.clone().normalize();
    pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), radial);
    pin.rotateX(Math.PI);

    group.add(pin);

    const ringGeometry = new THREE.RingGeometry(
      0.15 * scaleFactor * markerScale,
      0.18 * scaleFactor * markerScale,
      32
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: pinColor,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    ringMaterial.depthTest = false;
    ringMaterial.depthWrite = false;
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    ring.position.copy(
      surfacePoint.clone().add(dirVector.clone().multiplyScalar(0.01))
    );
    ring.lookAt(0, 0, 0);
    ring.rotateX(Math.PI / 2);

    const outerRingGeometry = new THREE.RingGeometry(
      0.22 * scaleFactor * markerScale,
      0.24 * scaleFactor * markerScale,
      32
    );
    const outerRingMaterial = new THREE.MeshBasicMaterial({
      color: pinColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    outerRingMaterial.depthTest = false;
    outerRingMaterial.depthWrite = false;
    const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);

    outerRing.position.copy(
      surfacePoint.clone().add(dirVector.clone().multiplyScalar(0.01))
    );
    outerRing.lookAt(new THREE.Vector3(0, 0, 0));

    group.add(ring);
    group.add(outerRing);

    const glowGeometry = new THREE.SphereGeometry(
      0.3 * scaleFactor * markerScale,
      16,
      16
    );
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: pinColor,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    glowMaterial.depthTest = false;
    glowMaterial.depthWrite = false;
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(surfacePoint);

    group.add(glow);

    group.userData = {
      placeId: place.id,
      isHovered: false,
      dirVector: dirVector.clone(),
      ring: ring,
      outerRing: outerRing,
      pulsePhase: Math.random() * Math.PI * 2,
    };

    return group;
  }, []);

  return objectsThreeObject;
};
