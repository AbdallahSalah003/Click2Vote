import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WelcomePage } from  './pages/welcome'
import { CreatePollPage } from './pages/create-poll';
import { JoinPollPage } from './pages/join-poll';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/create" element={<CreatePollPage />} />
        <Route path="/join" element={<JoinPollPage />} />
      </Routes>
    </Router>
  );
}
export default App;