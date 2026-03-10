# Combined Mode Animation: Process Flow & Timing Table

## Overview
When **both Packet Loss** AND **ACK Loss** are enabled, the animation demonstrates a complete TCP error recovery scenario with two retransmission cycles, duplicate detection, and recovery ACK.

---

## Complete Timeline: Segment Sequence #001

### **PHASE 1: Initial Transmission** ⏱️ [0.0s - 1.2s]

| Time | Event | Details |
|------|-------|---------|
| **0.0s** | ✅ Segment Created | Seq 001 starts at client position (x=-4) |
| **0.0s** | 📤 [CLIENT] Sending | Message: "Sending Data Segment (Seq 001)..." |
| **0.0s-0.05s** | Ghost Copy Created | Segment added to send buffer at client |
| **0.0-1.2s** | Transit (50% point) | Speed: 0.00695 per frame |
| **1.2s** | ❌ PACKET LOSS | Segment disappears at midway point (50% position) |
| **1.2s** | ⏱️ Timeout Timer Started | Timer begins: will fire at 1.2 + 6.75 = **7.95s** |
| **1.2s** | ⏸️ [PROTOCOL] Pause Set | 27.0s pause initiated (combined mode pause) |

---

### **PHASE 2: Timeout & 1st Retransmit** ⏱️ [7.95s - 8.85s]

| Time | Event | Details |
|------|-------|---------|
| **7.95s** | 🔔 TIMEOUT FIRES | Timeout duration elapsed: 6.75s |
| **7.95s** | ⏱️ [CLIENT] Timeout! | Message: "Timeout! No ACK received → Retransmitting..." |
| **7.95s** | 📤 [CLIENT] 1st Retry | Message: "1st Retransmit of Segment 001..." |
| **7.95s** | 🔄 Retransmit Created | 1st retransmit packet created at client |
| **7.95s** | ⏱️ New Timeout Set | 2nd timeout timer starts: will fire at 7.95 + 6.75 = **14.7s** |
| **7.95-8.85s** | Transit (1st retry) | Speed: 0.01761 per frame = 0.9s travel time |
| **8.85s** | ✅ Server Receives | 1st retransmit reaches server (95% position) |

---

### **PHASE 3: ACK Sent & Lost** ⏱️ [8.85s - 10.8s]

| Time | Event | Details |
|------|-------|---------|
| **8.85s** | 2️⃣ [SERVER] Received | Message: "Received 1st Retransmit (Seq 001) → Sending ACK..." |
| **8.85s** | 🟢 Server Flash | Server glows green, ACK created (willBeLost=true) |
| **8.85s** | 📨 ACK Created | ACK packet spawned at server with "will be lost" flag |
| **8.85-9.6s** | ACK Transit (50% point) | Speed: 0.01111 per frame = 0.75s to 50% |
| **9.6s** | ❌ ACK LOSS | ACK disappears at midway point (50% position) |
| **9.6s** | 3️⃣ [NETWORK] ACK Lost | Message: "ACK Lost! Segment 001's ACK disappeared..." |
| **9.6-10.8s** | Fade Animation | Pause (0.6s) + Transition (0.1s) + Fade (1.4s) = 2.1s |

---

### **PHASE 4: 2nd Timeout & 2nd Retransmit** ⏱️ [14.7s - 15.6s]

| Time | Event | Details |
|------|-------|---------|
| **14.7s** | 🔔 TIMEOUT FIRES AGAIN | 2nd timeout duration: 6.75s from Phase 2 |
| **14.7s** | ⏱️ [CLIENT] Timeout! | Message: "Timeout! No ACK received → Retransmitting..." |
| **14.7s** | 📤 [CLIENT] 2nd Retry | Message: "2nd Retransmit of Segment 001..." |
| **14.7s** | 🔄 Retransmit #2 Created | 2nd retransmit packet created at client |
| **14.7-15.6s** | Transit (2nd retry) | Speed: 0.01761 per frame = 0.9s travel time |
| **15.6s** | ✅ Server Receives | 2nd retransmit reaches server (95% position) |

---

### **PHASE 5: Duplicate Detection & Removal** ⏱️ [15.6s - 18.9s]

| Time | Event | Details |
|------|-------|---------|
| **15.6s** | 🔍 Duplicate Check | Server checks if Seq 001 already received → YES |
| **15.6s** | ❌ DUPLICATE FOUND | 2nd retransmit matches existing sequence |
| **15.6s** | 4️⃣ [SERVER] Duplicate | Message: "Duplicate Detected! Already received..." |
| **15.6s** | ⏸️ [PROTOCOL] Pause | Message: "Recovery in progress → Pausing (7.5s)..." |
| **15.6s** | ⏸️ Timeout Cleared | Timeout is deleted (prevents 3rd retransmit) |
| **15.6s** | 🎬 Removal Animation | Duplicate removal animation starts |
| **15.6-17.6s** | Discard Animation | Packet fades and shrinks (2.0s animation) |
| **17.6-18.3s** | Post-Animation Pause | Settling time (0.8s pause message) |
| **18.3-18.9s** | Buffer Time | Additional buffer before recovery ACK (0.5s) |

