import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran';
import Athkar from './pages/Athkar';
import Tasbih from './pages/Tasbih';
import Khatam from './pages/Khatam';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/athkar" element={<Athkar />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/khatam" element={<Khatam />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
