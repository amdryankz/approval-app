import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RequestDetailPage from "./pages/RequestDetailPage";
import CreateRequestPage from "./pages/CreateRequestPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/request/:id" element={<RequestDetailPage />} />
        <Route path="/request/create" element={<CreateRequestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
