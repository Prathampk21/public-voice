import React from "react";
import { Copy, ExternalLink, Share2, X } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

const ShareQrModal = ({ isOpen, onClose, title, url, typeLabel = "Item" }) => {
  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`${typeLabel} link copied`);
    } catch (error) {
      toast.error("Unable to copy link");
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check this ${typeLabel.toLowerCase()}: ${title}`,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(`${typeLabel} link copied`);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share");
      }
    }
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div
        className="qr-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="qr-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button>

        <h2>{typeLabel} QR Code</h2>
        <p className="qr-modal-title">{title}</p>

        <div className="qr-code-box">
          <div className="qr-code-inner">
            <QRCode value={url} size={220} />
          </div>
        </div>

        <p className="qr-link-text">{url}</p>

        <div className="qr-modal-actions">
          <button
            type="button"
            className="secondary-btn small-btn"
            onClick={handleCopyLink}
          >
            <Copy size={16} />
            Copy Link
          </button>

          <button
            type="button"
            className="secondary-btn small-btn"
            onClick={handleNativeShare}
          >
            <Share2 size={16} />
            Share
          </button>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="primary-btn small-btn"
          >
            <ExternalLink size={16} />
            Open
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareQrModal;
