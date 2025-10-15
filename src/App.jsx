import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import AtualizarDados from "./pages/AtualizarDados";
import PlanejamentoMissao from "./pages/PlanejamentoMissao";
import Relatorio from "./pages/Relatorio";
import Footer from "./pages/Footer";

function App() {
    return (
        <Router>
            <div className="app-container" style={{ display: "flex", paddingBottom: 40 }}>
                <Sidebar />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/materiais" element={<Dashboard />} />
                        <Route path="/atualizar-dados" element={<AtualizarDados />} />
                        <Route path="/planejamento-missao" element={<PlanejamentoMissao />} />
                        <Route path="/relatorio" element={<Relatorio />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
