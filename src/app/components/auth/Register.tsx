import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Logo from "../../../assets/Logo.svg";


export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration - in production this would create account
    navigate("/events");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] relative overflow-hidden">
      {/* Festive Geometric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-32 right-20 w-32 h-32 border border-rose-500/20 rotate-12" />
          <div className="absolute bottom-32 left-32 w-24 h-24 border border-indigo-500/20 -rotate-12" />
          <div className="absolute top-1/3 left-40 w-20 h-20 rounded-full border border-rose-500/30" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-4 relative z-10 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Start managing events like a pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#6366F1] hover:bg-[#6366F1]/90">
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              onClick={() => navigate("/")}
              className="text-[#6366F1] hover:underline"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
