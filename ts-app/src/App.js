import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import InitialiseScreen from './components/form/Initialise';
import CreateAccountScreen from './components/form/Create';
import HomeScreen from './components/homescreen/home';
import ForgotPasswordScreen from './components/form/Forgot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialiseScreen />} />
        <Route path="/register" element={<CreateAccountScreen />} />
        <Route path='/home' element={<HomeScreen /> } />
        <Route path='/forgot' element={<ForgotPasswordScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
