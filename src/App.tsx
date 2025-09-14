import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TechhBlogs from "@/pages/TechhBlogs";
import MyExperiencePage from "@/pages/myExperience";
import GetInTouchPage from "@/pages/getinTouch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
  <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/techhBlogs" element={<TechhBlogs />} />
          <Route path="/myExperience" element={<MyExperiencePage />} />
          <Route path="/getinTouch" element={<GetInTouchPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
