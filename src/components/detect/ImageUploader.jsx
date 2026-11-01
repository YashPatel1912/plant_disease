import { useRef, useState } from 'react';
import { AlertCircle, ImagePlus, RefreshCw, UploadCloud, X } from 'lucide-react';
import './ImageUploader.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function validateImageFile(file) {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some((extension) => fileName.endsWith(extension));

  if (!ACCEPTED_TYPES.includes(file.type) || !hasValidExtension) {
    return 'Unsupported file type. Please upload a JPG, JPEG, or PNG image.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `This image is larger than ${MAX_FILE_SIZE_MB} MB. Please choose a smaller file.`;
  }
  return '';
}

export default function ImageUploader({ file, previewUrl, isDisabled, isAnalyzing, onSelect, onRemove }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleFile = (candidate) => {
    if (!candidate) return;
    const error = validateImageFile(candidate);
    setValidationError(error);
    if (!error) {
      onSelect(candidate);
    }
  };

  const openFilePicker = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  };

  const handleRemove = () => {
    setValidationError('');
    onRemove();
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
      className="sr-only"
      onChange={handleInputChange}
      tabIndex={-1}
    />
  );

  if (!file || !previewUrl) {
    return (
      <div className="uploader">
        {input}
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
          className={`uploader__dropzone ${isDragging ? 'uploader__dropzone--active' : ''}`}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span className="uploader__icon">
            <UploadCloud size={36} />
          </span>
          <h3 className="uploader__title">Drag and drop a leaf photo here</h3>
          <p className="uploader__hint">JPG, JPEG, or PNG up to {MAX_FILE_SIZE_MB} MB</p>
          <span className="btn btn-primary uploader__browse">
            <ImagePlus size={18} />
            Browse Image
          </span>
        </div>
        {validationError && (
          <p className="uploader__error" role="alert">
            <AlertCircle size={16} />
            {validationError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="uploader">
      {input}
      <div className={`uploader__preview ${isAnalyzing ? 'uploader__preview--analyzing' : ''}`}>
        <img src={previewUrl} alt={`Preview of ${file.name}`} className="uploader__image" />
        {isAnalyzing && (
          <div className="uploader__scan" aria-hidden="true">
            <span className="uploader__scan-line" />
          </div>
        )}
        <div className="uploader__toolbar">
          <button type="button" className="uploader__chip" onClick={openFilePicker} disabled={isDisabled}>
            <RefreshCw size={16} />
            Replace
          </button>
          <button type="button" className="uploader__chip uploader__chip--danger" onClick={handleRemove} disabled={isDisabled}>
            <X size={16} />
            Remove
          </button>
        </div>
      </div>
      <p className="uploader__filename" title={file.name}>{file.name}</p>
      {validationError && (
        <p className="uploader__error" role="alert">
          <AlertCircle size={16} />
          {validationError}
        </p>
      )}
    </div>
  );
}
