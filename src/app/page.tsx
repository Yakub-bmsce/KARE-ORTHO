'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Calendar, MessageSquare, MapPin, Award, Cpu, 
  Heart, Clock, Star, ArrowRight, ShieldCheck, Check, 
  Sparkles, X, HeartHandshake, ChevronRight, Activity, ShieldAlert
} from 'lucide-react';
import { InteractiveGrid } from '@/components/ui/InteractiveGrid';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { Component as EtherealShadow } from '@/components/ui/etheral-shadow';

// Stats interface for counter animation
interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'joint' | 'spine' | 'sports'>('all');
  const [selectedInfographic, setSelectedInfographic] = useState<string | null>(null);

  const infographics = [
    {
      title: "Sciatica & Nerve Pinches",
      image: "/sciatica-pain.jpg",
      description: "Learn how spinal disc slips compress lumbar nerve roots, triggering shooting leg pains.",
      tag: "Spine Care"
    },
    {
      title: "Smoking & Bone Union delays",
      image: "/bone-healing.jpg",
      description: "Chart demonstrating how nicotine and smoke components limit blood flow at fracture sites.",
      tag: "Fracture Guide"
    },
    {
      title: "Is Your Spine Losing Cushion?",
      image: "/spine-cushion.jpg",
      description: "High-definition visual comparing healthy, hydrated lumbar discs with dry, cracked ones.",
      tag: "Disc Health"
    },
    {
      title: "Treat Early, Move Better",
      image: "/dr-ajay-treat.jpg",
      description: "Clinical guidelines on how immediate joint treatments lock in long-term natural mobility.",
      tag: "Rehabilitation"
    }
  ];
  
  // Stats counters state
  const [stats, setStats] = useState({
    years: 0,
    surgeries: 0,
    success: 0
  });

  const statsSectionRef = useRef<HTMLDivElement>(null);
  const hasCountedRef = useRef(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    service: 'Knee Pain Treatment',
    message: ''
  });

  // Track scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Intersection Observer for Stats counting
  useEffect(() => {
    const statsSection = statsSectionRef.current;
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCountedRef.current) {
          hasCountedRef.current = true;
          
          // Animate years
          const duration = 2000;
          const steps = 50;
          const stepTime = duration / steps;
          
          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep++;
            setStats({
              years: Math.min(Math.round((10 / steps) * currentStep), 10),
              surgeries: Math.min(Math.round((5000 / steps) * currentStep), 5000),
              success: Math.min(Math.round((98 / steps) * currentStep), 98)
            });

            if (currentStep >= steps) {
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send real POST request to our API endpoint
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Booking API response:', data);

      // Client-side fallback: if environment variables are not configured in Twilio (isMock=true)
      // open WhatsApp in a new window pre-filled with the user's details.
      if (data.isMock) {
        const whatsappMsg = `Hello KARE Orthopaedics,\nI have scheduled an appointment from your website:\n\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📞 Phone: ${formData.phone}\n🗓️ Date: ${formData.date}\n🏥 Department: ${formData.service}\n📝 Notes: ${formData.message || 'None'}`;
        const encodedMsg = encodeURIComponent(whatsappMsg);
        window.open(`https://wa.me/918657641152?text=${encodedMsg}`, '_blank');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalOpen(false);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          service: 'Knee Pain Treatment',
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit booking appointment:', error);
      alert('There was a network error sending your booking request. Please call clinic directly at +91 86576 41152.');
    }
  };

  // Nav links helper
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-accent-teal selection:text-primary-bg">
      {/* Noise Texture Background */}
      <div className="noise-overlay" />

      {/* Global Background Grid */}
      <InteractiveGrid />
      <FloatingOrbs />

      {/* FIXED NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav-scrolled py-3' : 'glass-nav py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" onClick={(e) => handleScrollTo(e, 'home')} className="flex items-center gap-3 group">
            {/* Processed Custom Logo Image */}
            <div className="relative h-10 w-10 flex items-center justify-center bg-[#050e1f] rounded-lg border border-accent-teal/20 group-hover:border-accent-teal/50 transition-all overflow-hidden p-0.5">
              <img src="/logo.png" alt="KARE Icon" className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,201,167,0.3)]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans font-black text-xl text-accent-teal tracking-tight">KARE</span>
                <span className="font-serif text-lg font-bold text-white">Orthopaedics</span>
              </div>
              <span className="text-[8px] font-sans tracking-[0.25em] text-white/50 font-bold uppercase leading-none mt-0.5">
                Bringing Mobility to Life
              </span>
            </div>
          </a>

          {/* Nav Links Desktop */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {[
              { label: 'Home', id: 'home' },
              { label: 'About', id: 'about' },
              { label: 'Services', id: 'services' },
              { label: 'Why Us', id: 'why-us' },
              { label: 'Reviews', id: 'reviews' },
              { label: 'Contact', id: 'contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollTo(e, link.id)}
                className="text-white/70 hover:text-accent-teal hover:translate-y-[-1px] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Book Now Button Right */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full bg-accent-teal text-primary-bg hover:bg-white hover:text-primary-bg shadow-lg hover:shadow-accent-teal/20 transition-all duration-300 active:scale-95"
          >
            📞 Book Now
          </button>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Special Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b1528] border border-accent-teal/20 text-accent-teal text-xs font-semibold uppercase tracking-wider mb-6 hover:border-accent-teal/40 transition-colors animate-pulse-ring">
              <span className="h-2 w-2 rounded-full bg-accent-teal animate-pulse" />
              🏥 Bengaluru's Trusted Orthopaedic Specialist
            </div>

            {/* Doctor/Clinic Main Heading */}
            <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-black text-white leading-[1.08] tracking-tight mb-4">
              Dr. Ajay N <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal via-[#1abfff] to-accent-blue font-serif font-light italic">
                Orthopaedic
              </span> <br/>
              Surgeon
            </h1>

            {/* Qualifications */}
            <p className="font-sans text-xs md:text-sm font-bold tracking-widest text-accent-teal uppercase mb-5">
              MBBS · MS · DNB Ortho · FIJR · FASM · FIRA (Europe)
            </p>

            {/* Sub-text Bio */}
            <p className="text-white/70 max-w-xl text-base md:text-lg font-light leading-relaxed mb-8">
              Specialising in <strong className="text-white font-semibold">robotic-assisted joint replacement</strong>, arthroscopy, comprehensive spine care, complex fracture repair, and sports medicine.
            </p>

            {/* Stats Row */}
            <div ref={statsSectionRef} className="grid grid-cols-3 gap-6 md:gap-10 w-full max-w-lg mb-8 p-5 rounded-2xl bg-[#0b1528]/40 border border-white/5 backdrop-blur-sm">
              <div>
                <p className="text-3xl md:text-4xl font-serif font-black text-accent-teal">
                  {stats.years}+
                </p>
                <p className="text-[10px] md:text-xs text-white/50 font-bold uppercase tracking-wider mt-1">
                  Years Exp
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-serif font-black text-accent-teal">
                  {stats.surgeries}+
                </p>
                <p className="text-[10px] md:text-xs text-white/50 font-bold uppercase tracking-wider mt-1">
                  Surgeries
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-serif font-black text-accent-teal">
                  {stats.success}%
                </p>
                <p className="text-[10px] md:text-xs text-white/50 font-bold uppercase tracking-wider mt-1">
                  Success Rate
                </p>
              </div>
            </div>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-teal text-primary-bg rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-primary-bg hover:shadow-2xl hover:shadow-accent-teal/20 transition-all duration-300"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
              
              <a 
                href="#services" 
                onClick={(e) => handleScrollTo(e, 'services')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-white/10 hover:border-accent-teal transition-all duration-300"
              >
                View Services <ArrowRight className="h-4 w-4 text-accent-teal" />
              </a>
            </div>

            {/* Direct Phone Action */}
            <div className="mt-8 flex items-center gap-3">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-accent-teal/10 border border-accent-teal/30">
                <Phone className="h-4 w-4 text-accent-teal animate-bounce" />
                <span className="absolute inset-0 rounded-full border border-accent-teal/40 animate-ping" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/40 leading-none">Emergency Call Now</p>
                <a href="tel:+918657641152" className="text-white hover:text-accent-teal font-sans font-bold text-sm tracking-wide transition-colors">
                  +91 86576 41152
                </a>
              </div>
            </div>

          </div>

          {/* Right Column Doctor Card */}
          <div className="lg:col-span-5 flex justify-center items-center z-10">
            <DoctorCard />
          </div>

        </div>
      </section>

      {/* SECTION 2 — SERVICES */}
      <section id="services" className="relative py-24 bg-secondary-bg border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 w-full">
          
          {/* Header Label and Title */}
          <div className="flex flex-col items-center text-center mb-16 reveal-on-scroll">
            <span className="text-xs font-bold tracking-[0.25em] text-accent-teal uppercase mb-2">WHAT WE TREAT</span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-white">Expert Services</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent-teal to-accent-blue rounded-full mt-4" />
          </div>

          {/* Services Grid (6 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="relative glass-card rounded-[24px] p-8 flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
              <div>
                <span className="text-4xl mb-6 block filter drop-shadow-[0_4px_6px_rgba(0,201,167,0.2)] group-hover:scale-110 transition-transform duration-300">🦵</span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent-teal transition-colors">Knee Pain Treatment</h3>
                <p className="text-white/60 text-sm leading-relaxed">Robotic-assisted diagnostic alignment, partial/total joint mapping, and customized pain management therapies.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-accent-teal mt-6 tracking-wide group-hover:translate-x-1 transition-transform">
                Book Consultation <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="relative glass-card rounded-[24px] p-8 flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
              <div>
                <span className="text-4xl mb-6 block filter drop-shadow-[0_4px_6px_rgba(0,201,167,0.2)] group-hover:scale-110 transition-transform duration-300">🦴</span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent-teal transition-colors">Back & Spine Care</h3>
                <p className="text-white/60 text-sm leading-relaxed">Expert diagnosis for sciatica, slipped discs, spinal stenosis, lumbar compression, and chronic nerve pain.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-accent-teal mt-6 tracking-wide group-hover:translate-x-1 transition-transform">
                Book Consultation <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="relative glass-card rounded-[24px] p-8 flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
              <div>
                <span className="text-4xl mb-6 block filter drop-shadow-[0_4px_6px_rgba(0,201,167,0.2)] group-hover:scale-110 transition-transform duration-300">🩹</span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent-teal transition-colors">Fracture Care</h3>
                <p className="text-white/60 text-sm leading-relaxed">24/7 emergency stabilization, modern custom castings, plates, pins alignment, and post-union therapy plans.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-accent-teal mt-6 tracking-wide group-hover:translate-x-1 transition-transform">
                Book Consultation <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 4 */}
            <div className="relative glass-card rounded-[24px] p-8 flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
              <div>
                <span className="text-4xl mb-6 block filter drop-shadow-[0_4px_6px_rgba(0,201,167,0.2)] group-hover:scale-110 transition-transform duration-300">🏃</span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent-teal transition-colors">Sports Injuries</h3>
                <p className="text-white/60 text-sm leading-relaxed">Arthroscopic repairs for ACL/MCL tears, meniscus suture, labrum stabilization, rotators cuff, and tendon healing.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-accent-teal mt-6 tracking-wide group-hover:translate-x-1 transition-transform">
                Book Consultation <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 5 */}
            <div className="relative glass-card rounded-[24px] p-8 flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
              <div>
                <span className="text-4xl mb-6 block filter drop-shadow-[0_4px_6px_rgba(0,201,167,0.2)] group-hover:scale-110 transition-transform duration-300">🔩</span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent-teal transition-colors">Joint Replacement</h3>
                <p className="text-white/60 text-sm leading-relaxed">Robotic alignment replacement for hip, knee, and shoulder using certified high-end bio-compatible implants.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-accent-teal mt-6 tracking-wide group-hover:translate-x-1 transition-transform">
                Book Consultation <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 6 */}
            <div className="relative glass-card rounded-[24px] p-8 flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
              <div>
                <span className="text-4xl mb-6 block filter drop-shadow-[0_4px_6px_rgba(0,201,167,0.2)] group-hover:scale-110 transition-transform duration-300">💊</span>
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent-teal transition-colors">Arthritis Treatment</h3>
                <p className="text-white/60 text-sm leading-relaxed">Non-surgical management of Osteoarthritis, Rheumatoid Arthritis, viscosupplementation injections, and rehab.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-accent-teal mt-6 tracking-wide group-hover:translate-x-1 transition-transform">
                Book Consultation <ChevronRight className="h-3 w-3" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2.5 — PATIENT EDUCATION HUB */}
      <section id="education" className="relative py-24 bg-[#050e1f] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 w-full">
          
          {/* Header Label and Title */}
          <div className="flex flex-col items-center text-center mb-16 reveal-on-scroll">
            <span className="text-xs font-bold tracking-[0.25em] text-accent-teal uppercase mb-2">PATIENT EDUCATION HUB</span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-white">Orthopaedic Health Insights</h2>
            <p className="text-white/60 text-sm md:text-base max-w-2xl mt-4 leading-relaxed">
              Dr. Ajay N believes that patient education leads to faster recovery. Explore detailed clinical charts, spine models, and bone healing guidelines below. Click any image to view in fullscreen.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-accent-teal to-accent-blue rounded-full mt-6" />
          </div>

          {/* 4 Infographics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {infographics.map((info) => (
              <div 
                key={info.title} 
                className="relative glass-card rounded-[24px] overflow-hidden flex flex-col justify-between group hover:translate-y-[-6px] transition-all duration-300 reveal-on-scroll"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-teal to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-[24px]" />
                
                {/* Image Container with object-contain to prevent cutting text */}
                <div 
                  onClick={() => setSelectedInfographic(info.image)}
                  className="relative aspect-square w-full bg-[#030914] border-b border-white/5 overflow-hidden cursor-zoom-in"
                >
                  <img 
                    src={info.image} 
                    alt={info.title} 
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Hover visual helper */}
                  <div className="absolute inset-0 bg-primary-bg/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 bg-accent-teal text-primary-bg rounded-lg text-xs font-bold uppercase tracking-wider">
                      🔍 View Fullscreen
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#0b1528]/80 text-accent-teal text-[10px] font-bold px-2 py-0.5 rounded border border-accent-teal/20">
                    {info.tag}
                  </span>
                </div>

                {/* Info Text */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-serif text-base font-bold text-white mb-2 group-hover:text-accent-teal transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-white/50 text-[11px] leading-relaxed">
                      {info.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedInfographic(info.image)}
                    className="mt-4 text-[10px] font-bold text-accent-teal uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors self-start"
                  >
                    Open Infographic →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY KARE */}
      <section id="why-us" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Features (4 features) */}
          <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-accent-teal uppercase mb-2">WHY TRUST US</span>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-white">Clinical Integrity & Precise Engineering</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-accent-teal to-accent-blue rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              {/* Feature 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-base">European Fellowship</h4>
                  <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
                    FIRA Europe fellowship accreditation matching highest global standards.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-base">Patient-First Approach</h4>
                  <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
                    Personalized arthro-rehab planning, custom diet profiles, and bedside tracking.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-base">Same-Week Appointments</h4>
                  <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
                    Consultation rate fixed at ₹500. Immediate diagnosis checkups without weeks of waiting lists.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column Stat card & Ethereal Shadow Component Integration */}
          <div className="lg:col-span-5 relative z-10 flex flex-col gap-6 reveal-on-scroll">
            
            {/* Visual Stat Card */}
            <div className="relative p-8 rounded-3xl bg-[#0b1528] border border-accent-teal/20 shadow-2xl overflow-hidden group">
              {/* Subtle neon gradient border outline hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/5 to-accent-blue/5 pointer-events-none" />
              
              <p className="text-[11px] font-bold text-accent-teal uppercase tracking-widest">PROVED RECORD</p>
              <h3 className="font-serif text-6xl md:text-7xl font-black text-white mt-3 leading-none tracking-tight">5000+</h3>
              <p className="text-white/70 text-sm font-semibold mt-1">Successful Surgeries Completed</p>
              
              {/* Sub-grid stats */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                <div>
                  <span className="text-xs text-white/50 block uppercase tracking-wider">Experience</span>
                  <span className="text-white font-bold text-base mt-0.5 block">10+ Years</span>
                </div>
                <div>
                  <span className="text-xs text-white/50 block uppercase tracking-wider">Satisfaction</span>
                  <span className="text-white font-bold text-base mt-0.5 block">98% Rating</span>
                </div>
                <div>
                  <span className="text-xs text-white/50 block uppercase tracking-wider">Consulting</span>
                  <span className="text-white font-bold text-base mt-0.5 block">₹500 Only</span>
                </div>
                <div>
                  <span className="text-xs text-white/50 block uppercase tracking-wider">Google Rating</span>
                  <span className="text-accent-teal font-bold text-base mt-0.5 block">4.9 ★★★★★</span>
                </div>
              </div>
            </div>

            {/* INTEGRATED ETHEREAL SHADOWS CONTAINER */}
            <div className="relative h-[250px] rounded-3xl overflow-hidden border border-white/5 shadow-lg group">
              <EtherealShadow 
                color="rgba(0, 201, 167, 0.45)"
                animation={{ scale: 80, speed: 70 }}
                noise={{ opacity: 0.8, scale: 1.0 }}
                sizing="fill"
                showText={false}
                className="absolute inset-0 z-0"
              />
              
              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050e1f] via-transparent to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[10px] font-black bg-accent-teal text-primary-bg px-2 py-0.5 rounded-md w-max uppercase tracking-wider mb-2">Simulated Alignment UI</span>
                <h4 className="font-sans font-bold text-white text-base">Ethereal Shadow Scanner</h4>
                <p className="text-white/60 text-[11px] mt-1 leading-relaxed">
                  Interactive real-time tissue and bone articulation simulation dashboard overlay.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4 — PATIENT REVIEWS */}
      <section id="reviews" className="relative py-24 bg-secondary-bg border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 w-full">
          
          {/* Header Label and Title */}
          <div className="flex flex-col items-center text-center mb-16 reveal-on-scroll">
            <span className="text-xs font-bold tracking-[0.25em] text-accent-teal uppercase mb-2">PATIENT STORIES</span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-white">What Our Patients Say</h2>
            
            {/* Google Rating Badge */}
            <div className="flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-[#050e1f] border border-white/10 text-white text-xs font-semibold">
              <span className="text-yellow-400 font-bold text-sm">★</span>
              <span>4.9 on Google Reviews</span>
              <span className="text-white/40">|</span>
              <span className="text-white/50 text-[10px] uppercase">120+ Patients Verified</span>
            </div>
          </div>

          {/* 4-card reviews grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Review 1 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:translate-y-[-4px] hover:border-accent-teal/30 hover:shadow-[0_8px_30px_rgba(0,201,167,0.08)] transition-all duration-300 reveal-on-scroll">
              <p className="text-white/80 font-light italic leading-relaxed text-sm md:text-base">
                "Dr. Ajay's robotic-assisted surgery approach is incredible. I had my total knee replacement done here, and his precision and digital alignment system got me standing and walking in weeks, with minimal pain."
              </p>
              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center font-serif text-accent-teal font-black text-sm">
                  RK
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm">Ramesh Kumar</h4>
                  <span className="text-[10px] text-accent-teal font-medium uppercase tracking-wider block mt-0.5">Knee Replacement patient</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:translate-y-[-4px] hover:border-accent-teal/30 hover:shadow-[0_8px_30px_rgba(0,201,167,0.08)] transition-all duration-300 reveal-on-scroll">
              <p className="text-white/80 font-light italic leading-relaxed text-sm md:text-base">
                "I suffered from shooting pain down my left leg (sciatica) for over two years. Dr. Ajay N did a detailed diagnostic check and located the pinched nerve immediately. Post treatment, the pain is fully gone!"
              </p>
              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center font-serif text-accent-teal font-black text-sm">
                  SP
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm">Sunita Patel</h4>
                  <span className="text-[10px] text-accent-teal font-medium uppercase tracking-wider block mt-0.5">Spine Care / Sciatica patient</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:translate-y-[-4px] hover:border-accent-teal/30 hover:shadow-[0_8px_30px_rgba(0,201,167,0.08)] transition-all duration-300 reveal-on-scroll">
              <p className="text-white/80 font-light italic leading-relaxed text-sm md:text-base">
                "An ACL tear on the running track put me out of commission. Dr. Ajay did arthroscopic ligament reconstruction. Back on the track running safely in just 4 months. Exceptional post-op guidance!"
              </p>
              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center font-serif text-accent-teal font-black text-sm">
                  AV
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm">Arjun Verma</h4>
                  <span className="text-[10px] text-accent-teal font-medium uppercase tracking-wider block mt-0.5">Sports Injury patient</span>
                </div>
              </div>
            </div>

            {/* Review 4 */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:translate-y-[-4px] hover:border-accent-teal/30 hover:shadow-[0_8px_30px_rgba(0,201,167,0.08)] transition-all duration-300 reveal-on-scroll">
              <p className="text-white/80 font-light italic leading-relaxed text-sm md:text-base">
                "My mother suffered a severe hip fracture at home. Dr. Ajay handled the hip pinning surgery beautifully. He was incredibly reassuring to us, and his post-surgery mobilization program was extremely effective."
              </p>
              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center font-serif text-accent-teal font-black text-sm">
                  MN
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm">Meera Nair</h4>
                  <span className="text-[10px] text-accent-teal font-medium uppercase tracking-wider block mt-0.5">Fracture Care patient</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5 — CONTACT & BOOKING */}
      <section id="contact" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Contact details, buttons and timings */}
          <div className="lg:col-span-6 space-y-8 reveal-on-scroll">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-accent-teal uppercase mb-2">REACH OUT</span>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-white">Clinic Details</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-accent-teal to-accent-blue rounded-full mt-4" />
            </div>

            {/* Address cards, phone etc. */}
            <div className="space-y-4">
              {/* Address */}
              <div className="flex gap-4 p-5 rounded-2xl bg-[#0b1528]/50 border border-white/5">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm">Clinic Location</h4>
                  <p className="text-white/70 text-xs mt-1.5 leading-relaxed">
                    9th Main, 4th cross, Gururaja layout, behind Vidhyapeetha, Thyagaraja Nagar, Circle, Bengaluru, Karnataka 560070
                  </p>
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="flex gap-4 p-5 rounded-2xl bg-[#0b1528]/50 border border-white/5">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm">Consultation Fee</h4>
                  <p className="text-white/70 text-xs mt-1.5 leading-relaxed">
                    ₹500 (Direct OPD booking checkups)
                  </p>
                </div>
              </div>

              {/* Clinic Timings card */}
              <div className="p-6 rounded-2xl bg-[#0b1528] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-accent-teal/5 rounded-full blur-2xl pointer-events-none" />
                <h4 className="font-sans font-bold text-white text-sm flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-accent-teal" />
                  Clinic Operating Timings
                </h4>
                
                <div className="space-y-2.5 text-xs text-white/70">
                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span>Monday – Saturday</span>
                    <span className="font-bold text-white">9:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span>Sunday</span>
                    <span className="font-bold text-white">10:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between text-red-400 font-medium">
                    <span>Emergency (OPD Call)</span>
                    <span className="font-bold text-red-400">Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked CTA buttons */}
            <div className="flex flex-col gap-3.5 pt-2">
              <a 
                href="tel:+918657641152"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-accent-teal text-accent-teal hover:bg-accent-teal hover:text-primary-bg rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300"
              >
                <Phone className="h-4 w-4" />
                Call Now — +91 86576 41152
              </a>

              <a 
                href="https://wa.me/918657641152?text=Hello%20KARE%20Orthopaedics%2C%20I%20would%20like%20to%20schedule%20an%20appointment%20with%20Dr.%20Ajay%20N%20for%20an%20orthopaedic%20consultation.%20Please%20let%20me%20know%20the%20available%20slots."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#25d366] text-white hover:bg-[#20ba5a] rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#25d366]/20"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp Us
              </a>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-accent-teal text-primary-bg hover:bg-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 shadow-lg hover:shadow-accent-teal/20"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
            </div>

          </div>

          {/* Right Side: Map Embed */}
          <div className="lg:col-span-6 w-full reveal-on-scroll">
            <div className="rounded-[24px] overflow-hidden border border-accent-teal/30 shadow-2xl relative h-[450px] group bg-[#0b1528]">
              {/* Overlay shading */}
              <div className="absolute inset-0 bg-accent-teal/5 pointer-events-none group-hover:bg-transparent transition-colors duration-300" />
              
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4364.557639754444!2d77.56005619999999!3d12.9328848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3faa7b7b51bf%3A0x3295966f313a234a!2sDr%20Ajay%20N%20-%20KARE%20Orthopaedics%20Clinic!5e1!3m2!1sen!2sin!4v1780659864945!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter invert-[90%] hue-rotate-[180deg] contrast-[85%] grayscale-[40%] group-hover:filter-none transition-all duration-700"
              />
            </div>
            <p className="text-center text-white/40 text-[10px] uppercase tracking-wider mt-3">
              ★ Tip: Click map to open driving directions in Google Maps.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#030914] pt-16 pb-8 border-t border-gradient-to-r from-accent-teal via-[#1abfff] to-accent-blue/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center justify-between">
            
            {/* Logo left */}
            <div className="lg:col-span-6 flex flex-col items-start gap-4">
              <a href="#home" onClick={(e) => handleScrollTo(e, 'home')} className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center bg-[#050e1f] rounded border border-accent-teal/20 p-0.5">
                  <img src="/logo.png" alt="KARE logo" className="h-full w-full object-contain" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans font-black text-lg text-accent-teal leading-none">KARE</span>
                  <span className="font-serif text-base font-bold text-white leading-none">Orthopaedics</span>
                </div>
              </a>
              <p className="text-xs text-white/50 font-light max-w-sm leading-relaxed">
                Bengaluru's specialized robotic-assisted surgical joint restoration, fracture recovery, and therapeutic spine center. Bringing Mobility to Life.
              </p>
            </div>

            {/* Icon links right */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-start lg:justify-end gap-6 text-xs text-white/70">
              <a href="tel:+918657641152" className="flex items-center gap-2 hover:text-accent-teal transition-colors">
                <Phone className="h-3.5 w-3.5 text-accent-teal" />
                +91 86576 41152
              </a>
              <a href="https://wa.me/918657641152?text=Hello%20KARE%20Orthopaedics%2C%20I%20would%20like%20to%20schedule%20an%20appointment%20with%20Dr.%20Ajay%20N%20for%20an%20orthopaedic%20consultation.%20Please%20let%20me%20know%20the%20available%20slots." target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent-teal transition-colors">
                <MessageSquare className="h-3.5 w-3.5 text-[#25d366]" />
                WhatsApp
              </a>
              <a 
                href="https://maps.google.com/?q=Dr+Ajay+N+-+KARE+Orthopaedics+Clinic"
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-accent-teal transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-accent-teal" />
                Thyagaraja Nagar, Bengaluru
              </a>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/40 tracking-wider uppercase font-semibold">
            <span>© 2025 KARE Orthopaedics — Dr. Ajay N. All Rights Reserved.</span>
            <span className="mt-2 sm:mt-0">Designed with modern surgical-tech precision</span>
          </div>
        </div>
      </footer>

      {/* FLOATING STICKY ACTION BUTTONS (always visible, bottom-right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end pointer-events-none">
        
        {/* Call Now sticky */}
        <a 
          href="tel:+918657641152"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-accent-teal text-primary-bg shadow-xl hover:shadow-accent-teal/30 hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs uppercase tracking-wider animate-bounce"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp sticky */}
        <a 
          href="https://wa.me/918657641152?text=Hello%20KARE%20Orthopaedics%2C%20I%20would%20like%20to%20schedule%20an%20appointment%20with%20Dr.%20Ajay%20N%20for%20an%20orthopaedic%20consultation.%20Please%20let%20me%20know%20the%20available%20slots."
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#25d366] text-white shadow-xl hover:shadow-[#25d366]/30 hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs uppercase tracking-wider"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </a>

      </div>

      {/* BOOKING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop blur */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-primary-bg/85 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0b1528] border border-white/10 shadow-2xl p-7 md:p-8 z-10 animate-pulse-ring overflow-hidden">
            
            {/* Corner glows */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-accent-teal/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-24 w-24 bg-accent-blue/10 rounded-full blur-xl pointer-events-none" />

            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="text-left mb-6">
              <div className="flex items-center gap-2 text-accent-teal text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                Surgical Precision Booking
              </div>
              <h3 className="font-serif text-2xl font-black text-white">Book Appointment</h3>
              <p className="text-white/60 text-xs mt-1">Consultation fee: ₹500. Secure your same-week schedule slot.</p>
            </div>

            {/* Form status change */}
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-accent-teal/10 border border-accent-teal flex items-center justify-center text-accent-teal mb-4 animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white">Appointment Scheduled!</h4>
                <p className="text-white/70 text-xs max-w-sm mt-2 leading-relaxed">
                  We have queued your appointment for Dr. Ajay N. An SMS confirmation and consultation token will be sent to your phone number shortly.
                </p>
                <div className="h-1 w-24 bg-accent-teal/20 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-accent-teal w-full origin-left animate-ping" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Your Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full bg-[#050e1f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-accent-teal focus:outline-none transition-colors"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="patient@example.com"
                      className="w-full bg-[#050e1f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-accent-teal focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#050e1f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-accent-teal focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Preferred Date</label>
                  <input 
                    type="date" 
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-[#050e1f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent-teal focus:outline-none transition-colors"
                  />
                </div>

                {/* Service type */}
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Treatment Specialty</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-[#050e1f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent-teal focus:outline-none transition-colors"
                  >
                    <option value="Knee Pain Treatment">🦵 Knee Pain Treatment</option>
                    <option value="Back & Spine Care">🦴 Back & Spine Care</option>
                    <option value="Fracture Care">🩹 Fracture Care</option>
                    <option value="Sports Injuries">🏃 Sports Injuries</option>
                    <option value="Joint Replacement">🔩 Joint Replacement</option>
                    <option value="Arthritis Treatment">💊 Arthritis Treatment</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Brief Medical Notes (Optional)</label>
                  <textarea 
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe symptoms, e.g. ligament pain, joint swelling, fracture recovery info..."
                    className="w-full bg-[#050e1f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-accent-teal focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-white/40 leading-relaxed">
                  By submitting, you agree to receive appointment alerts on WhatsApp or SMS. If you require immediate trauma/fracture care, please call <a href="tel:+918657641152" className="text-accent-teal font-bold hover:underline">+91 86576 41152</a> directly.
                </p>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="w-full py-4 bg-accent-teal text-primary-bg rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-white transition-all duration-300 shadow-lg"
                >
                  Confirm Slot Schedule Appointment
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedInfographic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedInfographic(null)}
            className="absolute inset-0 bg-[#050e1f]/95 backdrop-blur-md transition-opacity duration-300"
          />
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center z-10 p-2">
            {/* Close button */}
            <button 
              onClick={() => setSelectedInfographic(null)}
              className="absolute top-[-35px] right-2 text-white hover:text-accent-teal text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors bg-[#0b1528] px-3.5 py-1.5 rounded-full border border-white/10"
            >
              <X className="h-4 w-4 text-accent-teal" /> Close
            </button>
            <img 
              src={selectedInfographic} 
              alt="High Resolution Educational Infographic" 
              className="max-w-full max-h-full object-contain rounded-xl border border-white/10 shadow-2xl filter drop-shadow-[0_0_15px_rgba(0,201,167,0.15)] bg-[#050e1f] p-1.5" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
