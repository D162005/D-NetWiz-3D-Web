/* eslint-disable no-unused-vars */
import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
/* eslint-enable no-unused-vars */
import ConceptVisualizations from './ConceptVisualizations'
import { getConceptInfo } from '../../data/conceptNames'

/**
 * Phase 5: Scene3D
 * Full-screen 3D visualization panel for OSI concepts.
 * Triggered by clicking "View 3D" in OSIExplorer.
 */
export default function Scene3D({ selectedConceptId, selectedLayerId, onBack }) {
  const concept = getConceptInfo(selectedConceptId)
  const [triggerScenario, setTriggerScenario] = useState(null)
  const [triggerClosing, setTriggerClosing] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('Ready')
  const isTCPConcept = selectedConceptId === 'trans-tcp-conn'
  const orbitControlsRef = useRef(null)

  const handleTriggerScenario = (scenario) => {
    // First clear the trigger
    setTriggerScenario(null)
    // Then set it after a brief moment to ensure a fresh re-render
    setTimeout(() => {
      setTriggerScenario(scenario)
    }, 50)
  }

  const handleTriggerClosing = () => {
    // Trigger closing handshake
    setTriggerClosing(null)
    setTimeout(() => {
      setTriggerClosing(true)
    }, 50)
  }

  // Reset triggerClosing and triggerScenario after animation completes (8 seconds)
  useEffect(() => {
    if (triggerClosing) {
      const timer = setTimeout(() => {
        setTriggerClosing(null)
        setTriggerScenario(null)
      }, 8500)
      return () => clearTimeout(timer)
    }
  }, [triggerClosing])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 w-full h-screen bg-slate-950 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Canvas Container */}
        <div className="w-full h-full">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-950 to-blue-950/20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/30 border-t-cyan-500 mx-auto mb-4"></div>
                <p className="text-cyan-400 text-lg font-semibold">Loading Visualization...</p>
              </div>
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              className="w-full h-full"
              style={{ background: '#0f172a' }}
            >
              <color attach="background" args={['#0f172a']} />
              <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
              <OrbitControls
                ref={orbitControlsRef}
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={2}
                onStart={() => {
                  // Stop auto-rotation when user starts interacting
                  if (orbitControlsRef.current) {
                    orbitControlsRef.current.autoRotate = false
                  }
                }}
              />
              
              {/* Lighting */}
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <pointLight position={[-10, -10, 5]} intensity={1} color="#00ffff" />
              
              {/* Concept Visualization */}
              <Suspense fallback={null}>
                <ConceptVisualizations
                  layerId={selectedLayerId}
                  conceptId={selectedConceptId}
                  triggerScenario={isTCPConcept ? triggerScenario : undefined}
                  triggerClosing={isTCPConcept ? triggerClosing : undefined}
                  onStateUpdate={isTCPConcept ? setConnectionStatus : undefined}
                />
              </Suspense>
            </Canvas>
          </Suspense>
        </div>

        {/* UI Overlay */}
        <motion.div
          className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Title and Info - Top Left */}
          <div className="text-white pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{concept.icon}</span>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">
                  {concept.name}
                </h1>
                <p className="text-cyan-200/60 text-sm font-medium mt-1">
                  {concept.layer} Layer • {concept.fullName}
                </p>
              </div>
            </div>
          </div>

          {/* Back Button - Top Right */}
          <motion.button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                       border border-cyan-400/50 text-cyan-300 font-semibold
                       hover:from-cyan-500/40 hover:to-blue-500/40 hover:border-cyan-300
                       transition-all duration-300 pointer-events-auto
                       flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </motion.button>
        </motion.div>

        {/* Control Panel - For TCP Concept */}
        {isTCPConcept && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-8 z-10 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="max-w-5xl mx-auto">
              {/* Status Message */}
              <div className="mb-6 p-4 rounded-lg bg-slate-900/50 border border-cyan-500/30">
                <p className="text-cyan-300 font-semibold text-center">
                  {connectionStatus || 'Ready'}
                </p>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-nowrap gap-3 justify-center items-center pointer-events-auto overflow-x-auto px-4 md:px-8">
                <motion.button
                  onClick={() => handleTriggerScenario('success')}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500/30 to-emerald-500/30 
                             border border-green-400/60 text-green-300 font-semibold text-sm whitespace-nowrap
                             hover:from-green-500/50 hover:to-emerald-500/50 hover:border-green-300
                             transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>✅</span> Successful Handshake
                </motion.button>

                <motion.button
                  onClick={() => handleTriggerScenario('timeout')}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500/30 to-orange-500/30 
                             border border-yellow-400/60 text-yellow-300 font-semibold text-sm whitespace-nowrap
                             hover:from-yellow-500/50 hover:to-orange-500/50 hover:border-yellow-300
                             transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>⏱️</span> Timeout Scenario
                </motion.button>

                <motion.button
                  onClick={() => handleTriggerScenario('refused')}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500/30 to-rose-500/30 
                             border border-red-400/60 text-red-300 font-semibold text-sm whitespace-nowrap
                             hover:from-red-500/50 hover:to-rose-500/50 hover:border-red-300
                             transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>❌</span> Connection Refused
                </motion.button>

                {/* Divider */}
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent mx-2"></div>

                {/* Closing Handshake Button */}
                <motion.button
                  onClick={handleTriggerClosing}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 
                             border border-purple-400/60 text-purple-300 font-semibold text-sm whitespace-nowrap
                             hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300
                             transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>👋</span> Close Connection (4-Way)
                </motion.button>
              </div>

              {/* Description */}
              <p className="text-cyan-200/60 text-sm leading-relaxed font-light mt-6 text-center">
                Use your mouse to rotate, scroll to zoom, and drag to pan. Click buttons to visualize TCP connection scenarios.
              </p>
            </div>
          </motion.div>
        )}

        {/* Info Panel - For Non-TCP Concepts */}
        {!isTCPConcept && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-8 z-10 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-cyan-200/80 text-sm leading-relaxed font-light">
                Use your mouse to rotate, scroll to zoom, and drag to pan. Explore the interactive 3D model of this network concept.
              </p>
            </div>
          </motion.div>
        )}

        {/* Concept Badge - Bottom Right Corner */}
        <motion.div
          className="absolute bottom-8 right-8 z-10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="px-6 py-4 rounded-xl bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-cyan-500/30 backdrop-blur-sm shadow-2xl">
            <div className="flex flex-col items-end gap-2">
              <div className="text-2xl">{concept.icon}</div>
              <div className="text-right">
                <p className="text-xs font-semibold text-cyan-400/70 uppercase tracking-wider">
                  {concept.layer}
                </p>
                <p className="text-sm font-bold text-white mt-1">
                  {concept.name}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
