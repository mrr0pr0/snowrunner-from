import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GuideMap.css';

// Fix default marker icon in bundlers
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = icon;

export interface GuideMapProps {
  markers: Array<{ lat: number; lng: number; title: string; description: string | null; markerType: string }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const defaultCenter: L.LatLngExpression = [55.0, 37.0];
const defaultZoom = 4;

const GuideMap: FC<GuideMapProps> = ({
  markers,
  center,
  zoom = defaultZoom,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current).setView(
      center ? [center.lat, center.lng] : defaultCenter,
      zoom
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();
    const latLngs: L.LatLngTuple[] = [];
    markers.forEach((m) => {
      const latLng: L.LatLngTuple = [m.lat, m.lng];
      latLngs.push(latLng);
      const marker = L.marker(latLng);
      const popupContent = `<strong>${escapeHtml(m.title)}</strong>${m.description ? `<br/>${escapeHtml(m.description)}` : ''}<br/><small>${m.markerType}</small>`;
      marker.bindPopup(popupContent);
      layer.addLayer(marker);
    });
    if (latLngs.length > 0 && !center) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [markers, center]);

  return <div ref={containerRef} className={`guide-map ${className}`} />;
};

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

export default GuideMap;
