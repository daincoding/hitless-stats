import { useState } from "react";

const Footer = () => {
  const [modalContent, setModalContent] = useState(null); // the useState handles here if the modal is open or closed null = closed

  // Function to open modal
  const openModal = (content) => { // This function updates modalContent with either "imprint" or "privacy".
    setModalContent(content);
  };

  // Function to close modal
  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="w-full text-center py-6 bg-[var(--color-dark)] text-[var(--color-text-muted)] border-t border-[var(--color-primary)] z-20">
      {/* Footer Links */}
      <div className="flex justify-center gap-6">
        <button
          onClick={() => openModal("imprint")}
          className="hover:text-[var(--color-primary)] transition cursor-pointer"
        >
          Imprint
        </button>
        <button
          onClick={() => openModal("privacy")}
          className="hover:text-[var(--color-primary)] transition cursor-pointer"
        >
          Privacy Policy
        </button>
      </div>

      {/* Modal */}
      {modalContent && (
        <div
          id="modal-overlay" // this here makes everything black in the background 
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="bg-[var(--color-dark)] text-[var(--color-text-light)] p-6 rounded-lg shadow-lg w-11/12 max-w-lg border border-[var(--color-primary)]"
          >
            {/* Dynamic Title */}
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
              {modalContent === "imprint" ? "Imprint" : "Privacy Policy"}
            </h2>

            {/* Dynamic Content */}
            <p className="mt-4 text-[var(--color-text-muted)]">
              {modalContent === "imprint"
                ? "This is the imprint section with legal information."
                : "This is the privacy policy section explaining data handling."}
            </p>

            {/* Close Button */}
            <button
              onClick={closeModal} // sets it back to 0
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
