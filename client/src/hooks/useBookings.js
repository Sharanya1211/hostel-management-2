import { useState, useEffect, useCallback } from "react";
import { bookingAPI } from "../api/axios";

export const useBookings = (autoLoad = true) => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [message,  setMessage]  = useState("");

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await bookingAPI.getAll();
      setBookings(data.bookings);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (payload) => {
    try {
      const { data } = await bookingAPI.create(payload);
      flash(data.message || "Booking successful!");
      await fetchAll();
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message || "Booking failed" };
    }
  }, [fetchAll]);

  const cancelBooking = useCallback(async (id) => {
    try {
      const { data } = await bookingAPI.cancel(id);
      flash("Booking cancelled.");
      await fetchAll();
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message || "Cancellation failed" };
    }
  }, [fetchAll]);

  useEffect(() => {
    if (autoLoad) fetchAll();
  }, [autoLoad, fetchAll]);

  return { bookings, loading, error, message, fetchAll, createBooking, cancelBooking };
};