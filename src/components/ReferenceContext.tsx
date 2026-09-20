import { createContext, useContext } from "react";
import type { ReferenceId } from "./ReferenceLibrary";

const ReferenceContext = createContext<(reference?: ReferenceId) => void>(() => undefined);

export const ReferenceProvider = ReferenceContext.Provider;

// eslint-disable-next-line react-refresh/only-export-components
export function useReferences() {
  return useContext(ReferenceContext);
}
