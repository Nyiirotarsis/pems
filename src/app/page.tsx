"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Lightbulb, 
  Video, 
  Briefcase, 
  Mic2, 
  Camera, 
  Speaker,
  Globe,
  Target,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  // IMPORTANT: Since Google Photos links cannot be used directly as raw image sources, 
  // please replace these Unsplash placeholder URLs with direct '.jpg' or '.png' links
  // to your photos, or download your Google Photos and place them in the 'public' folder 
  // (e.g., '/hero1.jpg').
  const heroImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const services = [
    { title: "Audio & Visual Production", icon: <Video className="h-6 w-6" /> },
    { title: "Ambient Lighting", icon: <Lightbulb className="h-6 w-6" /> },
    { title: "Event Planning & Management", icon: <Building2 className="h-6 w-6" /> },
    { title: "Live Streaming", icon: <Globe className="h-6 w-6" /> },
    { title: "Trade Marketing", icon: <Target className="h-6 w-6" /> },
    { title: "Conferencing Equipment", icon: <Mic2 className="h-6 w-6" /> },
    { title: "Videography & Photography", icon: <Camera className="h-6 w-6" /> },
    { title: "Public Address System", icon: <Speaker className="h-6 w-6" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative w-full py-32 md:py-48 lg:py-64 overflow-hidden flex flex-col items-center justify-center bg-black">
        {/* Background Slide Carousel */}
        {heroImages.map((src, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-50' : 'opacity-0'}`}
            style={{ 
              backgroundImage: `url(${src})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          />
        ))}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/80 z-0 pointer-events-none" />
        
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none border-primary/50 bg-black/50 text-white backdrop-blur-md mx-auto tracking-wide">
              Pacific Events Management System
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-lg leading-tight uppercase relative inline-block">
              Crafting <span className="text-primary drop-shadow-[0_0_15px_rgba(0,128,128,0.5)]">Exceptional</span> Events
            </h1>
            <p className="mx-auto max-w-[800px] text-gray-200 md:text-xl lg:text-2xl font-medium leading-relaxed drop-shadow-md">
              We deliver cutting-edge event experiences across Africa that captivate, inspire, and empower communities.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/login">
                Access System <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentImage ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-24 bg-background relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">Our Expertise</h2>
            <div className="h-1 w-20 bg-primary rounded-full mt-4"></div>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed mt-4">
              Comprehensive event solutions tailored to create unforgettable experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-sm border border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground">{service.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="w-full py-24 relative overflow-hidden bg-muted/30 border-y border-border">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-5 blur-3xl pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-primary" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Vision */}
            <div className="space-y-6 p-10 bg-background backdrop-blur-xl rounded-3xl border border-border shadow-md relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-8 text-primary/5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <Globe size={240} />
              </div>
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4 relative z-10">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight relative z-10 text-foreground">
                Vision Statement
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground relative z-10">
                To be the leading Events Management & Communications company in AFRICA, renowned for elegance, creativity, innovation and excellence in delivering unforgettable experiences that inspire, connect and empower communities.
              </p>
            </div>
            
            {/* Mission */}
            <div className="space-y-6 p-10 bg-background backdrop-blur-xl rounded-3xl border border-border shadow-md relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
               <div className="absolute bottom-0 right-0 p-8 text-primary/5 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <Lightbulb size={240} />
              </div>
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4 relative z-10">
                <Zap size={32} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight relative z-10 text-foreground">
                Mission Statement
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground relative z-10">
                To curate and execute exceptional events and communications strategies that celebrate the rich diversity, heritage and potential of Africa. We are committed to foster meaningful connections, amplifying voices and driving positive change through our events and communication initiatives. By leveraging our expertise, creativity and local insights, we aim to exceed our client's expectations and make a lasting impact on the continent and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full py-24 bg-black text-white relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">Our Core Values</h2>
            <div className="h-1 w-20 bg-primary rounded-full mt-4"></div>
            <p className="max-w-[800px] text-gray-400 md:text-xl/relaxed mt-4">
              The principles that guide our work and define our commitment to excellence in everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
                <Zap className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Innovation</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                We constantly push boundaries to deliver cutting-edge event experiences that captivate and inspire.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
                <Users className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Customer-Centric</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Our clients' success is our priority. We listen, understand, and deliver beyond expectations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
                <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Integrity</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                We operate with transparency, honesty, and ethical practices in all our business relationships.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary transition-colors">
                <Briefcase className="h-10 w-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Teamwork</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Collaboration and partnership drive our success, both internally and with our valued clients.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-black border-t border-white/10 text-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Pacific Events</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="font-medium hover:text-primary transition-colors flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full hover:border-primary">
              System Login <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
