import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { MapPin, Info, Activity, Layers, Globe, Settings, Map as MapIcon, Landmark } from 'lucide-react';
import { Language } from '../types';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

interface MapNode {
  id: string;
  name: Record<Language, string>;
  x: number; // For SVG mapping
  y: number; // For SVG mapping
  lat: number; // For Google Map mapping
  lng: number; // For Google Map mapping
  status: 'active' | 'scheduled' | 'idle';
  statusLabel: Record<Language, string>;
  projectType: Record<Language, string>;
  matchLocation: string; // matches the Proposal locationName
}

const MAP_NODES: MapNode[] = [
  {
    id: 'node-river',
    name: {
      en: 'Parramatta River Foreshore',
      zh: '帕拉马塔河滨水长廊区',
      hn: 'पैरामाटा नदी तट'
    },
    x: 280,
    y: 70,
    lat: -33.8115,
    lng: 151.0028,
    status: 'active',
    statusLabel: {
      en: 'Active Eco-Monitoring',
      zh: '生物多样性实时监测中',
      hn: 'सक्रिय पर्यावरण-निगरानी'
    },
    projectType: {
      en: 'Floating Wetlands Project',
      zh: '漂浮生态浮岛工程',
      hn: 'फ्लोटिंग वेटलैंड्स परियोजना'
    },
    matchLocation: 'River Foreshore'
  },
  {
    id: 'node-square',
    name: {
      en: 'Centenary Square (Town Hall)',
      zh: '百年广场（市政厅旧址）',
      hn: 'सेंटेनरी स्क्वायर (टाउन हॉल)'
    },
    x: 230,
    y: 200,
    lat: -33.8142,
    lng: 151.0022,
    status: 'active',
    statusLabel: {
      en: 'Thermal Management Testbed',
      zh: '夏季市中心高温缓测试点',
      hn: 'तापीय प्रबंधन परीक्षण बिस्तर'
    },
    projectType: {
      en: 'Heat-Island Misting Forest',
      zh: '斑马森林雾化器阵列',
      hn: 'हीट-आइलैंड मिस्टिंग फ़ॉरेस्ट'
    },
    matchLocation: 'Centenary Square'
  },
  {
    id: 'node-church',
    name: {
      en: 'Church Street Eat Street',
      zh: '教堂街（美食餐饮步行街）',
      hn: 'चर्च स्ट्रीट ईट स्ट्रीट'
    },
    x: 160,
    y: 150,
    lat: -33.8128,
    lng: 151.0026,
    status: 'scheduled',
    statusLabel: {
      en: 'Acoustic License Trial',
      zh: '分贝限制现场音乐准入点',
      hn: 'ध्वनिक लाइसेंस परीक्षण'
    },
    projectType: {
      en: 'Live Micro-Grants Program',
      zh: '深夜演艺微资助计划',
      hn: 'लाइव माइक्रो-अनुदान कार्यक्रम'
    },
    matchLocation: 'Church Street CBD'
  },
  {
    id: 'node-heritage',
    name: {
      en: 'Heritage Precinct & Park',
      zh: '遗产保护园及公园绿地',
      hn: 'विरासत परिसर और पार्क'
    },
    x: 80,
    y: 110,
    lat: -33.8085,
    lng: 150.9992,
    status: 'idle',
    statusLabel: {
      en: 'Historical AR Trail Proposed',
      zh: '原住民地名AR寻宝筹备中',
      hn: 'ऐतिहासिक एआर ट्रेल प्रस्तावित'
    },
    projectType: {
      en: 'Dharug Interactive Tour',
      zh: '达鲁格语地标语音解说',
      hn: 'धारुग इंटरैक्टिव टूर'
    },
    matchLocation: 'Heritage Precinct'
  },
  {
    id: 'node-phive',
    name: {
      en: 'Phive Civic Hub (Parramatta Sq)',
      zh: 'Phive市民中心 (帕拉马塔广场)',
      hn: 'फाइव सिविक हब (पैरामाटा स्क्वेयर)'
    },
    x: 340,
    y: 240,
    lat: -33.8152,
    lng: 151.0033,
    status: 'active',
    statusLabel: {
      en: 'Weekly Council Forum',
      zh: '市议会公开议事现场',
      hn: 'साप्ताहिक परिषद मंच'
    },
    projectType: {
      en: 'PWA Digital Portal Terminal',
      zh: '公共信息智能交互终端',
      hn: 'पीडब्ल्यूए डिजिटल पोर्टल टर्मिनल'
    },
    matchLocation: 'Phive Civic Centre'
  }
];

