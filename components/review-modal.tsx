"use client";

import { useState } from "react";

export function ReviewModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (rating: number, comment: string) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h3 className="text-h3" style={{ marginBottom: 14 }}>
          Leave a review
        </h3>
        <div className="field">
          <label>Rating</label>
          <div style={{ display: "flex", gap: 6, fontSize: 24, color: "var(--color-warning)", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} onClick={() => setRating(n)}>
                {n <= rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Your review</label>
          <textarea placeholder="How was the gear and the rental experience?" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline btn-block" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-block" onClick={() => onSubmit(rating, comment)}>
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
}
