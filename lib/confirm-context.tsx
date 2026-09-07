"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertCircleIcon } from "@/components/icons";

interface ConfirmOptions {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  icon?: ReactNode;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  const close = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && close(false)}>
          <div className="modal-box">
            <div
              className="modal-icon"
              style={{
                background: state.options.tone === "danger" ? "var(--color-error-tint)" : "var(--color-primary-tint)",
                color: state.options.tone === "danger" ? "var(--color-error)" : "var(--color-primary)",
              }}
            >
              {state.options.icon || <AlertCircleIcon />}
            </div>
            <h3 className="text-h3">{state.options.title}</h3>
            <p className="text-small" style={{ marginTop: 8 }}>
              {state.options.body}
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline btn-block" onClick={() => close(false)}>
                {state.options.cancelLabel || "Cancel"}
              </button>
              <button
                className={`btn btn-block ${state.options.tone === "danger" ? "btn-destructive-solid" : "btn-primary"}`}
                onClick={() => close(true)}
              >
                {state.options.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
