"use client";

import { useEffect, useState } from "react";

type Vehicle = {
  id: string;
  name: string;
  x: number; // horizontal position %
  y: number; // vertical position %
  status: "available" | "onHire" | "workshop" | "dueReturn";
};

export default function FleetMap() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "V1", name: "BYD123", x: 30, y: 40, status: "available" },
    { id: "V2", name: "BYD777", x: 65, y: 55, status: "onHire" },
    { id: "V3", name: "BYD555", x: 45, y: 20, status: "workshop" },
    { id: "V4", name: "BYD999", x: 20, y: 70, status: "dueReturn" },
  ]);
  const [imageError, setImageError] = useState(false);

  // Fake live updating map (random slight movement)
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          x: Math.min(95, Math.max(5, v.x + (Math.random() - 0.5) * 2)),
          y: Math.min(95, Math.max(5, v.y + (Math.random() - 0.5) * 2)),
        }))
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "onHire":
        return "bg-blue-500";
      case "workshop":
        return "bg-yellow-500";
      case "dueReturn":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg border bg-gray-100">
        {/* Realistic map background - London area with satellite-like appearance */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 25%, #a5d6a7 50%, #81c784 75%, #66bb6a 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Roads/streets overlay */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" opacity="0.6">
            {/* Major roads */}
            <path d="M 0 200 Q 200 180, 400 200 T 800 200" stroke="#9e9e9e" strokeWidth="8" fill="none"/>
            <path d="M 0 300 Q 200 280, 400 300 T 800 300" stroke="#9e9e9e" strokeWidth="6" fill="none"/>
            <path d="M 200 0 Q 180 200, 200 400 T 200 600" stroke="#9e9e9e" strokeWidth="8" fill="none"/>
            <path d="M 400 0 Q 380 200, 400 400 T 400 600" stroke="#9e9e9e" strokeWidth="8" fill="none"/>
            <path d="M 600 0 Q 580 200, 600 400 T 600 600" stroke="#9e9e9e" strokeWidth="6" fill="none"/>
            {/* Water/river */}
            <path d="M 100 250 Q 300 240, 500 250 Q 700 260, 750 280" stroke="#64b5f6" strokeWidth="20" fill="none" opacity="0.7"/>
            {/* Urban areas (darker patches) */}
            <ellipse cx="300" cy="250" rx="80" ry="60" fill="#757575" opacity="0.3"/>
            <ellipse cx="500" cy="280" rx="100" ry="70" fill="#757575" opacity="0.3"/>
            <ellipse cx="400" cy="350" rx="90" ry="65" fill="#757575" opacity="0.3"/>
          </svg>
        </div>

        {vehicles.map((v) => (
          <div
            key={v.id}
            className={`
              absolute w-4 h-4 rounded-full border-2 border-white shadow-lg 
              transition-all duration-500 ${getColor(v.status)}
            `}
            style={{
              left: `${v.x}%`,
              top: `${v.y}%`,
            }}
            title={`${v.name} — ${v.status}`}
          />
        ))}
      </div>
    </div>
  );
}





