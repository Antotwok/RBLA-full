import React, { lazy, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isLoggedIn } from './services/userapi/authservice';

import { UserProvider } from "./Context/UserContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import MyOrders from './pages/User/Orders/MyOrders/MyOrders';
import OrderDetails from './pages/User/Orders/OrderDetails/OrderDetails';
import OrderTracking from './pages/User/Orders/OrderTracking/OrderTracking';
import './App.css';





// Set default Axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Lazy load components
//admin module (the admin module has not modularized yet )
const UserLogin = lazy(() => import('./pages/UserLogin'));
const AdminLogin = lazy(() => import('./pages/admin/adminlogin'));
const AdminDashboard = lazy(() => import('./pages/admin/admindashboard'));
const EditProduct = lazy(() => import('./pages/admin/products/EditProduct'));
const ProductDetails = lazy(() => import('./pages/Product/ProductDetails/ProductDetails'));
const WishlistPage = lazy(() => import('./pages/User/Wishlist/WishlistPage'));
const ReviewPage = lazy(() => import('./pages/User/Reviews/ReviewPage'));

// Lazy load groups of related components
const ProductPages = {
  Towels: lazy(() => import('./pages/Towels')),
  Bags: lazy(() => import('./pages/Bags')),
  Napkins: lazy(() => import('./pages/Napkins')),
  Bedsheets: lazy(() => import('./pages/Bedsheets')),
  Cupcoaster: lazy(() => import('./pages/Cupcoaster')),
  
  Bamboo: lazy(() => import('./pages/Bamboo')),
  Paperfiles: lazy(() => import('./pages/Paperfiles')),
  CustProduct: lazy(() => import('./pages/custproduct')),
};

const workpage ={
  Block: lazy(()=>import('./pages/block')),
  Tailoring: lazy(()=>import('./pages/tailoring')),
  Handmade: lazy(()=>import('./pages/handmade')),
  Whyvarnam:lazy(()=>import('./pages/whyvarnam')),
}

// the userpages are loaded here with the lazy load 
const UserPages = {
  Wishlist: lazy(() => import('./pages/Wishlist')),
  LoginSignup: lazy(() => import('./pages/User/Auth/LoginSignup')),
  Profile: lazy(() => import('./pages/User/Profile/Profile')),
  Cart: lazy(() => import('./pages/User/Cart/Cart')),
  Checkout: lazy(() => import('./pages/User/Checkout/Checkout')),
  Payment: lazy(() => import('./pages/User/Checkout/PaymentPage')),
  PlaceOrder: lazy(() => import('./pages/User/Checkout/PlaceOrder'))
};
// superadmin module 
const SuperAdminPages = {
  Login: lazy(() => import('./pages/superadmin/superadminlogin')),
  Dashboard: lazy(() => import('./pages/superadmin/superadmindashboard')),
  Workers: lazy(() => import('./pages/superadmin/workers')),
  CustomerManager: lazy(() => import('./pages/superadmin/customermanager')),
  AdminRegistration: lazy(() => import('./pages/superadmin/adminregistration')),
};
// maybe removed later 
const CheckoutPages = {
  CustomDesignPage: lazy(() => import('./pages/CustomDesignPage')),
  UploadDesignAndCheckout: lazy(() => import('./pages/UploadDesignAndCheckout')),
};
// common webpages 
const InfoPages = {
  AboutPage: lazy(() => import('./pages/AboutPage')),
  ContactUs: lazy(() => import('./pages/ContactUs')),
  Gallery: lazy(() => import('./pages/Gallery')),
  Vaagai: lazy(() => import('./pages/vaagai')),
  Varnam: lazy(() => import('./pages/varnam')),
  Siragugal: lazy(() => import('./pages/siragugal')),

  
};

// Loading component
const LoadingFallback = () => <div className="loading">Loading...</div>;

// Wrapper for routes that should show header and footer
const MainLayout = ({ children }) => (
  <div className="app-container">
    <Header />
    <main className="main-content">
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
);

// Wrapper for standalone pages (no header/footer)
const StandalonePage = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/loginsignup" />;
  }
  return children;
};

const App = () => {
  // Function to create routes from a group of components
  const createRoutes = (components, pathPrefix = '') => {
    return Object.entries(components).map(([name, Component]) => (
      <Route 
        key={`${pathPrefix}/${name.toLowerCase()}`}
        path={`${pathPrefix}/${name.toLowerCase()}`} 
        element={<MainLayout><Component /></MainLayout>} 
      />
    ));
  };

  return (
    <UserProvider>
      <Router>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Standalone Routes (no header/footer) */}
              <Route 
                path="/loginsignup" 
                element={
                  <StandalonePage>
                    <UserPages.LoginSignup />
                  </StandalonePage>
                } 
              />
              <Route path="/UserLogin" element={<StandalonePage><UserLogin /></StandalonePage>} />
              <Route path="/admin/login" element={<StandalonePage><AdminLogin /></StandalonePage>} />
              <Route path="/superadmin/login" element={<StandalonePage><SuperAdminPages.Login /></StandalonePage>} />

              {/* Admin Dashboard route - without Layout */}
              <Route path="/admin/dashboard" element={<StandalonePage><AdminDashboard /></StandalonePage>} />
              <Route path="/admin/products/edit/:id" element={<StandalonePage><EditProduct /></StandalonePage>} />

              {/* Superadmin Dashboard route - without Layout */}
              <Route path="/superadmin/dashboard" element={<StandalonePage><SuperAdminPages.Dashboard /></StandalonePage>} />

              {/* Routes with Header and Footer */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                }
              />

              {/* Protected Cart and Checkout Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserPages.Cart />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserPages.Checkout />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/payment"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserPages.Payment />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/placeorder"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserPages.PlaceOrder />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Wishlist Route */}
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Suspense fallback={<LoadingFallback />}>
                        <WishlistPage />
                      </Suspense>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Product Details Route */}
              <Route
                path="/product/:id"
                element={
                  <MainLayout>
                    <ProductDetails />
                  </MainLayout>
                }
              />

              {/* Order Routes */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MyOrders />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <OrderDetails />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId/track"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <OrderTracking />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Review Page Route */}
              <Route
                path="/review/:productId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReviewPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Generate routes from component groups */}
              {createRoutes(UserPages, '')}
              {createRoutes(ProductPages, '')}
              {createRoutes(workpage,'')}
              {createRoutes(CheckoutPages, '')}
              {createRoutes(InfoPages, '')}
              
              {/* Special paths and custom routes */}
              <Route path="/superadmin/workers" element={<StandalonePage><SuperAdminPages.Workers /></StandalonePage>} />
              <Route path="/superadmin/customers" element={<StandalonePage><SuperAdminPages.CustomerManager /></StandalonePage>} />
              <Route path="/superadmin/admins" element={<StandalonePage><div>Admins Page</div></StandalonePage>} />
              <Route path="/superadmin/products" element={<StandalonePage><div>Products Page</div></StandalonePage>} />
              <Route path="/superadmin/units" element={<StandalonePage><div>Units Page</div></StandalonePage>} />
              <Route path="/superadmin/adminregistration" element={<StandalonePage><SuperAdminPages.AdminRegistration /></StandalonePage>} />
            </Routes>
            
          </WishlistProvider>
        </CartProvider>
      </Router>
      <ToastContainer />
    </UserProvider>
  );
};

export default App;
