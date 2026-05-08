import { useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { Share2 } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SharePopover = ({ isOpen, onClose, title, url }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappShare = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

  const handleInstagramClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied. Paste it on Instagram bio/story/message.");
    } catch (error) {
      toast.error("Unable to copy link");
    }
  };

  return (
    <div className="share-popover" ref={popoverRef}>
      <div className="share-popover-header">
        <Share2 size={20} />
        <h3>Share This</h3>
      </div>

      <div className="share-popover-qr">
        <div className="share-popover-qr-box">
          <QRCode value={url} size={160} />
        </div>
      </div>

      <p className="share-popover-text">
        Scan the QR code or use the links below to share.
      </p>

      <div className="share-social-row">
        <a
          href={facebookShare}
          target="_blank"
          rel="noreferrer"
          className="share-social-btn"
          title="Share on Facebook"
        >
          <FaFacebookF />
        </a>

        <a
          href={twitterShare}
          target="_blank"
          rel="noreferrer"
          className="share-social-btn"
          title="Share on X"
        >
          <FaXTwitter />
        </a>

        <a
          href={whatsappShare}
          target="_blank"
          rel="noreferrer"
          className="share-social-btn"
          title="Share on WhatsApp"
        >
          <FaWhatsapp />
        </a>

        <button
          type="button"
          className="share-social-btn"
          title="Copy link for Instagram"
          onClick={handleInstagramClick}
        >
          <FaInstagram />
        </button>
      </div>
    </div>
  );
};

export default SharePopover;
