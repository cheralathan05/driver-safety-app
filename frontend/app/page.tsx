"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Car, Eye, MapPin, Bell, Smartphone, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useDriverStore } from "@/lib/store"

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useDriverStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const features = [
    {
      icon: Eye,
      title: "AI Drowsiness Detection",
      description: "Real-time monitoring of eye patterns and facial cues to detect fatigue",
    },
    {
      icon: Smartphone,
      title: "Phone Usage Alerts",
      description: "Instant alerts when phone usage is detected while driving",
    },
    {
      icon: MapPin,
      title: "Smart Route Planning",
      description: "Weather-aware routing with city-by-city forecasts",
    },
    {
      icon: Bell,
      title: "Emergency SOS",
      description: "Automatic accident detection with instant emergency contact alerts",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Driver Safety AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Driver Safety
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Drive Safer with <span className="text-primary">Intelligent Monitoring</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Real-time AI detection for drowsiness, distraction, and emergencies. Keep yourself and your loved ones safe
            on every journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                <Car className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "99.2%", label: "Detection Accuracy" },
              { value: "< 200ms", label: "Response Time" },
              { value: "50K+", label: "Active Users" },
              { value: "1M+", label: "Safe Trips" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Safety Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology working seamlessly to keep you safe on the road
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign In & Setup", desc: "Quick Google sign-in and add emergency contacts" },
              { step: "2", title: "Start Monitoring", desc: "Enable camera and begin your trip" },
              { step: "3", title: "Drive Safely", desc: "AI monitors and alerts you in real-time" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Drive Safer?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of drivers who trust Driver Safety AI</p>
          <Link href="/login">
            <Button size="lg">
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Driver Safety AI</span>
          </div>
          <p className="text-sm text-muted-foreground">Protecting drivers with intelligent AI monitoring</p>
        </div>
      </footer>
    </div>
  )
}
