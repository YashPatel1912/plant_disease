import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCw, ScanSearch, Sprout, Wifi, WifiOff } from 'lucide-react';
import ImageUploader from '@/components/detect/ImageUploader';
import PredictionResult from '@/components/detect/PredictionResult';
import { checkBackendHealth, getApiErrorMessage, predictPlantDisease } from '@/services/api';
import './DetectionPage.css';

const BACKEND_STATUS = {
  checking: { label: 'Checking server', icon: Loader2, className: 'detect__server--checking' },
  online: { label: 'Model server online', icon: Wifi, className: 'detect__server--online' },
  offline: { label: 'Model server unavailable', icon: WifiOff, className: 'detect__server--offline' },
};

export default function DetectionPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [backendState, setBackendState] = useState('checking');

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    let isCancelled = false;
    checkBackendHealth()
      .then((data) => {
        if (!isCancelled) setBackendState(data?.model_loaded ? 'online' : 'offline');
      })
      .catch(() => {
        if (!isCancelled) setBackendState('offline');
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const resetAnalysis = () => {
    setResult(null);
    setErrorMessage('');
    setStatus('idle');
    setUploadProgress(0);
  };

  const handleSelect = (selectedFile) => {
    setFile(selectedFile);
    resetAnalysis();
  };

  const handleRemove = () => {
    setFile(null);
    resetAnalysis();
  };

  const handlePredict = async () => {
    if (!file) return;

    setStatus('loading');
    setResult(null);
    setErrorMessage('');
    setUploadProgress(0);

    try {
      const data = await predictPlantDisease(file, {
        onUploadProgress: (event) => {
          if (event.total) setUploadProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      setResult(data);
      setStatus('success');
      setBackendState('online');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      setStatus('error');
    }
  };

  const isAnalyzing = status === 'loading';
  const serverStatus = BACKEND_STATUS[backendState];
  const ServerIcon = serverStatus.icon;

  return (
    <section className="detect">
      <div className="container">
        <header className="detect__header">
          <div>
            <span className="detect__eyebrow">
              <Sprout size={16} />
              Disease detection
            </span>
            <h1 className="detect__title">Check your plant in seconds</h1>
            <p className="detect__subtitle">
              Upload a clear, close-up photo of a single leaf. The model will analyze it and report the
              predicted condition.
            </p>
          </div>
          <span className={`detect__server ${serverStatus.className}`}>
            <ServerIcon size={16} className={backendState === 'checking' ? 'spin' : undefined} />
            {serverStatus.label}
          </span>
        </header>

        <div className="detect__grid">
          <div className="detect__panel">
            <div className="detect__panel-heading">
              <h2>1. Upload leaf image</h2>
            </div>
            <ImageUploader
              file={file}
              previewUrl={previewUrl}
              isDisabled={isAnalyzing}
              isAnalyzing={isAnalyzing}
              onSelect={handleSelect}
              onRemove={handleRemove}
            />
            <button
              type="button"
              className="btn btn-primary detect__predict"
              onClick={handlePredict}
              disabled={!file || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Analyzing leaf...
                </>
              ) : (
                <>
                  <ScanSearch size={18} />
                  Predict Disease
                </>
              )}
            </button>
          </div>

          <div className="detect__panel detect__panel--result" aria-live="polite">
            <div className="detect__panel-heading">
              <h2>2. Prediction results</h2>
            </div>

            {status === 'idle' && (
              <div className="detect__empty">
                <span className="detect__empty-icon">
                  <ScanSearch size={32} />
                </span>
                <h3>No prediction yet</h3>
                <p>Your diagnosis, confidence score, and health status will appear here once you run a prediction.</p>
              </div>
            )}

            {status === 'loading' && (
              <div className="detect__loading">
                <div className="detect__orbit" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3>{uploadProgress < 100 ? 'Uploading image...' : 'Analyzing leaf with the CNN model...'}</h3>
                <div className="detect__progress" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${uploadProgress}%` }} />
                </div>
                <p>This usually takes a few seconds.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="detect__error" role="alert">
                <span className="detect__error-icon">
                  <AlertTriangle size={28} />
                </span>
                <h3>Prediction failed</h3>
                <p>{errorMessage}</p>
                <button type="button" className="btn btn-ghost" onClick={handlePredict} disabled={!file}>
                  <RefreshCw size={16} />
                  Try again
                </button>
              </div>
            )}

            {status === 'success' && result && (
              <PredictionResult result={result} previewUrl={previewUrl} onReset={handleRemove} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