// Read Key defined by build-time define block or environment variables
const API_KEY =
  (process.env as any).GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export const ParramattaMap: React.FC = () => {
  const { language, selectedZone, setSelectedZone, translateText } = useCivic();
  const [mapTab, setMapTab] = useState<'schematic' | 'google_maps'>('schematic');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleNodeClick = (locName: string) => {
    if (selectedZone === locName) {
      setSelectedZone(null); // toggle off
    } else {
      setSelectedZone(locName);
    }
  };

  const currentSelectedNode = MAP_NODES.find(n => n.matchLocation === selectedZone);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-5 flex flex-col h-full" id="parramatta-map-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <h2 className="text-md font-sans font-semibold text-neutral-800 tracking-tight">
            Parramatta Interactive Grid
          </h2>
        </div>
        
        {/* Toggle between schematic and google maps */}
        <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/40">
          <button
            onClick={() => setMapTab('schematic')}
            className={`text-[10px] font-sans font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              mapTab === 'schematic'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3 h-3 text-blue-500" />
            Schematic
          </button>
          <button
            onClick={() => setMapTab('google_maps')}
            className={`text-[10px] font-sans font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              mapTab === 'google_maps'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Globe className="w-3 h-3 text-emerald-500" />
            Live Map
          </button>
        </div>
      </div>

      <p className="text-xs text-neutral-500 mb-4 font-sans leading-relaxed">
        {mapTab === 'schematic'
          ? 'Toggle glowing municipal junctions below to spotlight solutions and project pipelines.'
          : 'Geolocalised satellite boundaries showing live public misting, micro-bat trails and canopy sites.'}
      </p>

      {/* Map visualizer container with set height to prevent collapse */}
      <div className="relative h-[280px] bg-neutral-50 rounded-xl border border-neutral-100 overflow-hidden group">
        {mapTab === 'schematic' ? (
          /* High Performance Vector Map */
          <svg
            viewBox="0 0 400 300"
            className="w-full h-full select-none select-none-all"
            id="parramatta-svg-frame"
          >
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
              </pattern>
              <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Parramatta River alignment */}
            <path
              d="M -10 40 C 120 45, 180 80, 260 65 L 420 80 L 420 40 C 300 35, 180 5, -10 10 Z"
              fill="#e0f2fe"
              className="animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            
            {/* Parramatta Park greenery */}
            <path
              d="M 10 70 C 40 70, 70 80, 80 120 C 60 160, 20 150, 10 120 Z"
              fill="#f0fdf4"
            />
            
            {/* Grid streets road overlays */}
            <line x1="10" y1="280" x2="390" y2="280" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" />
            <line x1="160" y1="40" x2="160" y2="280" stroke="#e5e5e5" strokeWidth="4" strokeLinecap="round" />
            <line x1="160" y1="80" x2="160" y2="240" stroke="#3b82f6" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
            <line x1="330" y1="80" x2="330" y2="280" stroke="#e5e5e5" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="30" y1="180" x2="370" y2="180" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" />

            {MAP_NODES.map((node) => {
              const isSelected = selectedZone === node.matchLocation;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node.matchLocation)}
                  id={`svg-g-${node.id}`}
                >
                  {node.status === 'active' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 28 : 18}
                      fill="url(#activeGlow)"
                      className="animate-ping"
                      style={{
                        animationDuration: '3s',
                        transformOrigin: `${node.x}px ${node.y}px`,
                        opacity: isSelected ? 0.35 : 0.15
                      }}
                    />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 14 : 9}
                    fill={isSelected ? '#3b82f6' : '#ffffff'}
                    stroke={isSelected ? '#2563eb' : '#a3a3a3'}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all duration-300 hover:scale-125"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#ffffff' : '#3b82f6'}
                  />
                </g>
              );
            })}
          </svg>
        ) : (
          /* Google Maps Platform Live Satellite Map mode */
          <div className="w-full h-full relative" id="google-maps-viewport">
            {!hasValidKey ? (
              /* Inline setup instructions if key is absent */
              <div className="w-full h-full bg-neutral-900 text-white p-4 flex flex-col items-center justify-center text-center overflow-y-auto">
                <Settings className="w-7 h-7 text-yellow-400 animate-spin mb-2" style={{ animationDuration: '6s' }} />
                <h3 className="text-xs font-sans font-bold text-yellow-400">Google Maps Credential Required</h3>
                <p className="text-[10px] text-neutral-300 max-w-[360px] leading-relaxed mt-1 font-sans">
                  Paste your platform key inside AI Studio Secrets (⚙️ gear icon, top-right panel &rarr; Secrets) as <code className="text-white px-1 py-0.5 bg-neutral-800 rounded font-bold">GOOGLE_MAPS_PLATFORM_KEY</code>.
                </p>
                <div className="mt-3 py-1 px-2.5 bg-neutral-800 rounded-lg text-[9px] font-mono text-neutral-400 border border-neutral-700/60 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-blue-400" />
                  Target: Sydney Parramatta CBD Core Grid
                </div>
              </div>
            ) : (
              /* Live API rendering with vis.gl wrappers */
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  defaultCenter={{ lat: -33.8130, lng: 151.0034 }}
                  defaultZoom={14}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                  gestureHandling="cooperative"
                >
                  {MAP_NODES.map((node) => {
                    const isSelected = selectedZone === node.matchLocation;
                    return (
                      <AdvancedMarker
                        key={node.id}
                        position={{ lat: node.lat, lng: node.lng }}
                        title={node.name[language]}
                        onClick={() => handleNodeClick(node.matchLocation)}
                      >
                        <Pin
                          background={isSelected ? "#2563eb" : "#10b981"}
                          borderColor={isSelected ? "#1d4ed8" : "#059669"}
                          glyphColor="#ffffff"
                          scale={isSelected ? 1.25 : 1}
                        />
                      </AdvancedMarker>
                    );
                  })}
                </Map>
              </APIProvider>
            )}
          </div>
        )}

        {/* Legend overlays */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] font-sans px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg border border-neutral-200/50 shadow-xs pointer-events-none">
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 border border-white"></span>
              <span className="text-neutral-500 font-bold font-sans">Active</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
              <span className="text-neutral-500 font-bold font-sans">Planned</span>
            </span>
          </div>
          {selectedZone && (
            <span className="text-blue-600 font-extrabold uppercase animate-pulse pr-1">
              Filtered
            </span>
          )}
        </div>
      </div>

      {/* Selected marker contextual info box */}
      <div className="mt-4 border-t border-neutral-100 pt-3 min-h-[90px] flex flex-col justify-center">
        {currentSelectedNode ? (
          <div className="animate-fade-in flex items-start gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600" id="pin-indicator-icon" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xs sm:text-sm font-sans font-bold text-neutral-800">
                  {currentSelectedNode.name[language]}
                </h3>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-[10px] font-mono font-bold text-neutral-400 hover:text-blue-600 cursor-pointer"
                >
                  ✕ CLEAR
                </button>
              </div>
              <p className="text-[10px] text-blue-600 font-bold font-sans mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                {currentSelectedNode.statusLabel[language]}
              </p>
              <div className="mt-1 flex flex-wrap gap-1 items-center">
                <span className="text-[9px] font-mono text-neutral-400">Area Project:</span>
                <span className="text-[9px] font-sans font-bold text-neutral-600 bg-neutral-100 px-1.5 rounded border border-neutral-200">
                  {currentSelectedNode.projectType[language]}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200/50">
            <MapPin className="w-5 h-5 text-neutral-300 mx-auto mb-1 animate-bounce" />
            <p className="text-[10px] text-neutral-400 font-sans font-semibold">
              Select any region or marker to cross-filter ongoing solutions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
