import { ReactNode } from "react";

export type AuthGuardProps = {
  children: ReactNode;
  requireRole?: "admin" | "student";
}