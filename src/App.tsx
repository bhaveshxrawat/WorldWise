import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesContextProvider } from "./context/CitiesContext";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";

const Homepage = lazy(() => import("./pages/Homepage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Product = lazy(() => import("./pages/Product"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

function App() {
  return (
    <AuthContextProvider>
      <CitiesContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<SpinnerFullPage />}>
                  <Homepage />
                </Suspense>
              }
            />
            <Route
              path="product"
              element={
                <Suspense fallback={<SpinnerFullPage />}>
                  <Product />
                </Suspense>
              }
            />
            <Route
              path="pricing"
              element={
                <Suspense fallback={<SpinnerFullPage />}>
                  <Pricing />
                </Suspense>
              }
            />
            <Route
              path="login"
              element={
                <Suspense fallback={<SpinnerFullPage />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<SpinnerFullPage />}>
                    <AppLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="cities" replace />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route
              path="*"
              element={
                <Suspense fallback={<SpinnerFullPage />}>
                  <PageNotFound />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </CitiesContextProvider>
    </AuthContextProvider>
  );
}

export default App;
