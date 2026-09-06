import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass } from 'lucide-react';
import type { OrcaResponse } from '../types/orca';
import { TRANSLATIONS, type Language } from '../i18n/translations';

interface MarineMapProps {
  data?: OrcaResponse;
  onMapClick?: (lat: number, lon: number) => void;
  onPortSelect?: (portName: string) => void;
  currentLang?: Language;
}

// Shore regions quick presets for India's 7516 km coastline
const SHORE_REGIONS = [
  { id: 'all', name_en: 'Pan-India Coast', name_hi: 'अखिल भारतीय तट', name_mr: 'अखिल भारतीय किनारा', center: [15.5, 78.0], zoom: 5, emoji: '🇮🇳' },
  { id: 'gujarat', name_en: 'Gujarat & Kutch', name_hi: 'गुजरात व कच्छ', name_mr: 'गुजरात व कच्छ', center: [21.8, 69.8], zoom: 7, emoji: '🌊' },
  { id: 'konkan', name_en: 'Konkan (Mumbai/Ratnagiri)', name_hi: 'कोंकण (मुंबई/रत्नागिरी)', name_mr: 'कोकण (मुंबई/रत्नागिरी)', center: [17.5, 73.0], zoom: 7, emoji: '⚓' },
  { id: 'canara_goa', name_en: 'Goa & Canara', name_hi: 'गोवा व कैनरा तट', name_mr: 'गोवा व कानडा किनारा', center: [14.2, 74.5], zoom: 7, emoji: '🌴' },
  { id: 'malabar', name_en: 'Malabar (Kochi/Kerala)', name_hi: 'मालाबार (कोच्चि/केरल)', name_mr: 'मलबार (कोची/केरळ)', center: [9.8, 76.0], zoom: 7, emoji: '🛶' },
  { id: 'coromandel', name_en: 'Coromandel (Chennai)', name_hi: 'कोरोमंडल (चेन्नई/तमिलनाडु)', name_mr: 'कोरोमंडल (चेन्नई/तामिळनाडू)', center: [10.8, 79.8], zoom: 7, emoji: '🌅' },
  { id: 'andhra_odisha', name_en: 'Andhra & Odisha', name_hi: 'आंध्र व ओडिशा (विजाग/पारादीप)', name_mr: 'आंध्र व ओडिशा (विझाग/पारादीप)', center: [18.5, 84.5], zoom: 7, emoji: '🚢' },
  { id: 'bengal', name_en: 'Bengal Delta & Sundarbans', name_hi: 'बंगाल डेल्टा व सुंदरबन', name_mr: 'बंगाल डेल्टा व सुंदरबन', center: [21.8, 88.0], zoom: 7, emoji: '🌿' },
  { id: 'islands', name_en: 'Lakshadweep & Andamans', name_hi: 'लक्षद्वीप व अंडमान', name_mr: 'लक्षद्वीप व अंदमान', center: [11.5, 83.0], zoom: 6, emoji: '🏝️' }
];

