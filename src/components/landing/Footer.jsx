import { useState } from "react";

const Footer = () => {
  const [modalContent, setModalContent] = useState(null);

  // Open Modal
  const openModal = (content) => {
    setModalContent(content);
  };

  // Close Modal
  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="w-full text-center py-6 bg-[var(--color-dark)] text-[var(--color-text-muted)] border-t border-[var(--color-primary)] z-20">
      {/* ✅ Copyright Text with Twitch Link */}
      <p className="text-sm">
        Copyright 2025{" "}
        <a
          href="https://www.twitch.tv/dain_sounds"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition"
        >
          dain.
        </a>
      </p>

      {/* ✅ Privacy Policy Button (Back Again) */}
      <div className="mt-4">
        <button
          onClick={() => openModal("privacy")}
          className="hover:text-[var(--color-primary)] transition cursor-pointer"
        >
          Privacy Policy
        </button>
      </div>

      {/* ✅ Modal for Privacy Policy */}
      {modalContent === "privacy" && (
        <div
          id="modal-overlay"
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="bg-[var(--color-dark)] text-[var(--color-text-light)] p-6 rounded-lg shadow-lg w-11/12 max-w-lg border border-[var(--color-primary)]"
          >
            {/* ✅ Privacy Policy Title */}
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">Privacy Policy</h2>

            {/* ✅ Privacy Policy Content */}
            <p className="mt-4 text-[var(--color-text-muted)]">
              This website includes embedded Twitch streams. Twitch may collect data such as IP addresses, 
              browser details, and user interactions, even if you do not directly engage with the stream. 
              By using this site, you acknowledge that Twitch may process your data according to their policies.
            </p>

            <p className="mt-2 text-[var(--color-text-muted)]">
              For more details, please review Twitch's Privacy Policy:{" "}
              <a
                href="https://www.twitch.tv/p/legal/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] underline"
              >
                Twitch Privacy Policy
              </a>.
            </p>

            {/* ✅ Close Button */}
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] rounded-lg hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;