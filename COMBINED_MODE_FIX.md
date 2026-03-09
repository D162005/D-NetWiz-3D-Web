# Combined Mode Animation Fix (Packet Loss + ACK Loss)

## Problem Identified
The combined mode was showing the duplicate removal animation on the first retransmit instead of the second, causing the animation flow to be incorrect.

## Root Cause
The pause timer set when the original segment is lost was insufficient for combined mode, which requires:
1. **Timeout 1**: 4.5 seconds (original packet lost, waiting)
2. **Retransmit 1**: 0.6 seconds (first retransmit travels to server)
3. **ACK Lost**: 0.8+ seconds (ACK created with willBeLost flag, then lost in transit)
4. **Timeout 2**: 4.5 seconds (waiting for first ACK that never arrives)
5. **Retransmit 2**: 0.6 seconds (second retransmit travels to server)
6. **Duplicate Detection**: ~0.05 seconds (instant)  
7. **Removal Animation**: 3.3 seconds (duplicate removal visual)
8. **Recovery ACK**: 2.8 + 0.6 = 3.4 seconds (delayed ACK creation and travel)

**Total**: ~18.2 seconds

## Solution Implemented

### Fix 1: Proper Pause Timing in Combined Mode (Line 150-155)
```javascript
if (!ackLossEnabled) {
  // Phase 4: timeout (4.5s) + retransmit travel (0.6s) + ACK travel (0.6s) + buffer (0.3s) = 6.0s
  lastClearedTimeRef.current = timeRef.current + 6.0
} else {
  // Combined mode: Pause for both retransmit cycles + duplicate removal animation
  lastClearedTimeRef.current = timeRef.current + 18.0
}
```

This ensures the next segment is not sent until the entire combined animation sequence completes.

### Fix 2: Preserve Longer Pause Duration (Line 388-397)
```javascript
// Only extend pause if current pause is shorter, don't shorten an existing longer pause
const nextPauseTime = timeRef.current + 4.0
if (!lastClearedTimeRef.current || nextPauseTime > lastClearedTimeRef.current) {
  lastClearedTimeRef.current = nextPauseTime
}
```

This prevents the removal animation completion pause (4.0s) from overwriting the longer combined mode pause (18.0s).

## Expected Animation Sequence (Combined Mode)

### Timeline
- **t = 0.0s**: Segment 001 sent from client
- **t ≈ 0.3-0.8s**: Original segment at 50% position → **LOST**
  - Pause timer set to expire at ~18.8s
- **t ≈ 5.3s**: First timeout triggered (4.5s after loss)
  - First retransmit segment created
- **t ≈ 5.9s**: First retransmit reaches server
  - **NOT detected as duplicate** (lastReceivedSeq is empty)
  - Server sends ACK with `willBeLost=true`
  - Segment 001 added to server tracking
  - Server flashes GREEN
- **t ≈ 6.4s**: ACK lost in transit at 50%
  - ACK disappears mid-way
- **t ≈ 9.8s**: Second timeout triggered (4.5s after first retransmit)
  - Second retransmit segment created
- **t ≈ 10.4s**: Second retransmit reaches server
  - **DETECTED as duplicate** (Segment 001 already tracked)
  - **Duplicate removal animation starts**
  - Duplicate packet shown entering server with discard effect
- **t ≈ 10.4-13.7s**: Removal animation plays (3.3s)
  - Duplicate packet fades and shrinks over 2.0s
  - Pause message shown over 0.8s
  - Total animation: 3.3s
- **t ≈ 13.2s**: Recovery ACK queued (2.8s delay from detection at 10.4s)
- **t ≈ 13.2s**: Recovery ACK sent from server
- **t ≈ 13.8s**: Recovery ACK reaches client
  - Client receives ACK confirming reception
  - Segment fully confirmed
- **t ≈ 18.8s**: Pause timer expires
  - Next segment can be sent

## Visual Indicators

### Server Flash
- **Green flash**: Packet received successfully
- **First retransmit arrival** (t ≈ 5.9s): Server flashes GREEN
- **Second retransmit arrival** (t ≈ 10.4s): Server flashes GREEN + removal animation

### ACK Packets
- **First ACK** (t ≈ 5.9s): Yellow/Golden color, moving from server to client
- **ACK at 50%** (t ≈ 6.4s): ACK disappears (LOST)
- **Recovery ACK** (t ≈ 13.2s): Green/Recovery color, sent after removal animation

### Messages
1. "Original Segment Sent"
2. "Client Timeout (Seq 001): Retransmitting segment..."
3. "✅ Retransmitted Segment Received! Sending ACK (will be lost)..."
4. "3️⃣ ACK Lost in Transit (Seq 001): ACK was traveling back to client but packet disappeared mid-way!"
5. "🔙 Duplicate Removed. Server preparing to resend ACK..."
6. Recovery ACK sent and received

## Packet Summary

### Total Packets Sent
- **2 Segments**: Original (lost) + 2 Retransmits
- **2 ACKs**: First ACK (lost) + 1 Recovery ACK

### Sequence
```
CLIENT                          SERVER
|
Seg 001 -------→ (LOST at 50%)
|
[4.5s timeout]
|
Seg 001 (retry) ------→ ✓
          ACK ←---------- (marked willBeLost)
[ACK LOST at 50%]
|
[4.5s timeout]
|
Seg 001 (retry2) ------→ ✗ DUPLICATE!
          ACK ←--------- (Recovery, after removal)
```

## Code Changes

### ACKViz.jsx

**Line 150-155**: Set proper pause timing based on mode
- Phase 4: 6.0s
- Combined: 18.0s

**Line 164**: Only track original segment in non-packet-loss modes
- `if (!packetLossEnabled)` prevents tracking original in combined mode

**Line 388-397**: Preserve longer pause durations
- Don't let removal animation pause override longer mode pause

## Testing Notes

1. **Enable both "Packet Loss" and "ACK Loss"** in the UI
2. **Start the animation** and observe:
   - First retransmit should arrive successfully
   - First ACK should be lost
   - Second retransmit should trigger duplicate animation
   - Recovery ACK should be sent and received
3. **Timing should be smooth** with no skipped sections
4. **Messages should match** the expected sequence above
5. **Next segment should wait** until complete (~18.8s after original loss)

## Verification Checklist

- [ ] First retransmit **NOT** showing removal animation
- [ ] Second retransmit **IS** showing removal animation
- [ ] 2 ACKs visible in the animation
- [ ] Pause timer allows enough time for entire sequence
- [ ] No state conflicts between modes
- [ ] Messages appear in correct order
- [ ] Animation completes cleanly
