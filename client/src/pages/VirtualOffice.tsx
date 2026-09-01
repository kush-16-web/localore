import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Store to share player position with other components ---
const gameStore = { playerPosition: new THREE.Vector3(0, 0.5, 0) };

type NPCData = {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  color: string;
};

const INITIAL_NPCS: NPCData[] = [
  { id: '1', name: 'Alice', role: 'Engineer', position: [5, 0.5, 5], color: 'lightblue' },
  { id: '2', name: 'Bob', role: 'Designer', position: [-5, 0.5, -5], color: 'lightgreen' },
  { id: '3', name: 'Charlie', role: 'Product Manager', position: [7, 0.5, -3], color: 'orange' },
];

const PROXIMITY_RADIUS = 4;

const Player = () => {
  const meshRef = useRef<THREE.Mesh>(null);
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
    if (keys.current['w']) meshRef.current.position.z -= speed;
    if (keys.current['s']) meshRef.current.position.z += speed;
    if (keys.current['a']) meshRef.current.position.x -= speed;
    if (keys.current['d']) meshRef.current.position.x += speed;

    // Update store
    gameStore.playerPosition.copy(meshRef.current.position);

    // Camera follow player
    state.camera.position.x = meshRef.current.position.x + 20;
    state.camera.position.z = meshRef.current.position.z + 20;
    state.camera.lookAt(meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
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

    // Check distance to player
    const dist = meshRef.current.position.distanceTo(gameStore.playerPosition);
    const isNowInRange = dist < PROXIMITY_RADIUS;

    if (isNowInRange !== inRangeLocal) {
      setInRangeLocal(isNowInRange);
      setInRange(data.id, isNowInRange);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={data.position}
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
      <meshStandardMaterial color={hovered ? 'white' : data.color} emissive={inRangeLocal ? data.color : 'black'} emissiveIntensity={inRangeLocal ? 0.5 : 0} />

      {/* Indicator when in range */}
      {inRangeLocal && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color="green" />
        </mesh>
      )}
    </mesh>
  );
};

const Room = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Wall 1 */}
      <mesh position={[0, 2, -10]}>
        <boxGeometry args={[20, 5, 1]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      {/* Wall 2 */}
      <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 5, 1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
};

const VirtualOffice: React.FC = () => {
  const [selectedNPC, setSelectedNPC] = useState<NPCData | null>(null);
  const [npcsInRange, setNpcsInRange] = useState<Set<string>>(new Set());

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
    <div className="w-full h-screen relative bg-gray-900 overflow-hidden">
      {/* 3D Scene */}
      <Canvas onClick={() => setSelectedNPC(null)}>
        <OrthographicCamera
          makeDefault
          position={[20, 20, 20]}
          zoom={40}
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <Room />
        <Player />
        {INITIAL_NPCS.map((npc) => (
          <NPC
            key={npc.id}
            data={npc}
            onSelect={setSelectedNPC}
            setInRange={handleSetInRange}
          />
        ))}
      </Canvas>

      {/* UI Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Fake Video Tiles for In-Range NPCs */}
        <div className="absolute top-4 left-4 flex gap-4 pointer-events-auto">
          {Array.from(npcsInRange).map((npcId) => {
            const npc = INITIAL_NPCS.find(n => n.id === npcId);
            if (!npc) return null;
            return (
              <div key={npc.id} className="w-48 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-green-500 shadow-lg relative flex items-center justify-center">
                {/* Fake video feed - just colored background and name */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: npc.color }} />
                <div className="text-white text-center z-10">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-gray-600 flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <span className="font-medium">{npc.name}</span>
                </div>
                {/* Mic indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">🎤</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimap */}
        <div className="absolute bottom-4 right-4 w-48 h-48 bg-gray-800 bg-opacity-80 rounded-lg border border-gray-600 pointer-events-auto p-2">
          <div className="relative w-full h-full border border-gray-500 bg-gray-900 rounded">
            {/* Map representation of 20x20 floor */}
            {/* Scale: map is ~170px wide, real is 20 units. scale factor ~8.5px/unit */}
            {/* Origin (0,0) is center of map */}
            <div
               className="absolute w-2 h-2 bg-pink-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
               style={{
                 left: '50%',
                 top: '50%',
                 // This is a static representation as updating it in real-time requires connecting to the loop
                 // For now, it just shows starting pos, or we could add a useFrame hook for the minimap specifically if needed.
               }}
            />
            {INITIAL_NPCS.map(npc => (
              <div
                key={npc.id}
                className={`absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${npcsInRange.has(npc.id) ? 'bg-green-500' : 'bg-gray-400'}`}
                style={{
                  left: `calc(50% + ${npc.position[0] * 4}px)`,
                  top: `calc(50% + ${npc.position[2] * 4}px)`
                }}
                title={npc.name}
              />
            ))}
          </div>
        </div>

        {/* Profile Card Popup */}
        {selectedNPC && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-white rounded-lg shadow-xl p-6 min-w-[250px]">
            <div className="flex justify-between items-start mb-4">
              <div
                className="w-12 h-12 rounded-full mb-3"
                style={{ backgroundColor: selectedNPC.color }}
              />
              <button
                onClick={() => setSelectedNPC(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{selectedNPC.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedNPC.role}</p>

            <div className="flex items-center space-x-2">
               <div className={`w-3 h-3 rounded-full ${npcsInRange.has(selectedNPC.id) ? 'bg-green-500' : 'bg-gray-300'}`} />
               <span className="text-sm text-gray-600">
                 {npcsInRange.has(selectedNPC.id) ? 'Nearby' : 'Out of range'}
               </span>
            </div>

            <div className="mt-6 flex space-x-3">
               <button
                 className={`flex-1 py-2 px-4 rounded text-white text-sm font-medium ${npcsInRange.has(selectedNPC.id) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
                 disabled={!npcsInRange.has(selectedNPC.id)}
               >
                 Message
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VirtualOffice;
