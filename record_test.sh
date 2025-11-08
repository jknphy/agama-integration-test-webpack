#!/bin/sh

# A script to record a headless browser test using Xvfb and ffmpeg.

# Start Xvfb with 24-bit color depth on an unused display (:99)
Xvfb :99 -screen 0 1280x720x24 &
XVFB_PID=$!
echo "Xvfb started with PID $XVFB_PID"

# Start ffmpeg, overwriting the output file if it exists (-y)
# Records the virtual display and saves it to output.mp4
ffmpeg -y -f x11grab -i :99.0 -c:v mpeg4 -r 15 -s 1280x720 -q:v 1 output.mp4 &
FFMPEG_PID=$!
echo "ffmpeg started with PID $FFMPEG_PID"

# Wait a moment for background processes to initialize
sleep 2

# --- RUN YOUR TEST COMMAND HERE ---
# Replace 'sleep 10' with your actual test command (e.g., 'npm test')
echo "Starting test command..."
DISPLAY=:99.0 node --enable-source-maps ./dist/test_default_installation.js -b firefox -u https://192.168.200.155 -p nots3cr3t --accept-license --root-password nots3cr3t --product-id SLES
echo "Test command finished."
# ----------------------------------

# Stop the specific processes using their PIDs
echo "Stopping ffmpeg (PID: $FFMPEG_PID) and Xvfb (PID: $XVFB_PID)..."
kill $FFMPEG_PID
kill $XVFB_PID

echo "Script finished. Video saved to output.mp4"
