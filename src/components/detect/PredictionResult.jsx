import { CheckCircle2, AlertTriangle, RotateCcw, ShieldCheck, ShieldAlert, HelpCircle } from 'lucide-react';
import './PredictionResult.css';

function formatClassName(label) {
  return label.replace(/___/g, ' - ').replace(/_/g, ' ');
}

const STATUS_CONFIG = {
  Healthy: { icon: ShieldCheck, className: 'result__status--healthy', summary: 'The leaf shows no signs of disease.' },
  Diseased: { icon: ShieldAlert, className: 'result__status--diseased', summary: 'The leaf shows signs of disease.' },
  Unknown: { icon: HelpCircle, className: 'result__status--unknown', summary: 'Health status is unavailable for this model output.' },
};

export default function PredictionResult({ result, previewUrl, onReset }) {
  const statusConfig = STATUS_CONFIG[result.status] ?? STATUS_CONFIG.Unknown;
  const StatusIcon = statusConfig.icon;
  const confidence = Math.min(Math.max(result.confidence, 0), 100);

  return (
    <div className="result">
      <div className="result__header">
        <span className="result__badge">
          <CheckCircle2 size={16} />
          Analysis complete
        </span>
      </div>

      <div className="result__body">
        <div className="result__image-frame">
          <img src={previewUrl} alt="Analyzed plant leaf" className="result__image" />
        </div>

        <div className="result__details">
          <span className={`result__status ${statusConfig.className}`}>
            <StatusIcon size={18} />
            {result.status}
          </span>

          <p className="result__label">Predicted condition</p>
          <h3 className="result__disease">{formatClassName(result.prediction)}</h3>
          <p className="result__summary">{statusConfig.summary}</p>

          <div className="result__confidence">
            <div className="result__confidence-row">
              <span>Confidence</span>
              <strong>{confidence.toFixed(2)}%</strong>
            </div>
            <div className="result__meter" role="progressbar" aria-valuenow={confidence} aria-valuemin={0} aria-valuemax={100}>
              <span className="result__meter-fill" style={{ width: `${confidence}%` }} />
            </div>
          </div>

          {!result.labels_configured && (
            <p className="result__notice">
              <AlertTriangle size={16} />
              The model's class names are not configured yet, so this shows the raw class number.
            </p>
          )}

          <button type="button" className="btn btn-ghost result__reset" onClick={onReset}>
            <RotateCcw size={16} />
            Analyze another image
          </button>
        </div>
      </div>
    </div>
  );
}
