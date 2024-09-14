import './App.css';
import { useQuery } from "convex/react";
import { api } from "./convex/_generated/api";
import VideoUploader from './VideoUploader';
import LiveFeedStream from './LiveFeedStream';

function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {JSON.stringify(tasks, null, 2)}
      <h1>Video Upload Page</h1>
      <LiveFeedStream />
    </div>
  );
}

export default App;
