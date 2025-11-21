'use client';

import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<'VALID' | 'INVALID' | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  useEffect(() => {
    // Initialize scanner when isScanning becomes true
    if (isScanning && !html5QrCode) {
      initializeScanner();
    }
  }, [isScanning]);

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (html5QrCode && isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [html5QrCode, isScanning]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple hardcoded authentication for demo
    if (username === 'Scaning@admin.com' && password === 'ScanAdmin123@!#') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setScanResult(null);
    setScanStatus(null);
    setCameraError('');
    if (isScanning) {
      stopScanner();
    }
  };

  const startScanner = () => {
    setCameraError('');
    setScanResult(null);
    setScanStatus(null);
    setIsScanning(true);
  };

  const initializeScanner = async () => {
    try {
      // If there's an existing scanner, stop it first
      if (html5QrCode) {
        try {
          await html5QrCode.stop();
          await html5QrCode.clear();
        } catch (e) {
          console.log('No active scanner to stop');
        }
      }

      const qrCodeScanner = new Html5Qrcode('qr-reader');
      setHtml5QrCode(qrCodeScanner);

      await qrCodeScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Handle successful scan
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Scanning errors are normal, ignore them
        }
      );
    } catch (err: any) {
      console.error('Error starting scanner:', err);

      let errorMessage = 'Failed to start camera. ';

      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings and try again.';
      } else if (err.name === 'NotFoundError' || err.message?.includes('NotFoundError')) {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotReadableError' || err.message?.includes('NotReadableError')) {
        errorMessage += 'Camera is already in use by another application. Please close other apps using the camera and try again.';
      } else if (err.message?.includes('secure')) {
        errorMessage += 'Camera access requires HTTPS. Please use a secure connection.';
      } else {
        errorMessage += 'Please ensure camera permissions are granted and try again.';
      }

      setCameraError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCode) {
      try {
        await html5QrCode.stop();
        await html5QrCode.clear();
        setIsScanning(false);
        setHtml5QrCode(null);
      } catch (err) {
        console.error('Error stopping scanner:', err);
        setIsScanning(false);
      }
    }
  };

  const handleScan = (decodedText: string) => {
    // Check if this QR code has been scanned before
    const scannedCodes = JSON.parse(localStorage.getItem('scannedQRCodes') || '[]');

    if (scannedCodes.includes(decodedText)) {
      // Already scanned - INVALID
      setScanStatus('INVALID');
    } else {
      // First time scanning - VALID
      scannedCodes.push(decodedText);
      localStorage.setItem('scannedQRCodes', JSON.stringify(scannedCodes));
      setScanStatus('VALID');
    }

    setScanResult(decodedText);

    // Stop scanner after successful scan
    stopScanner();
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="login-box">
          <h1>QR Scanner Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <div className="error-message">{loginError}</div>}
            <button type="submit" className="btn btn-primary">Login</button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="scanner-box">
        <div className="header">
          <h1>QR Code Scanner</h1>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>

        {!isScanning && (
          <button onClick={startScanner} className="btn btn-primary btn-large">
            Scan QR Code
          </button>
        )}

        {cameraError && (
          <div className="error-message">
            {cameraError}
          </div>
        )}

        {isScanning && (
          <div className="scanner-container">
            <div id="qr-reader"></div>
            <button onClick={stopScanner} className="btn btn-danger">
              Stop Scanner
            </button>
          </div>
        )}

        {scanResult && scanStatus && (
          <div className={`result-box ${scanStatus.toLowerCase()}`}>
            <h2 className={`status-${scanStatus.toLowerCase()}`}>{scanStatus}</h2>
            <p><strong>QR Code:</strong> {scanResult}</p>
            {scanStatus === 'INVALID' && (
              <p className="warning">This QR code has already been scanned.</p>
            )}
          </div>
        )}

        {!isScanning && !scanResult && (
          <div className="info-box">
            <p>Click the button above to start scanning QR codes.</p>

          </div>
        )}
      </div>
    </div>
  );
}
