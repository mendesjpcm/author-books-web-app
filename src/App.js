import React, { Component } from 'react';
import './App.css';
import SideBarComponent from './components/SideBar.jsx';
import { ToastContainer } from 'react-toastify';

class App extends Component {
  render() {
    return (
      <div className="App">
        
        <SideBarComponent />
      </div>
    );
  }
}

export default App;
