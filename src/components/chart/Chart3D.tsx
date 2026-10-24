"use client";

import { Billboard, Line, OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CHI } from "@/lib/lunar";
import { relationsOf, type Chart, type PlacedStar } from "@/lib/tuvi/engine";
import { BRIGHTNESS_OPACITY, ELEMENT_COLOR, HOA_COLOR } from "./starStyle";

const R = 5;
const FONT = "/fonts/BeVietnamPro-Medium.ttf";
const FONT_BOLD = "/fonts/BeVietnamPro-SemiBold.ttf";

/** Tý hơi lệch phải ở phía trước, chi tăng theo chiều kim đồng hồ khi nhìn trên màn hình — khớp lá 2D. */
const thetaOf = (chi: number) => ((chi * 30 - 15) * Math.PI) / 180;
const posOf = (chi: number, r = R, y = 0): [number, number, number] => [
  -r * Math.sin(thetaOf(chi)),
  y,
  r * Math.cos(thetaOf(chi)),
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.12, "rgba(255,255,255,0.9)");
    grd.addColorStop(0.35, "rgba(255,255,255,0.28)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Glow({
  position,
  color,
  scale,
  opacity,
  tex,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  opacity: number;
  tex: THREE.Texture;
}) {
  return (
    <sprite position={position} scale={[scale, scale, scale]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

function majorScale(s: PlacedStar) {
  return 0.55 + (s.brightness ? BRIGHTNESS_OPACITY[s.brightness] : 0.7) * 0.75;
}

function PalaceSector({
  chi,
  selected,
  related,
  onSelect,
}: {
  chi: number;
  selected: boolean;
  related: boolean;
  onSelect: () => void;
}) {
  const geom = useMemo(() => {
    const start = -thetaOf(chi) - Math.PI / 2 - (Math.PI / 12) * 0.94;
    return new THREE.RingGeometry(R * 0.7, R * 1.22, 24, 1, start, (Math.PI / 6) * 0.94);
  }, [chi]);
  const [hover, setHover] = useState(false);
  const color = selected ? "#e7c07a" : related ? "#b0a998" : "#efe7d6";
  const opacity = selected ? 0.13 : hover ? 0.07 : related ? 0.05 : 0.025;
  return (
    <mesh
      geometry={geom}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
    >
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Fog({ chis, color, label, tex, lift = 0 }: { chis: [number, number]; color: string; label: string; tex: THREE.Texture; lift?: number }) {
  // Đặt ở ranh giới giữa hai cung bị án ngữ
  const mid = (thetaOf(chis[0]) + thetaOf(chis[1])) / 2 + (Math.abs(chis[0] - chis[1]) > 1 ? Math.PI : 0);
  const at = (r: number, y: number): [number, number, number] => [-r * Math.sin(mid), y, r * Math.cos(mid)];
  return (
    <group>
      {[0.4, 1.1, 1.8, 2.5].map((y, i) => (
        <Glow key={i} tex={tex} position={at(R * (0.92 + (i % 2) * 0.12), y)} color={color} scale={2.6} opacity={0.08} />
      ))}
      <Billboard position={at(R * 1.0, 3.25 + lift)}>
        <Text font={FONT} fontSize={0.24} color={color} anchorX="center" fillOpacity={0.8}>
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

function Scene({
  chart,
  selected,
  onSelect,
  showLuu,
  autoRotate,
}: {
  chart: Chart;
  selected: number;
  onSelect: (chi: number) => void;
  showLuu: boolean;
  autoRotate: boolean;
}) {
  const tex = useGlowTexture();
  const group = useRef<THREE.Group>(null);
  const targetRot = useRef(0);
  const { camera } = useThree();
  const rel = relationsOf(selected);
  const related = new Set([...rel.tamHop, rel.xungChieu]);

  useEffect(() => {
    // Xoay bàn sao để cung được chọn ra chính diện so với góc nhìn hiện tại
    const [x, , z] = posOf(selected);
    const local = Math.atan2(x, z);
    const camAz = Math.atan2(camera.position.x, camera.position.z);
    const current = group.current?.rotation.y ?? 0;
    let target = camAz - local;
    target = current + Math.atan2(Math.sin(target - current), Math.cos(target - current));
    targetRot.current = target;
  }, [selected, camera]);

  useFrame((_, dt) => {
    if (!group.current) return;
    if (autoRotate) targetRot.current += dt * 0.06;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRot.current, 3.2, dt);
  });

  const triangle = [selected, ...rel.tamHop, selected].map((c) => posOf(c, R * 0.82, 0.02));
  const xung = [posOf(selected, R * 0.82, 0.02), posOf(rel.xungChieu, R * 0.82, 0.02)];

  return (
    <group ref={group}>
      {/* Thiên bàn ở tâm */}
      {[1.1, 1.9, 2.7].map((r, i) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[r, r + 0.012, 96]} />
          <meshBasicMaterial color="#e7c07a" transparent opacity={0.25 - i * 0.06} depthWrite={false} />
        </mesh>
      ))}
      <Glow tex={tex} position={[0, 0.3, 0]} color="#e7c07a" scale={3.2} opacity={0.35} />
      <Billboard position={[0, 1.15, 0]}>
        <Text font={FONT_BOLD} fontSize={0.34} color="#f2d79f" anchorX="center">
          {chart.labels.cuc}
        </Text>
        <Text font={FONT} fontSize={0.2} color="#b0a998" anchorX="center" position={[0, -0.36, 0]}>
          {`${chart.labels.amDuong} · ${chart.labels.banMenh}`}
        </Text>
      </Billboard>

      {/* Đường tam hợp và xung chiếu */}
      <Line points={triangle} color="#e7c07a" lineWidth={1.4} transparent opacity={0.7} />
      <Line points={xung} color="#b9c1ff" lineWidth={1} dashed dashSize={0.25} gapSize={0.18} transparent opacity={0.7} />

      {chart.palaces.map((p) => {
        const isSel = p.chi === selected;
        const near = isSel || related.has(p.chi);
        const labelPos = posOf(p.chi, R * 1.4, 0.05);
        return (
          <group key={p.chi}>
            <PalaceSector chi={p.chi} selected={isSel} related={related.has(p.chi)} onSelect={() => onSelect(p.chi)} />
            <Billboard position={labelPos}>
              <Text
                font={FONT_BOLD}
                fontSize={isSel ? 0.36 : 0.28}
                color={p.isMenh ? "#f2d79f" : isSel ? "#efe7d6" : near ? "#b0a998" : "#827c70"}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.04}
              >
                {p.name.toUpperCase()}
              </Text>
              <Text font={FONT} fontSize={0.17} color="#827c70" anchorX="center" position={[0, -0.3, 0]}>
                {`${CHI[p.chi]} · ${p.daiVanStart}${p.isThan ? " · Thân" : ""}`}
              </Text>
            </Billboard>

            {/* Chính tinh */}
            {p.major.map((s, i) => {
              const y = 0.7 + i * 0.85;
              const pos = posOf(p.chi, R * 0.86, y);
              const color = ELEMENT_COLOR[s.element];
              const op = s.brightness ? BRIGHTNESS_OPACITY[s.brightness] : 0.8;
              return (
                <group key={s.name}>
                  <Glow tex={tex} position={pos} color={color} scale={majorScale(s) * (isSel ? 1.25 : 1)} opacity={op} />
                  <Glow tex={tex} position={pos} color="#ffffff" scale={0.18} opacity={op} />
                  <Billboard position={[pos[0], pos[1] + 0.4, pos[2]]}>
                    <Text font={FONT_BOLD} fontSize={near ? 0.21 : 0.16} color={color} anchorX="center" fillOpacity={(near ? 0.55 : 0.3) + op * (near ? 0.45 : 0.3)}>
                      {s.name.toUpperCase() + (s.hoa ? `  ·  ${s.hoa}` : "")}
                    </Text>
                  </Billboard>
                  {s.hoa && (
                    <mesh position={pos} rotation={[Math.PI / 2, 0, 0]}>
                      <torusGeometry args={[0.32, 0.012, 8, 48]} />
                      <meshBasicMaterial color={HOA_COLOR[s.hoa]} transparent opacity={0.85} />
                    </mesh>
                  )}
                </group>
              );
            })}
            {p.major.length === 0 && near && (
              <Billboard position={posOf(p.chi, R * 0.86, 0.9)}>
                <Text font={FONT} fontSize={0.17} color="#827c70" anchorX="center">
                  Vô chính diệu
                </Text>
              </Billboard>
            )}

            {/* Phụ tinh: cụm điểm sáng nhỏ quanh cung */}
            {p.minor.map((s) => {
              const k = hash(s.name + p.chi);
              const k2 = hash(p.chi + s.name);
              const ang = thetaOf(p.chi) + (k - 0.5) * 0.42;
              const r = R * (1.02 + k2 * 0.16);
              const y = 0.25 + hash(s.name) * 2.9;
              const color = s.kind === "hoa" ? HOA_COLOR[s.name.replace("Hóa ", "")] : ELEMENT_COLOR[s.element];
              const op = s.kind === "vong" ? 0.3 : s.kind === "sat" ? 0.55 : 0.75;
              return (
                <Glow
                  key={s.name}
                  tex={tex}
                  position={[-r * Math.sin(ang), y, r * Math.cos(ang)]}
                  color={color}
                  scale={s.kind === "hoa" ? 0.5 : 0.26 + (isSel ? 0.08 : 0)}
                  opacity={op}
                />
              );
            })}

            {/* Sao lưu niên — ánh bạc */}
            {showLuu &&
              p.luu.map((s, i) => {
                const pos = posOf(p.chi, R * 0.98, 3.4 + i * 0.32);
                return <Glow key={s.name} tex={tex} position={pos} color="#b9c1ff" scale={0.34} opacity={0.85} />;
              })}
          </group>
        );
      })}

      <Fog chis={chart.tuan} color="#cfd3e8" label="TUẦN" tex={tex} />
      <Fog chis={chart.triet} color="#ffb3a6" label="TRIỆT" tex={tex} lift={chart.triet[0] === chart.tuan[0] ? 0.4 : 0} />
    </group>
  );
}

/** Màn dọc (điện thoại): hạ camera và nhắm vào nửa trước để cung chính diện đủ lớn; kéo để xoay xem phần còn lại. */
function Controls({ interactive, zoom }: { interactive: boolean; zoom: boolean }) {
  const { camera, size } = useThree();
  const portrait = size.width / size.height < 0.95;
  const target: [number, number, number] = portrait ? [0, 0.6, 2.4] : [0, 0.2, 0.6];
  useEffect(() => {
    if (portrait) camera.position.set(0, 9.5, 15.5);
    else camera.position.set(0, 14.5, 14.5);
  }, [portrait, camera]);
  return (
    <OrbitControls
      enabled={interactive}
      enablePan={false}
      enableZoom={interactive && zoom}
      minDistance={portrait ? 8 : 11}
      maxDistance={28}
      minPolarAngle={0.25}
      maxPolarAngle={1.2}
      rotateSpeed={0.6}
      target={target}
    />
  );
}

export default function Chart3D({
  chart,
  selected,
  onSelect,
  showLuu = false,
  interactive = true,
  zoom = true,
  autoRotate = false,
  className = "",
  onReady,
}: {
  chart: Chart;
  selected: number;
  onSelect: (chi: number) => void;
  showLuu?: boolean;
  interactive?: boolean;
  zoom?: boolean;
  autoRotate?: boolean;
  className?: string;
  onReady?: () => void;
}) {
  return (
    <div className={className || "relative h-full w-full"}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 14.5, 14.5], fov: 42, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => requestAnimationFrame(() => onReady?.())}
      >
        <fog attach="fog" args={["#05050a", 16, 34]} />
        <Stars radius={60} depth={30} count={1400} factor={2.4} saturation={0} fade speed={0.4} />
        <Scene chart={chart} selected={selected} onSelect={onSelect} showLuu={showLuu} autoRotate={autoRotate} />
        <Controls interactive={interactive} zoom={zoom} />
      </Canvas>
    </div>
  );
}
