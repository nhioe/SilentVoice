import './App.css';
import { useQuery } from "convex/react";
import { api } from "./convex/_generated/api";

function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {JSON.stringify(tasks, null, 2)}
    </div>
  );
}

export default App;
