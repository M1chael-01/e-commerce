//  React core and routing utilities
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

//  Layout and shared UI components
import Header from './Components/Header';
import AutoLogin from './Components/AutoLogin';

//  Route-based page components
import Home from './Components/Home';
import Women from './Components/Shopping/Women';
import Men from './Components/Shopping/Men';
import Kids from './Components/Shopping/Kids';
import New from './Components/Shopping/New';
import Recommend from './Components/Shopping/Recommend';
import Shoes from './Components/Shopping/Shoes';
import Main from './Components/Shopping/Main';
import Cart from './Components/Pays/Cart';
import Show from './Components/ShowPromBox';
import OneProduct from './Components/Shopping/OneProducts';
import Delivery from './Components/Shipping/Delivery';
import Summary from './Components/Pays/Summary';
import Information from './Components/Information';
import SubmitOrder from './Components/Pays/SubmitOrder';
import Discount from './Components/Shopping/Discount';

import ErrorPage from './Components/ErrorPage';

//  Loader screen shown on initial homepage load
const Loader = () => (
  <div className="loader">
    <div className="loader__brand">
      {/* Brand letters displayed with animation */}
      <span>R</span><span>U</span><span>N</span><span>I</span><span>X</span>
    </div>
    <div className="loader__bubbles">
      {/* Render 6 animated bubble elements */}
      {[...Array(6)].map((_, i) => (
        <span key={i} className="loader__bubble" />
      ))}
    </div>
  </div>
);

//  Main routing and logic of the app
const AppContent = () => {
  const location = useLocation(); // Get current route/location object
  const [loading, setLoading] = useState(true); // State to control showing splash loader

  //  Effect to show loader only on initial homepage load, then show promo and hide loader
  useEffect(() => {
    const timer = setTimeout(async () => {
      await Show();       // Trigger promotional popup logic
      setLoading(false);  // Hide loader after delay
    }, 1300);             // Delay duration: 1.3 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  //  Show loader only if loading is true and current route is homepage ('/')
  if (loading && location.pathname === '/') {
    return <Loader />; // Render the splash loader screen
  }

  return (
    <>
      {/*  Auto-login or session restore triggered once at app start */}
      <AutoLogin />

      {/*  Main navigation header shown on all pages */}
      <Header />

      {/* 🗺️ Define all app routes and their components */}
      <Routes>
        {/*  Homepage */}
        <Route path="/" element={<Home />} />

        {/*  Women’s shopping categories with optional category param */}
        <Route path="/zeny">
          <Route index element={<Women />} />
          <Route path=":category" element={<Women />} />
        </Route>

        {/*  Men’s shopping categories with optional category param */}
        <Route path="/muzi">
          <Route index element={<Men />} />
          <Route path=":category" element={<Men />} />
        </Route>

        {/*  Kids’ shopping section */}
        <Route path="/deti" element={<Kids />} />

        {/*  New arrivals with nested category and gender params */}
        <Route path="/nove">
          <Route index element={<New />} />
          <Route path=":category">
            <Route index element={<New />} />
            <Route path=":gender" element={<New />} />
          </Route>
        </Route>

        {/*  Recommended products with optional category */}
        <Route path="/doporucujeme">
          <Route index element={<Recommend />} />
          <Route path=":category" element={<Recommend />} />
        </Route>

        {/*  Shoes section */}
        <Route path="/obuv" element={<Shoes />} />

        {/*  Discounted products */}
        <Route path="/slevy" element={<Discount />} />

        {/*  General shopping with optional category */}
        <Route path="/nakupovat">
          <Route index element={<Main />} />
          <Route path=":category" element={<Main />} />
        </Route>

        {/*  Product detail page by product ID */}
        <Route path="/produkt/:id" element={<OneProduct />} />

        {/*  Error page with a custom message */}
        <Route path="/eror" element={<ErrorPage message="Neočekávaná chyba" />} />

        {/*  Checkout steps */}
        <Route path="/kosik" element={<Cart />} />
        <Route path="/doprava" element={<Delivery />} />
        <Route path="/prehled" element={<Summary />} />
        <Route path="/platba" element={<SubmitOrder />} />

        {/*  Info & help pages with optional slug param */}
        <Route path="/informace" element={<Information />} />
        <Route path="/informace/:slug" element={<Information />} />
      </Routes>
    </>
  );
};

//  Wrap the entire app in a router provider to enable client-side routing/navigation
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
