import { useState, useEffect } from 'react';
import axios from 'axios';

const RoomSelector = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  return (
    <div className="room-selector">
      <h3>Available Rooms</h3>
      
      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p>No active rooms found. Create a new one!</p>
      ) : (
        <ul className="room-list">
          {rooms.map((room, index) => (
            <li key={index} className="room-item" onClick={() => onRoomSelect(room)}>
              {room}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomSelector;