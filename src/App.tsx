import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import CreateDeckPage from './CreateDeckPage';
import AddCardPage from './AddCardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-deck" element={<CreateDeckPage />} />
        <Route path="/add-card/:deck_id" element={<AddCardPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
