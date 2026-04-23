import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FlashProvider, useFlash } from "./context/FlashContext";
import { AuthProvider } from "./context/AuthContext";
import { TaxProvider } from "./context/TaxContext";
import FlashMessage from "./components/FlashMessage";
import ListingsIndex from "./pages/ListingsIndex";
import ListingShow from "./pages/ListingShow";
import ListingNew from "./pages/ListingNew";
import ListingEdit from "./pages/ListingEdit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ErrorPage from "./pages/ErrorPage";

function AppRoutes() {
    const { addFlash } = useFlash();

    return (
        <AuthProvider onFlash={addFlash}>
            <FlashMessage />
            <Routes>
                <Route path="/" element={<Navigate to="/listings" replace />} />
                <Route path="/listings" element={<ListingsIndex />} />
                <Route path="/listings/new" element={<ListingNew />} />
                <Route path="/listings/search" element={<ListingsIndex />} />
                <Route path="/listings/:id" element={<ListingShow />} />
                <Route path="/listings/:id/edit" element={<ListingEdit />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default function App() {
    return (
        <FlashProvider>
            <TaxProvider>
                <AppRoutes />
            </TaxProvider>
        </FlashProvider>
    );
}
