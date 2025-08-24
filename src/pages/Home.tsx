import { useState } from 'react';
import { ArrowRight, Play, Sparkles, Search, Brain, FileText, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();
  const { search } = useAppStore();

  const handleLaunchApp = () => {
    navigate('/app');
  };

  const handleSearchFromHome = async (query: string) => {
    await search(query);
    navigate('/app');
  };

  const features = [
    {
      icon: Search,
      title: 'Multi-modal embeddings',
      description: 'Understand text, tables, and diagrams together with unified AI processing.',
    },
    {
      icon: Brain,
      title: 'Semantic ranking',
      description: 'Prioritize what matters using cross-modal signals and contextual relevance.',
    },
    {
      icon: FileText,
      title: 'Summaries with citations',
      description: 'Digest complex docs into clear takeaways with proper source attribution.',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96">
        <div 
          className="w-full h-full opacity-30 animate-gradient-shift"
          style={{
            background: `
              radial-gradient(ellipse 800px 400px at 50% 0%, 
                hsl(var(--primary)/0.15), 
                transparent 50%),
              radial-gradient(ellipse 600px 300px at 80% 20%, 
                hsl(var(--accent)/0.1), 
                transparent 50%)
            `
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading font-bold text-xl">AstraFind</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="focus-ring" disabled>
            Docs
          </Button>
          <Button variant="ghost" size="sm" className="focus-ring" disabled>
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </Button>
          <ThemeToggle />
        </nav>
      </header>

      {/* Main content */}
      <main id="main-content" className="relative z-10 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Hero headline */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-heading text-5xl md:text-7xl font-bold tracking-tight"
            >
              Search{' '}
              <span className="hero-gradient animate-gradient-shift bg-[length:200%_200%]">
                beyond text
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
            >
              One query, unified results—text, tables, figures, and images from the web and your PDFs.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              onClick={handleLaunchApp}
              className="text-lg px-8 py-6 hover-scale glow-effect font-medium"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Launch the Agent
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => setShowDemo(true)}
              className="text-lg px-8 py-6 hover-scale font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch a 30-second demo
            </Button>
          </motion.div>

          {/* Hero search bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar 
              size="large" 
              showSuggestions={true}
              placeholder="Try: 'Graph RAG for PDFs' or 'LLM evaluation techniques'"
            />
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-32 max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="card-elegant p-6 text-center hover-lift"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>© 2024 AstraFind. Built with AI.</span>
          </div>
          <div className="flex gap-6">
            <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground" disabled>
              Privacy
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground" disabled>
              Terms
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground" disabled>
              Contact
            </Button>
          </div>
        </div>
      </footer>

      {/* Demo modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-heading">AstraFind Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Demo video placeholder</p>
              <p className="text-sm mt-2">
                This would show a 30-second overview of AstraFind's multi-modal search capabilities.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}