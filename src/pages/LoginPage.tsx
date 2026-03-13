import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const demoEmail = 'demo@pikachuai.edu';
  const demoPassword = 'demo123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    navigate('/');
  };

  const handleDemoLogin = async () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    await login(demoEmail);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-primary">
            <img
              src="/logo.png"
              alt="Pikachu AI logo"
              className="h-14 w-14 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <p className="font-bold text-3xl tracking-tight">Pikachu AI</p>
              <p className="text-sm text-muted-foreground">Academic resource platform</p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Use the demo account below to explore the platform instantly.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <p className="text-sm font-semibold">Demo account</p>
            <p className="text-sm text-muted-foreground">Email: {demoEmail}</p>
            <p className="text-sm text-muted-foreground">Password: {demoPassword}</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-secondary text-foreground py-2.5 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Continue with Demo Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary transition-all"
                  placeholder={demoEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter any password or use the demo login"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Log In <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Demo mode is enabled for this project, so no Google account is required.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="bg-secondary rounded-[40px] p-12 aspect-square flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32" />
            <div className="w-48 h-48 bg-card rounded-3xl shadow-2xl flex items-center justify-center relative z-10">
              <BookOpen size={80} className="text-primary" />
            </div>
            <div className="space-y-2 relative z-10">
              <h2 className="text-2xl font-bold">Smart Academic Hub</h2>
              <p className="text-muted-foreground">
                All your university resources, powered by AI, in one clean platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
