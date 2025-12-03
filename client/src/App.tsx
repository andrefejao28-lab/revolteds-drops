import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Pessoas from "./pages/Pessoas";
import Eventos from "./pages/Eventos";
import Drops from "./pages/Drops";
import Participacao from "./pages/Participacao";
import Distribuicao from "./pages/Distribuicao";
import { Users, Calendar, Gift, Users2, Share2 } from "lucide-react";

function Navigation() {
  const navItems = [
    { href: "/pessoas", label: "Pessoas", icon: Users },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/drops", label: "Drops", icon: Gift },
    { href: "/participacao", label: "Participação", icon: Users2 },
    { href: "/distribuicao", label: "Distribuição", icon: Share2 },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Gift className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">RevolteDs Drops</h1>
          </div>
        </div>

        <div className="flex gap-1 pb-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-900 transition-colors whitespace-nowrap text-sm font-medium"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Pessoas} />
      <Route path={"/pessoas"} component={Pessoas} />
      <Route path={"/eventos"} component={Eventos} />
      <Route path={"/drops"} component={Drops} />
      <Route path={"/participacao"} component={Participacao} />
      <Route path={"/distribuicao"} component={Distribuicao} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <div className="container mx-auto py-8">
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