---

### **PHASE 6: Recovery ACK Processing** ⏱️ [18.4s - 19.3s]

| Time | Event | Details |
|------|-------|---------|
| **15.6s** | 🔙 Recovery ACK Queued | Prepared but NOT sent yet |
| **18.4s** | 5️⃣ [SERVER] Sending | Message: "Sending Recovery ACK..." |
| **18.4s** | 🔙 Recovery ACK Created | Recovery ACK spawned at server |
| **18.4-19.3s** | Recovery ACK Transit | Speed: 0.01111 per frame = 0.9s |
| **19.3s** | ✅ Client Receives | Recovery ACK reaches client (95% position) |

---

### **PHASE 7: Completion & Next Segment Ready** ⏱️ [19.3s - 28.2s]

| Time | Event | Details |
|------|-------|---------|
| **19.3s** | 6️⃣ [CLIENT] Received | Message: "Received Recovery ACK → Ready for next..." |
| **19.3-28.2s** | Recovery Pause | Total pause: 7.5s after duplicate detection |
| **28.2s** | ✅ PAUSE COMPLETE | Segment 002 ready to send |
| **28.2s+ | 📤 Next Segment | Segment 002 transmission begins (repeats cycle) |

---

## Summary Metrics

### **Key Timing Components**

| Component | Duration | Formula | Notes |
|-----------|----------|---------|-------|
| **Segment Travel to Loss** | 1.2s | 50% ÷ 0.00695/frame | Original packet to midpoint |
| **Timeout Duration** | 6.75s | Fixed timer value | 1.5x slower for clarity |
| **1st Retransmit Travel** | 0.9s | 95% ÷ 0.01761/frame | From client to server |
| **ACK Travel to Loss** | 0.75s | 50% ÷ 0.01111/frame | Server to midpoint |
| **ACK Fade Animation** | 2.1s | 0.6 + 0.1 + 1.4 | Pause + Transition + Fade |
| **Recovery ACK Delay** | 2.8s | Removal (2.0) + Pause (0.8) | After duplicate detected |
| **Recovery ACK Travel** | 0.9s | 95% ÷ 0.01111/frame | Server to client |
| **Removal Animation** | 3.3s | 2.0 + 0.8 + 0.5 | Total duplicate removal |
| **Total Recovery Pause** | 7.5s | 3.3 + 2.8 + 0.9 + 0.5 | Protection period |

### **Total Time for One Segment with Errors**

```
0.0s ──→ [Segment Loss] 1.2s
        ↓
1.2s ──→ [Wait for Timeout] 6.75s
        ↓
7.95s ──→ [1st Retransmit] 0.9s
        ↓
8.85s ──→ [ACK Lost] 2.1s (0.75s travel + 2.1s fade)
        ↓
10.8s ──→ [Wait for Timeout] 6.75s - 1.2s = 5.55s remaining
        ↓
14.7s ──→ [2nd Retransmit] 0.9s
        ↓
15.6s ──→ [Duplicate & Recovery] 7.5s total
        ↓
23.1s ──→ PLUS remaining pause time = ~28.2s total

──────────────────────────────────
TOTAL: ~28.2 seconds per segment
```

---

## Phase Breakdown

### **3 Main Recovery Phases**

#### **Phase 1: Packet Loss Detection**
- **Duration**: 1.2s
- **What Happens**: Original segment sent, lost at 50%
- **Client Action**: Waits for timeout
- **Key Learning**: Network packet can be discarded mid-transmission

#### **Phase 2: Duplicate Detection via Retransmission**
- **Duration**: 7.95s → 15.6s = **7.65s** 
- **What Happens**: 1st retransmit sent, ACK sent back but lost
- **Client Action**: Waits for another timeout
- **Key Learning**: ACK loss prevents client from knowing server received packet

#### **Phase 3: Error Recovery via 2nd Retransmit**
- **Duration**: 15.6s → 23.1s = **7.5s**
- **What Happens**: 2nd retransmit detected as duplicate, recovery ACK sent
- **Client Action**: Receives recovery ACK, resumes transmission
- **Key Learning**: Multiple retransmits ensure reliability even with packet loss

---

## Critical Control Points

### **Timeout System**
- **1st Timeout Fires at**: 1.2s + 6.75s = **7.95s**
- **2nd Timeout Fires at**: 7.95s + 6.75s = **14.7s**
- **3rd Timeout Prevention**: Cleared when duplicate detected at **15.6s**

### **ACK Loss Detection**
- **ACK Created & Lost at**: 8.85s + 0.75s = **9.6s**
- **ACK Not Recovered**: Causes 2nd timeout to fire

