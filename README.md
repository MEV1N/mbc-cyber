# MBC Cybersecurity Wing Inauguration

An interactive dummy website created for the inauguration of the Cybersecurity Wing at college. It presents the inauguration as a cinematic cyber-security terminal, with animated authorization screens, synthesized audio, glitch effects, QR imagery, and a staged inauguration reveal.

> **Important:** This is a presentation/demo website. The authorization flow is implemented entirely in the browser and must not be used as real authentication or access control.

## Website Flow

### 1. Landing page

The home route (`/`) displays a restricted-access terminal with an animated character-glitch background.

When the visitor selects **Initiate Access**:

1. A simulated secure-channel authentication begins.
2. Terminal messages appear progressively over approximately three seconds.
3. Audio click effects play through the Web Audio API.
4. A QR image and a link to the inauguration gateway are revealed.

### 2. Inauguration gateway

The `/inaugurate` route contains the authorization form for the ceremony. `/inauguration` remains available as a compatibility alias. The following demo ciphers are accepted:

```text
CYBER-CELL-2026
MBC-2026
INAUGURATE-2026
```

Cipher input is normalized by trimming whitespace and converting to uppercase. Invalid input shows an access-denied message and plays a denial sound. Valid input starts a simulated verification progress bar before the cinematic sequence is shown.

### 3. Cinematic inauguration

After successful authorization on `/inaugurate`, the phone sends a `PLAY_VIDEO` command over WebSocket. The main display at `/` receives the command and plays `public/video.mp4` without navigating or reloading. The main display operator must click **ENABLE CEREMONY** once before the event to satisfy browser autoplay permissions.

| Time | Event |
| --- | --- |
| 0 seconds | Intact QR image appears |
| 1.5 seconds | QR image changes to the torn version and digital particles disperse |
| 3.2 seconds | Security padlock appears |
| 4.7 seconds | Padlock unlocks |
| 6.2 seconds | Protective shield appears |
| 7.7 seconds | Cybersecurity Cell logo is revealed |
| 9.2 seconds | Official inauguration message and status details appear |

## Technology

- Vue 3 with Composition API and `<script setup>`
- TypeScript
- Vite
- Vue Router with history mode
- Tailwind CSS through the Vite plugin
- Lucide Vue icons
- Canvas-based letter glitch and particle effects
- Web Audio API for generated interface sounds
- Google Fonts: Orbitron, Rajdhani, and Share Tech Mono

## Project Structure

```text
src/
  App.vue                         Application shell and router outlet
  main.ts                         Vue application entry point
  style.css                       Global theme, fonts, and reduced-motion rules
  router/index.ts                 Route definitions
  views/
    LandingView.vue               Initial access screen and QR reveal
    InaugurationView.vue           Cipher authorization gateway
  components/
    CinematicInauguration.vue      Existing timed inauguration animation
    LetterGlitch.vue               Animated canvas background
    QRCodeRenderer.vue             QR image display component
  utils/
    cyberAudio.ts                  Web Audio API sound synthesizer
    useWebSocket.ts                 Reconnecting WebSocket client
server/
  websocket.js                     WebSocket broadcast server
public/
  video.mp4                        Inauguration video played on the main display
  assets/
    QR.png                         Initial QR image
    tornqr.png                     Torn QR image used in the animation
```

## Running Locally

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

This runs the TypeScript/Vue type check and then creates the production bundle in `dist/`.

### Preview the production build

```bash
npm run preview
```

## Configuration and Customization

### Change the accepted ciphers

Edit `VALID_CIPHERS` in `src/views/InaugurationView.vue`.

### Change the displayed inauguration URL

The application builds the phone URL from the current browser origin and appends `/inaugurate`.

### Configure WebSocket

Copy `.env.example` to `.env` for local development:

```bash
VITE_WS_URL=ws://localhost:8080
```

For an HTTPS deployment, configure the frontend build with a secure WebSocket URL:

```bash
VITE_WS_URL=wss://your-websocket-server-domain.com
```

The browser uses the development fallback `ws://localhost:8080` only when running Vite in development mode. Production builds require `VITE_WS_URL`; they do not connect to localhost automatically.

### Replace the QR artwork

Replace the following assets while preserving their filenames, or update the imports in `QRCodeRenderer.vue` and `CinematicInauguration.vue`:

- `src/assets/QR.png`
- `src/assets/tornqr.png`

The current QR component displays bundled images. The `value` prop is reserved for future dynamic QR generation and does not currently generate a QR code.

### Change the visual theme

Global colors, fonts, and accessibility motion rules are in `src/style.css`. Most layout and component styling uses Tailwind utility classes directly in the Vue templates.

### Change the ceremony timing

The timed sequence is defined in `startCinematicSequence()` in `src/components/CinematicInauguration.vue`. The current `video.mp4` playback is controlled by the WebSocket `PLAY_VIDEO` message in `src/views/LandingView.vue`.

## WebSocket Development

Install dependencies and start both services:

```bash
npm install
npm run dev:all
```

Alternatively, use two terminals:

```bash
npm run dev
npm run ws
```

Open `http://localhost:5173/` on the main display and click **ENABLE CEREMONY** once. Open `http://localhost:5173/inaugurate` on the phone, enter one of the accepted ciphers, and press **INAUGURATE**. The phone remains on `/inaugurate`; the main display receives `PLAY_VIDEO` and starts the video from the beginning.

## Deployment

The project uses Vue Router history mode. The `public/_redirects` file contains:

```text
/* /index.html 200
```

This rewrite is needed on Netlify-style hosting so that direct requests to `/inaugurate` resolve to the Vue application. Equivalent fallback configuration is required when deploying to another host.

The WebSocket server is a separate persistent Node.js process. Deploy `server/websocket.js` to a WebSocket-capable host, set `WS_PORT` if the host provides a port, and run:

```bash
npm run ws
```

Configure the frontend build environment as follows, then rebuild and deploy the Vite output:

```bash
VITE_WS_URL=wss://your-websocket-server-domain.com
```

Use `wss://` whenever the frontend is served over HTTPS. Do not deploy this server as a serverless function that cannot keep persistent WebSocket connections open.

## Demo and Security Notes

- The accepted ciphers are visible in the client-side JavaScript bundle.
- The progress bar and terminal messages are simulated presentation effects.
- No backend, database, session, or real authorization service is included.
- The main display requires one click on **ENABLE CEREMONY** before remote playback; browser autoplay policies may otherwise reject video with audio.
- The QR display currently uses static image files rather than encoding a URL dynamically.
- The website is intended for a ceremony display, visitor demonstration, or event kiosk.

## License

This project is an internal college event/demo website. Add the institution's preferred license or usage terms before public redistribution.