const COASTAL_PORTS = [
  { id: 'ratnagiri', name: 'Ratnagiri', state: 'Maharashtra', lat: 16.9902, lon: 73.3120, zone: 'Konkan Coast' },
  { id: 'mumbai', name: 'Mumbai (Sassoon Docks / JNPT)', state: 'Maharashtra', lat: 18.9220, lon: 72.8347, zone: 'North Konkan' },
  { id: 'alibaug', name: 'Alibaug', state: 'Maharashtra', lat: 18.6414, lon: 72.8722, zone: 'North Konkan' },
  { id: 'harnai', name: 'Harnai / Dapoli', state: 'Maharashtra', lat: 17.8100, lon: 73.0900, zone: 'Konkan Coast' },
  { id: 'malvan', name: 'Malvan', state: 'Maharashtra', lat: 16.0558, lon: 73.4687, zone: 'South Konkan' },
  { id: 'vengurla', name: 'Vengurla', state: 'Maharashtra', lat: 15.8600, lon: 73.6300, zone: 'South Konkan' },
  { id: 'goa', name: 'Goa / Panaji (Mormugao)', state: 'Goa', lat: 15.4989, lon: 73.8278, zone: 'Goa Coast' },
  { id: 'karwar', name: 'Karwar (Baithkol)', state: 'Karnataka', lat: 14.8136, lon: 74.1298, zone: 'Canara Coast' },
  { id: 'tadadi', name: 'Tadadi / Gokarna', state: 'Karnataka', lat: 14.5200, lon: 74.3500, zone: 'Canara Coast' },
  { id: 'bhatkal', name: 'Bhatkal', state: 'Karnataka', lat: 13.9700, lon: 74.5500, zone: 'Canara Coast' },
  { id: 'malpe', name: 'Malpe / Udupi', state: 'Karnataka', lat: 13.3500, lon: 74.7000, zone: 'Canara Coast' },
  { id: 'mangalore', name: 'Mangalore (Old Port)', state: 'Karnataka', lat: 12.8703, lon: 74.8806, zone: 'Canara Coast' },
  { id: 'kasaragod', name: 'Kasaragod', state: 'Kerala', lat: 12.4996, lon: 74.9869, zone: 'Malabar Coast' },
  { id: 'kannur', name: 'Kannur (Ayikkara)', state: 'Kerala', lat: 11.8745, lon: 75.3704, zone: 'Malabar Coast' },
  { id: 'calicut', name: 'Calicut (Kozhikode / Beypore)', state: 'Kerala', lat: 11.1780, lon: 75.8070, zone: 'Malabar Coast' },
  { id: 'kochi', name: 'Kochi (Cochin Fishing Harbour)', state: 'Kerala', lat: 9.9312, lon: 76.2673, zone: 'Malabar Coast' },
  { id: 'alappuzha', name: 'Alappuzha (Alleppey)', state: 'Kerala', lat: 9.4981, lon: 76.3388, zone: 'Malabar Coast' },
  { id: 'kollam', name: 'Kollam (Neendakara)', state: 'Kerala', lat: 8.9430, lon: 76.5380, zone: 'Malabar Coast' },
  { id: 'vizhinjam', name: 'Vizhinjam', state: 'Kerala', lat: 8.3813, lon: 76.9909, zone: 'Travancore Coast' },
  { id: 'kanyakumari', name: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lon: 77.5385, zone: 'South Tip' },
  { id: 'colachel', name: 'Colachel', state: 'Tamil Nadu', lat: 8.1750, lon: 77.2550, zone: 'South Tip' },
  { id: 'tuticorin', name: 'Tuticorin (Thoothukudi)', state: 'Tamil Nadu', lat: 8.7642, lon: 78.1348, zone: 'Gulf of Mannar' },
  { id: 'rameswaram', name: 'Rameswaram / Mandapam', state: 'Tamil Nadu', lat: 9.2876, lon: 79.3129, zone: 'Palk Bay' },
  { id: 'nagapattinam', name: 'Nagapattinam', state: 'Tamil Nadu', lat: 10.7672, lon: 79.8428, zone: 'Coromandel Coast' },
  { id: 'cuddalore', name: 'Cuddalore', state: 'Tamil Nadu', lat: 11.7480, lon: 79.7714, zone: 'Coromandel Coast' },
  { id: 'puducherry', name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lon: 79.8083, zone: 'Coromandel Coast' },
  { id: 'chennai', name: 'Chennai (Kasimedu)', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, zone: 'Coromandel Coast' },
  { id: 'krishnapatnam', name: 'Krishnapatnam', state: 'Andhra Pradesh', lat: 14.2500, lon: 80.1200, zone: 'Coastal Andhra' },
  { id: 'machilipatnam', name: 'Machilipatnam', state: 'Andhra Pradesh', lat: 16.1800, lon: 81.1300, zone: 'Krishna Delta' },
  { id: 'kakinada', name: 'Kakinada', state: 'Andhra Pradesh', lat: 16.9891, lon: 82.2475, zone: 'Godavari Coast' },
  { id: 'visakhapatnam', name: 'Visakhapatnam (Vizag Harbour)', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185, zone: 'Northern Circars' },
  { id: 'kalingapatnam', name: 'Kalingapatnam / Bhavanapadu', state: 'Andhra Pradesh', lat: 18.3300, lon: 84.1200, zone: 'Northern Circars' },
  { id: 'gopalpur', name: 'Gopalpur', state: 'Odisha', lat: 19.2600, lon: 84.9100, zone: 'Utkal Coast' },
  { id: 'puri', name: 'Puri / Chandrabhaga', state: 'Odisha', lat: 19.8135, lon: 85.8312, zone: 'Utkal Coast' },
  { id: 'paradip', name: 'Paradip (Mahanadi Rivermouth)', state: 'Odisha', lat: 20.2644, lon: 86.6083, zone: 'Utkal Coast' },
  { id: 'dhamra', name: 'Dhamra / Chandipur', state: 'Odisha', lat: 20.8000, lon: 86.9600, zone: 'Utkal Coast' },
  { id: 'digha', name: 'Digha (Shankarpur)', state: 'West Bengal', lat: 21.6266, lon: 87.5074, zone: 'Bengal Delta' },
  { id: 'kakdwip', name: 'Kakdwip / Fraserganj (Sundarbans)', state: 'West Bengal', lat: 21.8700, lon: 88.1800, zone: 'Sundarbans Delta' },
  { id: 'haldia', name: 'Haldia', state: 'West Bengal', lat: 22.0667, lon: 88.0667, zone: 'Hooghly Estuary' },
  { id: 'porbandar', name: 'Porbandar', state: 'Gujarat', lat: 21.6417, lon: 69.6293, zone: 'Saurashtra Coast' },
  { id: 'veraval', name: 'Veraval (Somnath)', state: 'Gujarat', lat: 20.9077, lon: 70.3678, zone: 'Saurashtra Coast' },
  { id: 'okha', name: 'Okha / Dwarka', state: 'Gujarat', lat: 22.4667, lon: 69.0667, zone: 'Gulf of Kutch' },
  { id: 'kandla', name: 'Kandla / Deendayal Port', state: 'Gujarat', lat: 23.0033, lon: 70.2189, zone: 'Gulf of Kutch' },
  { id: 'surat_hazira', name: 'Surat / Hazira', state: 'Gujarat', lat: 21.1167, lon: 72.6500, zone: 'Gulf of Khambhat' },
  { id: 'port_blair', name: 'Port Blair', state: 'Andaman & Nicobar', lat: 11.6234, lon: 92.7265, zone: 'Andaman Sea' },
  { id: 'havelock', name: 'Swaraj Dweep (Havelock)', state: 'Andaman & Nicobar', lat: 12.0000, lon: 92.9800, zone: 'Andaman Sea' },
  { id: 'campbell_bay', name: 'Campbell Bay', state: 'Andaman & Nicobar', lat: 6.9900, lon: 93.9300, zone: 'Nicobar Islands' },
  { id: 'kavaratti', name: 'Kavaratti', state: 'Lakshadweep', lat: 10.5667, lon: 72.6417, zone: 'Lakshadweep Sea' },
  { id: 'agatti', name: 'Agatti Island', state: 'Lakshadweep', lat: 10.8500, lon: 72.1833, zone: 'Lakshadweep Sea' },
  { id: 'minicoy', name: 'Minicoy Island', state: 'Lakshadweep', lat: 8.2833, lon: 73.0500, zone: 'Lakshadweep Sea' }
];

