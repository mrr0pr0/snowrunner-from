/** Map marker (Leaflet-compatible lat/lng) */
export interface MapMarker {
    id: string;
    guideId: string;
    lat: number;
    lng: number;
    title: string;
    description: string | null;
    markerType: MarkerType;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export type MarkerType = 'waypoint' | 'hazard' | 'resource' | 'garage' | 'other';
  
  /** Lat/lng for Leaflet */
  export interface LatLng {
    lat: number;
    lng: number;
  }
  