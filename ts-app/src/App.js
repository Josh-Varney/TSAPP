import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import InitialiseScreen from './components/form/Initialise';
import CreateAccountScreen from './components/form/Create';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialiseScreen />} />
        <Route path="/register" element={<CreateAccountScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
