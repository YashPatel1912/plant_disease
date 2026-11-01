import { BarChart3, Camera, Gauge, Layers, Sparkles, Upload } from 'lucide-react';
import './Features.css';

const STEPS = [
  {
    icon: Upload,
    title: 'Upload a leaf photo',
    description: 'Drag and drop a JPG, JPEG, or PNG image of the plant leaf, or browse your device.',
  },
  {
    icon: Sparkles,
    title: 'Run the AI analysis',
    description: 'The trained convolutional neural network preprocesses the image and scores every disease class.',
  },
  {
    icon: BarChart3,
    title: 'Review the diagnosis',
    description: 'See the predicted disease, its confidence level, and whether the plant is healthy or diseased.',
  },
];

const FEATURES = [
  {
    icon: Camera,
    title: 'Works with everyday photos',
    description: 'No special equipment needed. A clear phone photo of a single leaf is enough to get started.',
  },
  {
    icon: Gauge,
    title: 'Confidence at a glance',
    description: 'Every result includes a confidence percentage so you know how strongly the model backs its call.',
  },
  {
    icon: Layers,
    title: 'Built on a trained model',
    description: 'Predictions come from your own deep learning model, served through a dedicated prediction API.',
  },
];

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        <header className="features__header">
          <span className="features__eyebrow">How it works</span>
          <h2 className="features__title">From a single leaf photo to a clear diagnosis</h2>
          <p className="features__subtitle">
            Three simple steps turn a photo into an actionable plant health report.
          </p>
        </header>

        <ol className="features__steps">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="step-card">
              <span className="step-card__number">0{index + 1}</span>
              <span className="step-card__icon">
                <Icon size={22} />
              </span>
              <h3 className="step-card__title">{title}</h3>
              <p className="step-card__description">{description}</p>
            </li>
          ))}
        </ol>

        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article key={title} className="feature-card">
              <span className="feature-card__icon">
                <Icon size={22} />
              </span>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__description">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
