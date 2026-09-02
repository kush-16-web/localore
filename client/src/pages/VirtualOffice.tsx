import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Search, Settings, MessageSquare, ChevronDown,
  Mic, MicOff, Video, VideoOff, MonitorUp, Maximize,
  Minus, Plus, X, MapPin, Users,
} from 'lucide-react';

// --- Store to share player position with other components ---
const gameStore = { playerPosition: new THREE.Vector3(0, 0.5, 0) };

type NPCData = {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  color: string;
  room: string;
  tag: string;
};

const INITIAL_NPCS: NPCData[] = [
  { id: '1', name: 'Gregoria Camacho', role: 'Data Analyst', position: [5, 0.5, 5], color: '#0f766e', room: 'Central Open Space', tag: 'Tech' },
  { id: '2', name: 'Keely Jansen', role: 'Designer', position: [-5, 0.5, -5], color: '#be185d', room: 'Central Open Space', tag: 'Design' },
  { id: '3', name: 'Christeen Violette', role: 'Product Manager', position: [7, 0.5, -3], color: '#ea580c', room: 'Meeting room #1', tag: 'Product' },
];

const SIDEBAR_COWORKERS = [
  { name: 'Gregoria Camacho', room: 'Central Open Space', color: '#0f766e' },
  { name: 'Christeen Violette', room: 'Central Open Space', color: '#3b82f6' },
  { name: 'Deane Chadburn', room: 'Central Open Space', color: '#ef4444' },
  { name: 'Elisa Lona', room: 'Meeting room #1', color: '#10b981' },
  { name: 'Wilbert Prewitt', room: 'Meeting room #1', color: '#000000' },
  { name: 'Sephora Johnson', room: 'Meeting room #2', color: '#8b5cf6' },
];

const PROXIMITY_RADIUS = 4;

const Player = () => {
  const meshRef = useRef<THREE.Group>(null);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const speed = 0.1;
    let dx = 0;
    let dz = 0;

    if (keys.current['w']) { dx -= 1; dz -= 1; }
    if (keys.current['s']) { dx += 1; dz += 1; }
    if (keys.current['a']) { dx -= 1; dz += 1; }
    if (keys.current['d']) { dx += 1; dz -= 1; }

    if (dx !== 0 || dz !== 0) {
      const length = Math.sqrt(dx * dx + dz * dz);
      meshRef.current.position.x += (dx / length) * speed;
      meshRef.current.position.z += (dz / length) * speed;
    }

    // Update store
    gameStore.playerPosition.copy(meshRef.current.position);

    // Camera follow player (isometric angle)
    state.camera.position.x = meshRef.current.position.x + 20;
    state.camera.position.z = meshRef.current.position.z + 20;
    state.camera.lookAt(meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z);
  });

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      <mesh>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#4287f5" />
      </mesh>
      {/* Proximity Mesh */}
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[PROXIMITY_RADIUS, 32]} />
        <meshBasicMaterial color="rgba(255, 255, 255, 0.1)" transparent={true} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const NPC = ({
  data,
  onSelect,
  setInRange,
}: {
  data: NPCData;
  onSelect: (data: NPCData) => void;
  setInRange: (id: string, inRange: boolean) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [inRangeLocal, setInRangeLocal] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;

    const dist = meshRef.current.position.distanceTo(gameStore.playerPosition);
    const isNowInRange = dist < PROXIMITY_RADIUS;

    if (isNowInRange !== inRangeLocal) {
      setInRangeLocal(isNowInRange);
      setInRange(data.id, isNowInRange);
    }
  });

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : data.color} />

        {/* In-range indicator */}
        {inRangeLocal && (
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="green" />
          </mesh>
        )}
      </mesh>

      {/* Use Html to attach UI to the NPC's 3D position if selected, we do it at VirtualOffice level or here. We will do it at VirtualOffice level by checking data.id */}
    </group>
  );
};

