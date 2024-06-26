import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import CreateDeckPage from './CreateDeckPage';
import AddCardPage from './AddCardPage';
import LearningPage from './LearningPage';
import ProfilePage from './ProfilePage';
import StatisticPage from './StatisticPage';
import GameMenu from './GameMenu';
import GamePage from './GamePage';

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
        <Route path="/learn/:deck_id" element={<LearningPage />}/>
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/statistic" element={<StatisticPage />}/>
        <Route path="/gamemenu" element={<GameMenu />}/>
        <Route path="/game/:game_id" element={<GamePage />}/>
      </Routes>
    </Router>
  );
}

export default App;
