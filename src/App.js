import React, { useEffect } from 'react'
import logo from './logo.svg';
import './App.css';
const { ipcRenderer } = window.require('electron');

function App() {

  useEffect(() => {
    ipcRenderer.on('getAWSCreds-reply', (event, arg) => {
      console.log(arg)
    })
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => {
          ipcRenderer.send('getAWSCreds')
        }}>Test</button>
      </header>
    </div>
  );
}

export default App;
