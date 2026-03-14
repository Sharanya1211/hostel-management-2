import { useState, useEffect, useCallback } from "react";
import { hostelAPI } from "../api/axios";

export const useHostels = (autoLoad = true) => {
  const [hostels,  setHostels]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await hostelAPI.getAll(params);
      setHostels(data.hostels);
    } catch (err) {
      setError(err.message || "Failed to load hostels");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNearby = useCallback(async ({ lat, lng, radius = 5, type }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await hostelAPI.getNearby({ lat, lng, radius, type });
      setHostels(data.hostels);
    } catch (err) {
      setError(err.message || "Failed to fetch nearby hostels");
    } finally {
      setLoading(false);
    }
  }, []);

  const detectAndFetchNearby = useCallback(async (params = {}) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        await fetchNearby({ lat, lng, ...params });
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, [fetchNearby]);

  useEffect(() => {
    if (autoLoad) fetchAll();
  }, [autoLoad, fetchAll]);

  return { hostels, loading, error, fetchAll, fetchNearby, detectAndFetchNearby };
};