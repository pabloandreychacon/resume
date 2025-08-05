import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Checkout from './pages/Checkout';
import FAQ from './pages/FAQ';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import './App.css';

function AppContent() {
  const { state } = useGlobalContext();

  return (
    <div className={`App ${state.darkMode ? 'dark' : 'light'}`}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <PayPalScriptProvider options={{
      clientId: "AcyP_DyBRe1ld98usHQGctGqBqLRavAH5tg2Fu_JLTzR1ylCxsP7Cw4klndZ6xnW_V11koQsdc2AyNHm",
      currency: "USD"
    }}>
      <GlobalProvider>
        <Router>
          <AppContent />
        </Router>
      </GlobalProvider>
    </PayPalScriptProvider>
  );
}

export default App; 