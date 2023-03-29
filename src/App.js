import './App.css';
import ImageGallery from './components/ImageGallery';
import Navbar from './components/Navbar'
import Network from './components/Network';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('Peter Quinn1')

  return (
    <div className="App">
      <Navbar username={username} setUsername={setUsername} />
      {username &&
        <div>
          <ImageGallery username={username} />
          <Network username={username}/> 
        </div>
      }
    </div>
  );
}

export default App;
