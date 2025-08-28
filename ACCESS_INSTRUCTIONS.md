# Video Chat Application Access Instructions

## For External Devices

Your Laravel React video chat application is now accessible from other devices using the following URL:

**Public Access URL:** https://1dcfc8c58086.ngrok-free.app

## How to Use:

1. **On another device** (phone, tablet, or another computer):
   - Open a web browser
   - Navigate to: https://1dcfc8c58086.ngrok-free.app
   - The video chat application should load

2. **For video calls**:
   - Make sure both devices have camera and microphone permissions enabled
   - The WebSocket connections for real-time communication should work through ngrok

## Current Setup:

- **Vite Development Server**: Running on port 5173
- **Ngrok Tunnel**: Forwarding traffic from https://1dcfc8c58086.ngrok-free.app to localhost:5173
- **Network Access**: Application is accessible on local network at http://192.168.1.112:5173/

## Notes:

- The ngrok URL may change if you restart ngrok
- For persistent access, consider upgrading to a paid ngrok plan with fixed domains
- WebSocket connections for video calls should work through the tunnel

## Troubleshooting:

If video calls don't work:
1. Check that both devices have camera/microphone permissions
2. Ensure WebSocket connections are properly configured
3. Verify that the Reverb server is running for WebSocket support
