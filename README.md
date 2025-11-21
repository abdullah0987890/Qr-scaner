# QR Code Scanner App

A Next.js TypeScript single-page application that allows users to scan QR codes and validate them against previously scanned codes using localStorage.

## Features

- **Login System**: Simple authentication (demo credentials: username=`Scaning@admin.com`, password=`ScanAdmin123@!#`)
- **QR Code Scanner**: Camera-based QR code scanning using html5-qrcode library
- **Validation**: Tracks scanned QR codes in localStorage
  - First scan: Shows **VALID** ✅
  - Subsequent scans: Shows **INVALID** ❌
- **Scanner Controls**: Start/Stop scanner with clear visual feedback
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Minimal, functional interface with color-coded results

## Prerequisites

- Node.js (v18 or higher recommended)
- A modern web browser with camera support
- Camera permissions must be granted when prompted

## Installation

1. Navigate to the project directory:
```bash
cd qr-scanner-app
```

2. Install dependencies (if not already installed):
```bash
npm install
```

The project uses:
- `next` - React framework
- `react` & `react-dom` - React libraries
- `html5-qrcode` - QR code scanning library
- `typescript` - Type safety

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. You should see the login page

## Usage

### Step 1: Login
- Enter username: `Scaning@admin.com`
- Enter password: `ScanAdmin123@!#`
- Click "Login"

### Step 2: Scan QR Codes
1. Click the **"Scan QR Code"** button
2. Allow camera permissions when prompted
3. Point your camera at a QR code
4. The scanner will automatically detect and process the QR code
5. Results will be displayed:
   - **VALID** (green) - First time scanning this QR code
   - **INVALID** (red) - QR code has been scanned before

### Step 3: Scanner Controls
- Click **"Stop Scanner"** to close the camera
- Click **"Scan QR Code"** again to scan another code
- Click **"Logout"** to return to the login screen

## How It Works

### localStorage Tracking
- Scanned QR codes are stored in browser localStorage under the key `scannedQRCodes`
- Each unique QR code text is stored as an array item
- Data persists across browser sessions (until cleared)

### Clearing Scanned History
To reset the validation history, open browser console and run:
```javascript
localStorage.removeItem('scannedQRCodes');
```

Or clear all browser data for localhost.

## Browser Compatibility

The app requires:
- Modern browser with camera API support (Chrome, Firefox, Safari, Edge)
- HTTPS or localhost (camera access requires secure context)
- Camera permissions granted

## Project Structure

```
qr-scanner-app/
├── src/
│   └── app/
│       ├── page.tsx          # Main application component
│       ├── globals.css        # Application styles
│       ├── layout.tsx         # Root layout
│       └── favicon.ico
├── package.json
├── tsconfig.json
└── README.md
```

## Building for Production

To create a production build:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted
- Check if another application is using the camera
- Try using HTTPS instead of HTTP (required for camera access on non-localhost)
- Refresh the page and try again

### QR Code Not Detected
- Ensure good lighting conditions
- Hold the QR code steady within the scanner box
- Try moving the QR code closer or further from the camera
- Ensure the QR code is not damaged or distorted

### Scanner Won't Start
- Check browser console for errors
- Verify camera permissions in browser settings
- Try a different browser
- Ensure no other tab/app is using the camera

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **html5-qrcode** - QR code scanning library
- **CSS3** - Styling with gradients and animations

## License

This is a demo application for educational purposes.
