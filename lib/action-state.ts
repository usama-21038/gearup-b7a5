export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string>;
};

export const IDLE_STATE: ActionState = { status: "idle" };
