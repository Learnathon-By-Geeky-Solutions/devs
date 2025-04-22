export interface RouteInstructionItem {
  type: string;
  distance: number;
  time: number;
  road: string;
  direction: string;
  index: number;
  mode: string;
  modifier?: string;
  text: string;
  exit?: number;
}

export interface RouteSummary {
  totalDistance: number;
  totalTime: number;
}

export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface RouteWaypoint {
  options: {
    allowUTurn: boolean;
  };
  latLng: {
    lng: number;
    lat?: number;
  };
  name: string;
  _initHooksCalled: boolean;
}

export interface RouteData {
  name: string;
  instructions: RouteInstructionItem[];
  summary: RouteSummary;
  coordinates: RouteCoordinate[];
  waypointIndices: number[];
  inputWaypoints: RouteWaypoint[];
  waypoints: RouteWaypoint[];
  properties?: {
    isSimplified: boolean;
  };
  routesIndex: number;
}

export interface MapControllerProps {
  center: { lat: number; lng: number };
  destination?: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  directions: boolean;
  waypoints: Array<{ lat: number; lng: number }>;
  onMapLoaded?: () => void;
  onRouteCalculated?: (routeData: RouteData) => void;
  locationName?: string;
}