const Room = () => {
  return (
    <group>
      {/* Floor - styled like a warm wooden/colorful office floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8fb3ff" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.49, -10]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#ffb74d" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -15]}>
        <boxGeometry args={[30, 5, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <mesh position={[-15, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 5, 1]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
};

const VirtualOffice: React.FC = () => {
  const [selectedNPC, setSelectedNPC] = useState<NPCData | null>(null);
  const [npcsInRange, setNpcsInRange] = useState<Set<string>>(new Set());

  // UI States
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [croissants, setCroissants] = useState(0);

  const handleSetInRange = (id: string, inRange: boolean) => {
    setNpcsInRange((prev) => {
      const next = new Set(prev);
      if (inRange) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#111111] overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <header className="flex h-[52px] w-full items-center justify-between bg-[#111111] px-6 text-white text-sm z-20 shadow-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-sm">W</div>
            Home <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded ml-1">BETA</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-gray-400 font-medium">
            <a href="#" className="hover:text-white transition-colors">Overview</a>
            <a href="#" className="hover:text-white transition-colors">People</a>
            <a href="#" className="hover:text-white transition-colors">Team</a>
            <a href="#" className="hover:text-white transition-colors">Reward</a>
            <a href="#" className="text-white border-b-2 border-white pb-4 mt-4">Virtual office</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">Knowledge <ChevronDown size={14}/></a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">Apps <ChevronDown size={14}/></a>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-white"><Search size={18}/></button>
          <button className="hover:text-white flex items-center gap-1">Help <ChevronDown size={14}/></button>
          <div className="w-8 h-8 bg-gray-600 rounded-full border border-gray-500 flex items-center justify-center">
            <span className="text-white text-xs">RM</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-[280px] bg-white flex flex-col border-r border-gray-200 overflow-y-auto hidden md:flex z-10">
          {/* User Profile */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mark" alt="avatar" className="w-full h-full" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Renay Montero</span>
            </div>
            <div className="flex text-gray-400 gap-2">
              <Settings size={18} className="cursor-pointer hover:text-gray-600"/>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:text-gray-600"><line x1="21" y1="12" x2="3" y2="12"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
            </div>
          </div>

          {/* Public Chats */}
          <div className="p-4 border-b border-gray-100">
            <div className="text-[10px] text-gray-500 font-bold mb-3 uppercase tracking-wider">Public Chats</div>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 text-gray-700 hover:text-black w-full text-left text-sm font-medium">
                <Users size={16} className="text-gray-400" /> Everyone
              </button>
              <button className="flex items-center gap-3 text-black w-full text-left text-sm font-semibold">
                <MapPin size={16} className="text-gray-700" /> Nearby
              </button>
              <div className="flex pl-8 gap-1">
                {INITIAL_NPCS.slice(0,3).map(npc => (
                   <div key={npc.id} className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0" style={{backgroundColor: npc.color}}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Online Coworkers */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online Coworkers</div>
               <div className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-bold">26</div>
            </div>

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col gap-4">
              {SIDEBAR_COWORKERS.map((coworker, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full" style={{backgroundColor: coworker.color}}></div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{coworker.name}</span>
                      <span className="text-[11px] text-gray-500">{coworker.room}</span>
                    </div>
                  </div>
                  <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageSquare size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 relative bg-[#1e232e]">
          {/* 3D Scene */}
          <Canvas onClick={() => setSelectedNPC(null)}>
            <OrthographicCamera
              makeDefault
              position={[20, 20, 20]}
              zoom={45}
              near={0.1}
              far={1000}
            />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
            <Room />
            <Player />
            {INITIAL_NPCS.map((npc) => (
              <React.Fragment key={npc.id}>
                <NPC
                  data={npc}
                  onSelect={setSelectedNPC}
                  setInRange={handleSetInRange}
                />
                {selectedNPC?.id === npc.id && (
                  <Html position={[npc.position[0], npc.position[1] + 1, npc.position[2]]} zIndexRange={[100, 0]}>
                    <div className="pointer-events-auto flex flex-col gap-4 z-20 w-80 transform -translate-x-1/2 -translate-y-full pb-4">
                      {/* Profile Card */}
                      <div className="bg-white rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedNPC.name}</h2>
                            <p className="text-sm text-gray-600">{selectedNPC.role}</p>
                            <div className="mt-2 inline-block bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="text-[10px]">✏️</span> {selectedNPC.tag}
                            </div>
                          </div>
                          <div
                            className="w-14 h-14 rounded-full flex-shrink-0"
                            style={{ backgroundColor: selectedNPC.color }}
                          >
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedNPC.name}`} alt="avatar" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
                           <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm py-2.5 rounded-xl transition-colors">
                             <span>👤</span> Profile
                           </button>
                           <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-gray-200">
                             <MapPin size={16}/> Go to
                           </button>
                           <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-gray-200">
                             <MessageSquare size={16}/> Chat
                           </button>
                           <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-gray-200">
                             <span>🥐</span> Send
                           </button>
                        </div>
                      </div>

                      {/* Reward Card */}
                      <div className="bg-[#bbf7d0] rounded-[24px] p-6 shadow-2xl relative border border-green-200">
                        <button
                          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/50 hover:bg-white p-1 rounded-full transition-colors"
                          onClick={() => setSelectedNPC(null)}
                        >
                          <X size={14} />
                        </button>
                        <div className="mb-4">
                          <span className="text-xl">🥐</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Reward {selectedNPC.name.split(' ')[0]}</h3>
                        <p className="text-sm text-gray-700 mb-6">You have <strong className="font-extrabold">400 croissants</strong> left to give</p>

                        <div className="bg-white rounded-2xl p-4 flex flex-col items-center shadow-sm">
                          <div className="flex items-center justify-center gap-6 mb-4">
                            <button
                               className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold hover:bg-yellow-500 transition-colors"
                               onClick={() => setCroissants(Math.max(0, croissants - 1))}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-4xl font-black text-gray-900 w-12 text-center">{croissants}</span>
                            <button
                               className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold hover:bg-yellow-500 transition-colors"
                               onClick={() => setCroissants(croissants + 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="w-full">
                            <input
                              type="text"
                              placeholder="Add a reason"
                              className="w-full bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Html>
                )}
              </React.Fragment>
            ))}
          </Canvas>

          {/* UI OVERLAYS */}

          {/* Top Video Tiles */}
          <div className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none z-10">
            <div className="pointer-events-auto flex gap-4">
              {/* "You" Tile */}
              <div className="w-64 h-40 bg-[#1f2937] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl relative flex items-center justify-center">
                 {/* Fake video feed background */}
                 <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Renay" className="w-20 h-20 relative z-10" alt="You" />

                 <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                   <div className="bg-black/60 p-1.5 rounded-lg"><MicOff size={14} className="text-white"/></div>
                   <div className="bg-black/60 p-1.5 rounded-lg"><VideoOff size={14} className="text-white"/></div>
                 </div>

                 <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1.5 rounded-lg text-white text-xs font-medium z-20">
                   Renay Montero (You)
                 </div>
              </div>

              {/* In-Range NPCs Tiles */}
              {Array.from(npcsInRange).map((npcId) => {
                const npc = INITIAL_NPCS.find(n => n.id === npcId);
                if (!npc) return null;
                return (
                  <div key={npc.id} className="w-64 h-40 bg-[#1f2937] rounded-2xl overflow-hidden shadow-xl relative flex items-center justify-center border border-gray-700">
                     <div className="absolute inset-0 opacity-40" style={{ backgroundColor: npc.color }}></div>
                     <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center relative z-10">
                        <span className="text-3xl text-white font-bold">{npc.name.charAt(0)}</span>
                     </div>

                     <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                       <div className="bg-black/60 p-1.5 rounded-lg"><MicOff size={14} className="text-white"/></div>
                     </div>

                     <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1.5 rounded-lg text-white text-xs font-medium z-20">
                       {npc.name}
                     </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile & Reward Card */}
          {selectedNPC && (
            <div className="absolute top-32 left-8 pointer-events-auto flex flex-col gap-4 z-20">
              {/* Profile Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-2xl w-80 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedNPC.name}</h2>
                    <p className="text-sm text-gray-600">{selectedNPC.role}</p>
                    <div className="mt-2 inline-block bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="text-[10px]">✏️</span> {selectedNPC.tag}
                    </div>
                  </div>
                  <div
                    className="w-14 h-14 rounded-full flex-shrink-0"
                    style={{ backgroundColor: selectedNPC.color }}
                  >
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedNPC.name}`} alt="avatar" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
                   <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm py-2.5 rounded-xl transition-colors">
                     <span>👤</span> Profile
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-gray-200">
                     <MapPin size={16}/> Go to
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-gray-200">
                     <MessageSquare size={16}/> Chat
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-gray-200">
                     <span>🥐</span> Send
                   </button>
                </div>
              </div>

              {/* Reward Card */}
              <div className="bg-[#b4e6b5] rounded-[24px] p-6 shadow-2xl w-80 relative overflow-hidden">
                <button
                  onClick={() => setSelectedNPC(null)}
                  className="absolute top-4 right-4 bg-white/50 hover:bg-white text-gray-600 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="mb-4">
                  <span className="text-xl">🥐</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Reward {selectedNPC.name.split(' ')[0]}</h3>
                <p className="text-sm text-gray-700 mb-6">You have <strong className="font-extrabold">400 croissants</strong> left to give</p>

                <div className="bg-white rounded-2xl p-4 flex flex-col items-center shadow-sm">
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <button
                       className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold hover:bg-yellow-500 transition-colors"
                       onClick={() => setCroissants(Math.max(0, croissants - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-4xl font-black text-gray-900 w-12 text-center">{croissants}</span>
                    <button
                       className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold hover:bg-yellow-500 transition-colors"
                       onClick={() => setCroissants(croissants + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Type a message here..."
                      className="w-full text-center text-sm text-gray-600 border-none outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minimap */}
          <div className="absolute bottom-24 left-6 pointer-events-auto z-10">
            <div className="w-40 h-32 bg-[#1f2937] rounded-lg border border-gray-600 p-2 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#111827] m-2 rounded border border-gray-700">
                {/* Visual room approximations */}
                <div className="absolute top-2 left-2 w-10 h-10 border border-gray-600 bg-gray-800"></div>
                <div className="absolute bottom-2 right-2 w-12 h-8 border border-gray-600 bg-orange-900/50"></div>

                {/* Player Blip */}
                <div className="absolute w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                   style={{ left: '50%', top: '50%' }}
                />

                {/* View cone (approximation) */}
                <div className="absolute w-8 h-8 rounded-full border border-yellow-400/30 transform -translate-x-1/2 -translate-y-1/2"
                   style={{ left: '50%', top: '50%' }}
                />

                {/* NPC Blips */}
                {INITIAL_NPCS.map(npc => (
                  <div
                    key={npc.id}
                    className="absolute w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-gray-400"
                    style={{
                      left: `calc(50% + ${npc.position[0] * 3}px)`,
                      top: `calc(50% + ${npc.position[2] * 3}px)`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
            <div className="bg-white rounded-full h-16 shadow-2xl flex items-center px-6 pointer-events-auto divide-x divide-gray-200 border border-gray-100">
              <div className="pr-6 flex flex-col justify-center">
                 <span className="font-bold text-gray-900 text-sm leading-tight">Public space</span>
                 <span className="text-xs text-gray-500">{npcsInRange.size} people around you</span>
              </div>
              <div className="pl-6 flex gap-8 items-center h-full">
                 <button
                   className="flex flex-col items-center gap-1 group w-14"
                   onClick={() => setIsMicOn(!isMicOn)}
                 >
                   <div className="relative">
                     {isMicOn ? <Mic size={22} className="text-gray-800"/> : <MicOff size={22} className="text-gray-400"/>}
                     <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></div>
                   </div>
                   <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-800 whitespace-nowrap">
                     {isMicOn ? 'Mute' : 'Unmute'}
                   </span>
                 </button>

                 <button
                   className="flex flex-col items-center gap-1 group w-16"
                   onClick={() => setIsCameraOn(!isCameraOn)}
                 >
                   <div className="relative">
                     {isCameraOn ? <Video size={22} className="text-gray-800"/> : <VideoOff size={22} className="text-gray-400"/>}
                     <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></div>
                   </div>
                   <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-800 whitespace-nowrap">
                     {isCameraOn ? 'Deactivate' : 'Activate camera'}
                   </span>
                 </button>

                 <button
                   className="flex flex-col items-center gap-1 group w-14"
                   onClick={() => setIsScreenSharing(!isScreenSharing)}
                 >
                   <MonitorUp size={22} className={isScreenSharing ? "text-blue-500" : "text-gray-400"}/>
                   <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-800 whitespace-nowrap">
                     Share screen
                   </span>
                 </button>

                 <button className="flex flex-col items-center gap-1 group w-16">
                   <Maximize size={22} className="text-gray-400 group-hover:text-gray-800 transition-colors"/>
                   <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-800 whitespace-nowrap">
                     Enter fullscreen
                   </span>
                 </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default VirtualOffice;
