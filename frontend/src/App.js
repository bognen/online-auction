import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import Header from './Header'
import Footer from './Footer'
import { UserContext } from './Contexts/UserContext';
import UserContextProvider from './Contexts/UserContextProvider';

import About from './Components/About'
import Auction from './Components/Auction'
import Browse from './Components/Browse'
import Contact from './Components/Contact'
import Home from './Components/Home'
import LoginModal from './Components/LoginModal'
import SubmitAdd from './Components/SubmitAdd'

function App() {

  return (
      <UserContextProvider>
        <div className="App">
          <BrowserRouter>
            <Header />
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auction/:id" element={<Auction />} />
                  <Route path="/submit-add/" element={<SubmitAdd />} />
              </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      </UserContextProvider>
  );
}

export default App;
