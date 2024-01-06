import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './components/search';
import Header from './components/header';
import Footer from './components/footer';
import SingleCertificate from './components/singleCertificate';
import NotFound from './components/notFound';

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/:id" element={<SingleCertificate />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
