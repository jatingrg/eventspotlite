import React, { createContext, useContext, useEffect, useState } from 'react';

const EventsContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/events'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add event');
      }
  
      const data = await response.json();
      setEvents((prev) => [...prev, data]);
  
      
  
     
  
    } catch (err) {
      setError(err.message);
    }
  };
  

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:3001/events/${id}`, {
        method: 'DELETE',
      });
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <EventsContext.Provider value={{ events, loading, error, addEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

const useEvents = () => {
  return useContext(EventsContext);
};

export { useEvents };
