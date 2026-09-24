"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * false during SSR and the hydrating render, true afterwards. Use it to gate
 * client-only decisions (reduced motion, theme) so the first client render
 * matches the server HTML.
 */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
