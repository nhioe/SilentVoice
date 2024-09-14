import './App.css';
import { useQuery } from "convex/react";
import { api } from "./convex/_generated/api";
import VideoUploader from './VideoUploader';
import VideoTest from './VideoTest';
import VideoCapture from './VideoCapture';
import { useEffect, useState } from 'react';

function App() {
  const tasks = useQuery(api.tasks.get);
  const [balls, setBalls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBalls() {
      try {
        const response = await fetch('http://localhost:8000/api/balls');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data:', data);
        setBalls(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error);
      }
    }

    fetchBalls();
  }, []);

  return (
    <div className="App">
      <h2>Tasks</h2>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
      <h2>Balls</h2>
      {error && <div>Error: {error.message}</div>}
      <pre>{JSON.stringify(balls, null, 2)}</pre>
      <h1>Video Upload Page</h1>
      <VideoCapture/>
    </div>
  );
}

export default App;