export const MarineMap: React.FC<MarineMapProps> = ({ data, onMapClick, onPortSelect, currentLang = 'en' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Layer toggles
  const [showPorts, setShowPorts] = useState(true);
  const [showSST, setShowSST] = useState(true);
  const [showChlorophyll, setShowChlorophyll] = useState(true);
  const [showPFZ, setShowPFZ] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [selectedShore, setSelectedShore] = useState<string>('all');

  // Layer groups
  const portsLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const sstLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const chlLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const pfzLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const hazardLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const boundaryLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const routeLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const trajectoryLayerGroup = useRef<L.LayerGroup>(L.layerGroup());
  const activeMarkerLayerGroup = useRef<L.LayerGroup>(L.layerGroup());

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLat = data?.query.latitude || 16.9902;
    const initialLon = data?.query.longitude || 73.3120;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 6,
      zoomControl: false,
    });

    const baseTile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; ISRO MOSDAC &copy; INCOIS',
      maxZoom: 19,
      className: 'dark-marine-tiles',
    });
    baseTile.addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    portsLayerGroup.current.addTo(map);
    sstLayerGroup.current.addTo(map);
    chlLayerGroup.current.addTo(map);
    pfzLayerGroup.current.addTo(map);
    hazardLayerGroup.current.addTo(map);
    boundaryLayerGroup.current.addTo(map);
    routeLayerGroup.current.addTo(map);
    trajectoryLayerGroup.current.addTo(map);
    activeMarkerLayerGroup.current.addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)));
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleFlyToRegion = (region: typeof SHORE_REGIONS[0]) => {
    setSelectedShore(region.id);
    if (!mapRef.current) return;
    mapRef.current.flyTo(region.center as L.LatLngExpression, region.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  };

  // Render All Coastline Ports
  useEffect(() => {
    if (!mapRef.current) return;
    portsLayerGroup.current.clearLayers();

    const portsToRender = data?.all_ports && data.all_ports.length > 0 ? data.all_ports : COASTAL_PORTS;
    const activePortName = data?.query.location_name?.toLowerCase() || '';

    portsToRender.forEach((port) => {
      const isCurrentlyActive = activePortName.includes(port.name.toLowerCase()) || activePortName.includes(port.id);

      const portBadgeIcon = L.divIcon({
        className: 'shore-port-badge-container',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); cursor: pointer;">
            <div style="
              width: ${isCurrentlyActive ? '14px' : '10px'};
              height: ${isCurrentlyActive ? '14px' : '10px'};
              border-radius: 50%;
              background: ${isCurrentlyActive ? '#38bdf8' : '#0ea5e9'};
              border: 2px solid white;
              box-shadow: 0 0 8px rgba(14, 165, 233, 0.8);
            "></div>
            <div style="
              margin-top: 3px;
              background: rgba(11, 19, 34, 0.85);
              color: ${isCurrentlyActive ? '#38bdf8' : '#e2e8f0'};
              font-weight: ${isCurrentlyActive ? 'bold' : '600'};
              font-size: 10px;
              padding: 2px 5px;
              border-radius: 4px;
              border: 1px solid ${isCurrentlyActive ? '#0284c7' : '#334155'};
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.5);
              pointer-events: none;
            ">
              ${port.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const portMarker = L.marker([port.lat, port.lon], { icon: portBadgeIcon });
      
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; color: #0f172a; line-height: 1.45; min-width: 190px;">
          <div style="font-weight: bold; color: #0369a1; font-size: 13px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 4px;">
            ⚓ ${port.name}
          </div>
          <b>State:</b> ${port.state} (${port.zone || 'Coastal Zone'})<br/>
          <b>Coords:</b> ${port.lat.toFixed(4)}°N, ${port.lon.toFixed(4)}°E<br/>
          <div style="margin-top: 8px; text-align: center;">
            <button
              id="btn-inspect-port-${port.id}"
              style="
                background: #0284c7;
                color: white;
                border: none;
                padding: 5px 12px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              "
            >
              ${t.btnInspectPort}
            </button>
          </div>
        </div>
      `;

      portMarker.bindPopup(popupHtml);
      portMarker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-port-${port.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onPortSelect) {
              onPortSelect(port.name);
            } else if (onMapClick) {
              onMapClick(port.lat, port.lon);
            }
          };
        }
      });

      portsLayerGroup.current.addLayer(portMarker);
    });
  }, [data, onPortSelect, onMapClick, t]);

  // Sync Layers when data changes
  useEffect(() => {
    if (!mapRef.current || !data) return;

    const map = mapRef.current;
    const lat = data.query.latitude;
    const lon = data.query.longitude;

    map.panTo([lat, lon], { animate: true, duration: 0.8 });

    // Active Target Marker
    activeMarkerLayerGroup.current.clearLayers();
    const activeIcon = L.divIcon({
      className: 'custom-active-radar-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-full bg-cyan-500/30 border-2 border-cyan-400 radar-ping absolute"></div>
          <div class="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-xl relative z-10 flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-slate-950"></div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const activeMarker = L.marker([lat, lon], { icon: activeIcon }).addTo(activeMarkerLayerGroup.current);
    activeMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; color: #0f172a; line-height: 1.45; min-width: 210px;">
        <div style="font-weight: bold; color: #0284c7; font-size: 13px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 4px;">
          🎯 ${data.query.location_name}
        </div>
        <b>Coordinates:</b> ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E<br/>
        <b>Risk:</b> <span style="font-weight: bold; color: ${
          data.risk.risk_level === 'SAFE' ? '#16a34a' : data.risk.risk_level === 'MODERATE' ? '#d97706' : '#dc2626'
        }">${data.risk.risk_level} (${data.risk.risk_score}/100)</span><br/>
        <b>Wave:</b> ${data.ocean?.wave_height_m || 2.8} m (${data.ocean?.sea_state || 'Moderate'})<br/>
        <b>Wind:</b> ${data.weather?.wind_speed_kmh || 31} km/h<br/>
        <b>Time:</b> ${data.query.target_time_display}
      </div>
    `);

    // SST & Chlorophyll
    sstLayerGroup.current.clearLayers();
    chlLayerGroup.current.clearLayers();

    if (data.satellite && data.satellite.grid) {
      data.satellite.grid.forEach((pt) => {
        const sstCircle = L.circle([pt.lat, pt.lon], {
          radius: 12000,
          fillColor: pt.sst_c > 28.5 ? '#f97316' : pt.sst_c > 27.8 ? '#eab308' : '#38bdf8',
          fillOpacity: 0.16,
          color: pt.is_thermal_front ? '#ef4444' : '#0284c7',
          weight: pt.is_thermal_front ? 2 : 0.6,
          dashArray: pt.is_thermal_front ? '4, 4' : undefined,
        });
        sstCircle.bindPopup(`
          <div style="font-size: 11px; color: #0f172a;">
            <strong style="color: #0369a1;">ISRO MOSDAC Satellite SST</strong><br/>
            <b>SST:</b> ${pt.sst_c}°C<br/>
            <b>Thermal Front:</b> ${pt.is_thermal_front ? 'Active Front' : 'Normal'}
          </div>
        `);
        sstLayerGroup.current.addLayer(sstCircle);

        if (pt.chlorophyll_mg_m3 > 1.1) {
          const chlCircle = L.circle([pt.lat, pt.lon], {
            radius: 8500,
            fillColor: '#22c55e',
            fillOpacity: 0.18,
            color: '#16a34a',
            weight: 1,
          });
          chlCircle.bindPopup(`
            <div style="font-size: 11px; color: #0f172a;">
              <strong style="color: #15803d;">ISRO Oceansat-3 Chlorophyll</strong><br/>
              <b>Concentration:</b> ${pt.chlorophyll_mg_m3} mg/m³
            </div>
          `);
          chlLayerGroup.current.addLayer(chlCircle);
        }
      });
    }

    // PFZ Lines
    pfzLayerGroup.current.clearLayers();
    const pfzListToRender = data.all_pfz && data.all_pfz.length > 0
      ? data.all_pfz
      : data.nearest_pfz ? [data.nearest_pfz] : [];

    pfzListToRender.forEach((pfzItem: any) => {
      const geom = pfzItem.geometry || { coordinates: pfzItem.coordinates, type: 'LineString' };
      const props = pfzItem.properties || pfzItem;

      if (geom.coordinates && geom.coordinates.length > 0) {
        const latlngs: L.LatLngExpression[] = geom.coordinates.map((c: number[]) => [c[1], c[0]]);
        const poly = L.polyline(latlngs, {
          color: '#38bdf8',
          weight: 4,
          dashArray: '6, 6',
        });

        poly.bindPopup(`
          <div style="font-size: 12px; color: #0f172a; line-height: 1.4;">
            <strong style="color: #0284c7; font-size: 13px;">🐟 ${props.name}</strong><br/>
            <b>Port:</b> ${props.nearest_port}<br/>
            <b>Depth:</b> ${props.depth_range_m}<br/>
            <b>Species:</b> <em>${props.species_association}</em><br/>
            <b>Index:</b> ${props.favourability_score}/100
          </div>
        `);
        pfzLayerGroup.current.addLayer(poly);

        const midIdx = Math.floor(latlngs.length / 2);
        const midPt = latlngs[midIdx];
        const fishIcon = L.divIcon({
          className: 'pfz-fish-icon',
          html: `
            <div style="
              background: #0284c7;
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
              border: 1px solid #38bdf8;
              box-shadow: 0 2px 6px rgba(0,0,0,0.6);
              white-space: nowrap;
            ">
              🐟 PFZ: ${props.nearest_port || 'INCOIS'}
            </div>
          `,
          iconSize: [70, 20],
          iconAnchor: [35, 10],
        });
        const pfzMarker = L.marker(midPt, { icon: fishIcon });
        pfzMarker.bindPopup(poly.getPopup()?.getContent() || '');
        pfzLayerGroup.current.addLayer(pfzMarker);
      }
    });

    // Hazards
    hazardLayerGroup.current.clearLayers();
    if (data.all_hazards) {
      data.all_hazards.forEach((feat: any) => {
        const geom = feat.geometry;
        const props = feat.properties;
        if (geom.type === 'Polygon' && geom.coordinates) {
          const latlngs: L.LatLngExpression[] = geom.coordinates[0].map((c: number[]) => [c[1], c[0]]);
          const isCrit = props.severity === 'CRITICAL' || props.severity === 'HIGH';
          const hazardPoly = L.polygon(latlngs, {
            color: isCrit ? '#e11d48' : '#f59e0b',
            fillColor: isCrit ? '#f43f5e' : '#fbbf24',
            fillOpacity: 0.22,
            weight: 2,
            dashArray: '5, 5',
          });
          hazardPoly.bindPopup(`
            <div style="font-size: 12px; color: #0f172a; line-height: 1.4;">
              <strong style="color: #b91c1c; font-size: 13px;">⚠️ ${props.name}</strong><br/>
              <b>Classification:</b> ${props.hazard_type} [${props.severity}]<br/>
              <b>Advisory:</b> ${props.description}
            </div>
          `);
          hazardLayerGroup.current.addLayer(hazardPoly);
        }
      });
    }

    // Boundaries
    boundaryLayerGroup.current.clearLayers();
    if (data.all_boundaries) {
      data.all_boundaries.forEach((feat: any) => {
        const geom = feat.geometry;
        const props = feat.properties;
        if (geom.type === 'Polygon' && geom.coordinates) {
          const latlngs: L.LatLngExpression[] = geom.coordinates[0].map((c: number[]) => [c[1], c[0]]);
          const isMil = props.zone_type?.includes('MILITARY') || props.zone_type?.includes('OFFSHORE') || props.zone_type?.includes('AEROSPACE');
          const boundPoly = L.polygon(latlngs, {
            color: isMil ? '#dc2626' : '#16a34a',
            fillColor: isMil ? '#b91c1c' : '#22c55e',
            fillOpacity: 0.2,
            weight: 2,
          });
          boundPoly.bindPopup(`
            <div style="font-size: 12px; color: #0f172a; line-height: 1.4;">
              <strong style="color: ${isMil ? '#991b1b' : '#15803d'}; font-size: 13px;">
                ${isMil ? '🛑' : '🌿'} ${props.name}
              </strong><br/>
              <b>Type:</b> ${props.zone_type}<br/>
              <b>Restriction:</b> ${props.restriction}
            </div>
          `);
          boundaryLayerGroup.current.addLayer(boundPoly);
        } else if (geom.type === 'LineString' && geom.coordinates) {
          const latlngs: L.LatLngExpression[] = geom.coordinates.map((c: number[]) => [c[1], c[0]]);
          const imblLine = L.polyline(latlngs, {
            color: '#ef4444',
            weight: 3.5,
            dashArray: '8, 8',
          });
          imblLine.bindPopup(`
            <div style="font-size: 12px; color: #0f172a; line-height: 1.4;">
              <strong style="color: #991b1b; font-size: 13px;">🛑 ${props.name}</strong><br/>
              <b>Type:</b> ${props.zone_type}<br/>
              <b>Restriction:</b> ${props.restriction}
            </div>
          `);
          boundaryLayerGroup.current.addLayer(imblLine);
        }
      });
    }

    // Routes
    routeLayerGroup.current.clearLayers();
    if (data.route) {
      const fastestCoords: L.LatLngExpression[] = data.route.fastest_waypoints.map((p) => [p[0], p[1]]);
      const fastLine = L.polyline(fastestCoords, {
        color: '#f97316',
        weight: 3,
        dashArray: '6, 6',
      });
      fastLine.bindPopup(`
        <div style="font-size: 11px; color: #0f172a;">
          <strong style="color: #ea580c;">Fastest Route</strong> (${data.route.fastest_route_km} km)
        </div>
      `);
      routeLayerGroup.current.addLayer(fastLine);

      const safestCoords: L.LatLngExpression[] = data.route.safest_waypoints.map((p) => [p[0], p[1]]);
      const safeLine = L.polyline(safestCoords, {
        color: '#10b981',
        weight: 4,
      });
      safeLine.bindPopup(`
        <div style="font-size: 11px; color: #0f172a;">
          <strong style="color: #059669;">🛡️ Safest Marine Route</strong> (${data.route.safest_route_km} km)
        </div>
      `);
      routeLayerGroup.current.addLayer(safeLine);
    }

    // Trajectory
    trajectoryLayerGroup.current.clearLayers();
    if (data.predictive_geofence && data.predictive_geofence.trajectory) {
      const trajCoords: L.LatLngExpression[] = data.predictive_geofence.trajectory.map((t) => [t.lat, t.lon]);
      const trajLine = L.polyline(trajCoords, {
        color: data.predictive_geofence.is_projected_breach ? '#f43f5e' : '#38bdf8',
        weight: 3,
        dashArray: '3, 6',
      });
      trajectoryLayerGroup.current.addLayer(trajLine);

      const vesselIcon = L.divIcon({
        className: 'vessel-icon',
        html: `
          <div style="transform: rotate(${data.query.vessel_heading_deg}deg); font-size: 16px; color: #38bdf8;">
            ▲
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      const vesselMarker = L.marker([lat, lon], { icon: vesselIcon });
      trajectoryLayerGroup.current.addLayer(vesselMarker);
    }
  }, [data]);

  // Toggle layer visibility
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (showPorts) map.addLayer(portsLayerGroup.current);
    else map.removeLayer(portsLayerGroup.current);

    if (showSST) map.addLayer(sstLayerGroup.current);
    else map.removeLayer(sstLayerGroup.current);

    if (showChlorophyll) map.addLayer(chlLayerGroup.current);
    else map.removeLayer(chlLayerGroup.current);

    if (showPFZ) map.addLayer(pfzLayerGroup.current);
    else map.removeLayer(pfzLayerGroup.current);

    if (showHazards) map.addLayer(hazardLayerGroup.current);
    else map.removeLayer(hazardLayerGroup.current);

    if (showBoundaries) map.addLayer(boundaryLayerGroup.current);
    else map.removeLayer(boundaryLayerGroup.current);

    if (showRoutes) map.addLayer(routeLayerGroup.current);
    else map.removeLayer(routeLayerGroup.current);

    if (showTrajectory) map.addLayer(trajectoryLayerGroup.current);
    else map.removeLayer(trajectoryLayerGroup.current);
  }, [showPorts, showSST, showChlorophyll, showPFZ, showHazards, showBoundaries, showRoutes, showTrajectory]);

  const getRegionName = (r: typeof SHORE_REGIONS[0]) => {
    if (currentLang === 'mr') return r.name_mr;
    if (currentLang === 'hi') return r.name_hi;
    return r.name_en;
  };

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-[#060b13] flex flex-col">
      {/* Top Shore Region Quick Navigation Toolbar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] max-w-[96%] overflow-x-auto scrollbar-none bg-[#0b1322]/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-2 py-1.5 shadow-2xl flex items-center gap-1.5 text-xs">
        <span className="text-[11px] font-bold text-cyan-400 font-mono flex items-center gap-1 px-1.5 shrink-0 border-r border-slate-800 pr-2">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.shoresLabel}</span>
        </span>
        {SHORE_REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => handleFlyToRegion(region)}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 flex items-center gap-1 font-bold ${
              selectedShore === region.id
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{region.emoji}</span>
            <span>{getRegionName(region)}</span>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Floating Layer Control Panel */}
      <div className="absolute top-14 left-3 z-[1000] bg-[#0b1322]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-2xl text-xs text-slate-200 flex flex-col gap-1.5 max-w-[230px]">
        <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{t.layersTitle}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            {currentLang === 'mr' ? 'अखिल भारत' : currentLang === 'hi' ? 'अखिल भारत' : 'Pan-India'}
          </span>
        </div>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>{t.layerPorts}</span>
          </span>
          <input
            type="checkbox"
            checked={showPorts}
            onChange={(e) => setShowPorts(e.target.checked)}
            className="accent-cyan-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>{t.layerSST}</span>
          </span>
          <input
            type="checkbox"
            checked={showSST}
            onChange={(e) => setShowSST(e.target.checked)}
            className="accent-cyan-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{t.layerChl}</span>
          </span>
          <input
            type="checkbox"
            checked={showChlorophyll}
            onChange={(e) => setShowChlorophyll(e.target.checked)}
            className="accent-emerald-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
            <span>{t.layerPFZ}</span>
          </span>
          <input
            type="checkbox"
            checked={showPFZ}
            onChange={(e) => setShowPFZ(e.target.checked)}
            className="accent-sky-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>{t.layerHazards}</span>
          </span>
          <input
            type="checkbox"
            checked={showHazards}
            onChange={(e) => setShowHazards(e.target.checked)}
            className="accent-amber-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>{t.layerBoundaries}</span>
          </span>
          <input
            type="checkbox"
            checked={showBoundaries}
            onChange={(e) => setShowBoundaries(e.target.checked)}
            className="accent-rose-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>{t.layerRoutes}</span>
          </span>
          <input
            type="checkbox"
            checked={showRoutes}
            onChange={(e) => setShowRoutes(e.target.checked)}
            className="accent-emerald-500 rounded"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white transition">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>{t.layerTrajectory}</span>
          </span>
          <input
            type="checkbox"
            checked={showTrajectory}
            onChange={(e) => setShowTrajectory(e.target.checked)}
            className="accent-indigo-500 rounded"
          />
        </label>
      </div>

      {/* Map Hint Footer */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#0b1322]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 shadow-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>{t.mapHint}</span>
      </div>
    </div>
  );
};
