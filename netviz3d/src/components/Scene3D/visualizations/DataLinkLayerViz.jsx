import React from 'react'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

/**
 * Data Link Layer Visualization - Per-Concept Models
 * MAC Address | Framing | ARP | Error Checking
 */

// MAC Address Visualization
function MACAddressViz() {
  const groupRef = useRef()
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.004
  })
  return (
    <group ref={groupRef}>
      {/* Devices with MAC addresses */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <group key={`mac-${i}`} position={[Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0]}>
            <mesh>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.6} />
            </mesh>
            {/* MAC identifier rings */}
            <mesh>
              <torusGeometry args={[1.2, 0.08, 8, 100]} />
              <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
          </group>
        )
      })}
      {/* Central switch */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

// Framing Visualization
function FramingViz() {
  const groupRef = useRef()
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003
  })
  return (
    <group ref={groupRef}>
      {/* Frame with header, payload, trailer */}
      <group>
        {/* Header */}
        <mesh position={[-2, 0, 0]}>
          <boxGeometry args={[0.8, 2.5, 0.8]} />
          <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.7} />
        </mesh>
        {/* Payload (data) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 2.5, 2.5]} />
          <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.6} />
        </mesh>
        {/* Trailer/CRC */}
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[0.8, 2.5, 0.8]} />
          <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.7} />
        </mesh>
      </group>
      {/* Frame boundary line */}
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([-2.5, -1.5, 0, 2.5, -1.5, 0])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ef4444" linewidth={2} />
      </line>
    </group>
  )
}

// ARP Visualization (Address Resolution Protocol)
function ARPViz() {
  const groupRef = useRef()
  const timeRef = useRef(0)
  useFrame(() => {
    timeRef.current += 0.016
    if (groupRef.current) groupRef.current.rotation.y += 0.002
  })
  return (
    <group ref={groupRef}>
      {/* Broadcaster */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.6} />
      </mesh>
      {/* Broadcast packets expanding */}
      <ARPParticles timeRef={timeRef} />
      {/* Target responder */}
      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.6} />
      </mesh>
      {/* Direct response arrow */}
      <ResponseIndicator timeRef={timeRef} />
    </group>
  )
}

function ARPParticles({ timeRef }) {
  const particlesRef = useRef([])

  useFrame(() => {
    particlesRef.current.forEach((ref, i) => {
      if (ref) {
        const radianOffset = (i / 4) * Math.PI * 2
        const distance = 2 + Math.sin(timeRef.current * 0.003) * 1
        ref.position.x = Math.cos(radianOffset) * distance
        ref.position.y = Math.sin(radianOffset) * distance
      }
    })
  })

  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`arp-${i}`} ref={(el) => (particlesRef.current[i] = el)} position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </>
  )
}

function ResponseIndicator({ timeRef }) {
  const responseRef = useRef()

  useFrame(() => {
    if (responseRef.current) {
      const showResponse = Math.floor(timeRef.current / 1000) % 2 === 1
      responseRef.current.visible = showResponse
    }
  })

  return (
    <mesh ref={responseRef} position={[3, 0.5, 0]}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.9} />
    </mesh>
  )
}

// Error Checking Visualization
function ErrorCheckingViz() {
  const groupRef = useRef()
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.z += 0.004
  })
  return (
    <group ref={groupRef}>
      {/* Frame with errors */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.7} />
      </mesh>
      {/* CRC/Checksum calculator */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
      {/* Validation result - good frame */}
      <mesh position={[4, 1.5, 0]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.7} />
      </mesh>
      {/* Validation result - bad frame (discarded) */}
      <mesh position={[4, -1.5, 0]} scale={0.7}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#6b7280" emissive="#374151" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default function DataLinkLayerViz({ conceptId = 'dl-mac-addr' }) {
  switch (conceptId) {
    case 'dl-mac-addr':
      return <MACAddressViz />
    case 'dl-framing':
      return <FramingViz />
    case 'dl-arp':
      return <ARPViz />
    case 'dl-error-check':
      return <ErrorCheckingViz />
    default:
      return <MACAddressViz />
  }
}
