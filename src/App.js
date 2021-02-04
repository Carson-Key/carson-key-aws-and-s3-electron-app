import React from 'react'
import logo from './logo.svg';
import './App.css';
const { ipcRenderer } = window.require('electron');

function App() {
  console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => {
          ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg) // prints "pong"
          })
          ipcRenderer.send('asynchronous-message', 'ping')
        }}>Test</button>
      </header>
    </div>
  );
}

export default App;