### **Duplicate Protection**
- **Duplicate Detected at**: 15.6s (2nd retransmit arrival)
- **Recovery Pause Duration**: 7.5s total
- **Next Segment Ready at**: 23.1s + 5.1s = **28.2s**

---

## Message Flow (Chronological Order)

```
0.0s  📤 [CLIENT] Sending Data Segment (Seq 001)...
1.2s  📤 Ghost Copy Created in Send Buffer (Seq 001)
7.95s ⏱️  [CLIENT] Timeout! No ACK received → Retransmitting Segment 001...
7.95s 📤 [CLIENT] 1st Retransmit of Segment 001...
8.85s 2️⃣ [SERVER] Received 1st Retransmit (Seq 001) → Sending ACK (will be lost)...
9.6s  3️⃣ [NETWORK] ACK Lost! Segment 001's ACK disappeared → Client won't receive
14.7s ⏱️  [CLIENT] Timeout! No ACK received → Retransmitting Segment 001...
14.7s 📤 [CLIENT] 2nd Retransmit of Segment 001...
15.6s 4️⃣ [SERVER] Duplicate Detected! Segment 001 already received...
15.6s ⏸️  [PROTOCOL] Recovery in progress → Pausing transmission (7.5s)...
15.6s 🔙 [SERVER] Preparing recovery ACK for Segment 001...
18.4s 5️⃣ [SERVER] Sending Recovery ACK (Seq 001) → Transmission resumes...
19.3s 6️⃣ [CLIENT] Received Recovery ACK (Seq 001) → Ready to send next...
28.2s ✅ Ready for Next Segment
```

---

## Visual Timeline

```
│ 0.0s           │ 1.2s            │ 7.95s            │ 8.85s    │ 9.6s      │ 14.7s         │ 15.6s              │ 23.1s
├─────────────┤ ├─────────────────│ ├────────────┤  ├─────────┤ ├───────────┤ ├───────────┤ ├──────────────┤ ├──────────
  Original        Segment Lost     Timeout 1        1st Retr   ACK Lost    Timeout 2    Duplicate      Recovery      Next Ready
  Segment         @ 50%            Fires           Reaches    @ 50%       Fires        Detected       Complete
  Created                                          Server


│────────────────────────────────── PHASE 1: DETECTION (1.2s) ───────────────────────────────────│
│───── PHASE 2: 1st RECOVERY (7.65s) ────│───── PHASE 3: 2nd RECOVERY (7.5s) ─────│
│─────────────────────────── TOTAL TIME: ~28.2 seconds ──────────────────────────────│
```

---

## Segment Positions Over Time

### **Position Legend**: 0 = Client (x=-4) → 1 = Server (x=4.8)

| Time | Original | 1st RTX | 2nd RTX | ACK | Recovery ACK | Notes |
|------|----------|---------|---------|-----|-------------|-------|
| 0.0s | 0.000 | - | - | - | - | Start |
| 0.6s | 0.250 | - | - | - | - | Halfway |
| 1.2s | 0.500 | - | - | - | - | **Lost at 50%** |
| 7.95s | Lost | 0.000 | - | - | - | Timeout 1 |
| 8.85s | Lost | 0.950 | - | - | - | Retrans 1 reaches |
| 8.85s | Lost | 1.000 | - | 1.000 | - | ACK sent |
| 9.6s | Lost | 1.000 | - | 0.500 | - | **ACK lost at 50%** |
| 14.7s | Lost | 1.000 | 0.000 | Fading | - | Timeout 2 |
| 15.6s | Lost | 1.000 | 0.950 | Fading | - | Retrans 2 reaches |
| 15.6s | Lost | 1.000 | 1.000 | Fading | 1.000 | Duplicate, Recovery ACK |
| 19.3s | Lost | 1.000 | Remove | Removed | 0.050 | Recovery ACK arrives |

---

## Conclusions

### **What This Animation Demonstrates:**
1. ✅ **Packet Loss**: Original segment disappears mid-transit
2. ✅ **Timeout Mechanism**: Client waits (6.75s), then retransmits
3. ✅ **ACK Loss**: Confirmation packet lost, triggers another timeout
4. ✅ **Duplicate Detection**: Server recognizes 2nd retransmit as duplicate
5. ✅ **Error Recovery**: Server sends protection ACK to stop retransmits
6. ✅ **STOP-AND-WAIT**: Client pauses (~28s total) during recovery

### **Key TCP Concepts Illustrated:**
- **Reliability through Retransmission**: Multiple attempts ensure delivery
- **Timeout-based Congestion Control**: Waiting periods prevent network overload
- **Duplicate Detection**: Server rejects retransmitted duplicates
- **ACK Importance**: Lost ACK causes unnecessary retransmission
- **Protocol Efficiency**: Even with errors, data eventually reaches destination

