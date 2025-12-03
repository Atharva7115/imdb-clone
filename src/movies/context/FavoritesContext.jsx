import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../auth/AuthContext";

const STORAGE_KEY = "movie_favorites";
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  // Load favorites from localStorage immediately (fast load)
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // 1️⃣ Load watchlist from Firestore after login
  useEffect(() => {
    if (!user) return; // user logged out → use localStorage only

    const loadCloudWatchlist = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "watchlists", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const cloudList = snap.data().items || [];
          setFavorites(cloudList);

          // sync to local storage too
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudList));
        }
      } catch (err) {
        console.error("Failed to load cloud watchlist:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCloudWatchlist();
  }, [user]);

  // 2️⃣ Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // 3️⃣ Helper to save to Firestore
  const saveToCloud = async (items) => {
    if (!user) return; // Only sync when logged in

    try {
      const ref = doc(db, "watchlists", user.uid);
      await setDoc(ref, { items }, { merge: true });
    } catch (err) {
      console.error("Failed to save watchlist to cloud:", err);
    }
  };

  // 4️⃣ Add/remove favorite movie
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isAdded = prev.some((m) => m.id === movie.id);
      const updated = isAdded
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];

      // Update Firestore too
      saveToCloud(updated);

      return updated;
    });
  };

  // 5️⃣ Check if movie is in favorites
  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        loadingWatchlist: loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
