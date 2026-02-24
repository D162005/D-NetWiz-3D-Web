import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Hero from './components/ui/Hero'
import OSIMenu from './components/ui/OSIMenu'
import OSIExplorer from './components/ui/OSIExplorer'
import Scene3D from './components/Scene3D/Scene3D'

/**
 * NetViz3D Dashboard - Complete Layout
 * 
 * Flow:
 * 1. Full-screen Hero section
 * 2. OSI Layers Menu (centered) - default view
 * 3. Two-column OSI Explorer (when layer selected)
 * 4. 3D Visualization (Phase 5) - triggered by "View 3D" button
 */
export default function App() {
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [view3D, setView3D] = useState(false)
  const [selectedConceptId, setSelectedConceptId] = useState(null)

  const handleLayerSelect = (layerId) => {
    setSelectedLayer(layerId)
  }

  const handleBackToMenu = () => {
    setSelectedLayer(null)
  }

  const handleView3D = (conceptId) => {
    setSelectedConceptId(conceptId)
    setView3D(true)
  }

  const handleBack3D = () => {
    setView3D(false)
    setSelectedConceptId(null)
  }

  return (
    <div className="w-screen bg-[#050505] text-white overflow-x-hidden">
      {/* ── Phase 1: Full-Screen Hero ──────────────────────────────── */}
      <Hero />

      {/* ── Phase 5: 3D Visualization Mode ────────────────────────── */}
      <AnimatePresence mode="wait">
        {view3D && (
          <Scene3D
            key="scene3d"
            selectedConceptId={selectedConceptId}
            selectedLayerId={selectedLayer}
            onBack={handleBack3D}
          />
        )}
      </AnimatePresence>

      {/* ── Conditional Rendering: Menu or Explorer ────────────────── */}
      <AnimatePresence mode="wait">
        {!view3D && (
          <>
            {!selectedLayer ? (
              // Show OSI Menu by default
              <OSIMenu key="menu" onLayerSelect={handleLayerSelect} />
            ) : (
              // Show Explorer when layer is selected
              <OSIExplorer
                key="explorer"
                selectedLayer={selectedLayer}
                onBack={handleBackToMenu}
                onView3D={handleView3D}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
