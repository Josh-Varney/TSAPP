import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import InitialiseScreen from './components/form/Initialise';


function App() {
  return (
    <div>
      <InitialiseScreen />
      <Router>
        <Routes>
          <Route path="/" element={<InitialiseScreen />} />
          <Route path="/register" element={<CreateAccountScreen />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
