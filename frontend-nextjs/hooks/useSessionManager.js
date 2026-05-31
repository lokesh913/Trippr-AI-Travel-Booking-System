"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "ai-travel-crew-sessions";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createDefaultSession(index = 1) {
  return {
    id: generateId(),
    name: `Session ${index}`,
    query: "",
    threadId: `travel_${generateId()}`,
    results: null,
    createdAt: new Date().toISOString(),
  };
}

function loadSessions() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.sessions && parsed.sessions.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Corrupted storage
  }
  return null;
}

function saveSessions(sessions, activeId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessions, activeSessionId: activeId })
    );
  } catch {
    // Storage full or unavailable
  }
}

export function useSessionManager() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const stored = loadSessions();
    if (stored) {
      setSessions(stored.sessions);
      setActiveSessionId(stored.activeSessionId);
    } else {
      const first = createDefaultSession(1);
      setSessions([first]);
      setActiveSessionId(first.id);
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      saveSessions(sessions, activeSessionId);
    }
  }, [sessions, activeSessionId, isInitialized]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  const createSession = useCallback(() => {
    const newSession = createDefaultSession(sessions.length + 1);
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, [sessions.length]);

  const switchSession = useCallback((id) => {
    setActiveSessionId(id);
  }, []);

  const deleteSession = useCallback(
    (id) => {
      setSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        if (filtered.length === 0) {
          const fresh = createDefaultSession(1);
          setActiveSessionId(fresh.id);
          return [fresh];
        }
        if (activeSessionId === id) {
          setActiveSessionId(filtered[0].id);
        }
        return filtered;
      });
    },
    [activeSessionId]
  );

  const updateSession = useCallback((id, data) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }, []);

  return {
    sessions,
    activeSession,
    activeSessionId,
    isInitialized,
    createSession,
    switchSession,
    deleteSession,
    updateSession,
  };
}
