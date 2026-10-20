# jamzzz

Jam Mobile Companion – AI Growth Assistant mobile app built with Expo SDK 58, React Native, and TypeScript.

## Highlights
- **Design Language**: 2000s retro Mac OS X Aqua / iChat luminous gel pill buttons & iOS SMS-style dialogue bubbles.
- **Typography**: Complete Poppins font suite with strict typography hierarchy.
- **Features**:
  - Full-screen sliding drawer navigation with dynamic island / notch safe area handling.
  - Interactive AI Growth prompt cards with color-picked silver retro buttons.
  - 3D Aqua action buttons with triple gloss domes and bottom turquoise iridescent reflection.
  - Seamless floating capsule chat input with messages scrolling underneath.
  - Streamed AI conversational workflow for B2B ICP lead discovery and outbound campaigns.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Expo Go or iOS Simulator / Android Emulator

### Installation
```bash
npm install
```

### Environment Configuration (Gemini API)
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_GEMINI_MODEL=gemini-2.5-flash
```
> **Note**: If no API key is provided, the app will seamlessly fall back to realistic demo data so you can test all workflows offline.

### Running the App
```bash
npx expo start
```
