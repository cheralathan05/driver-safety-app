"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageSquare, Mail, FileText, Send } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import { toast } from "sonner"

const faqs = [
  {
    question: "How does the AI detection work?",
    answer:
      "Our AI uses your device's camera to analyze facial features in real-time. It detects signs of drowsiness (eye closure, yawning), distraction (looking away), and phone usage. The system runs locally on your device for privacy.",
  },
  {
    question: "Will this drain my battery quickly?",
    answer:
      "The app is optimized for battery efficiency. You can enable Battery Saver Mode in Settings to reduce processing frequency. On average, the app uses about 10-15% battery per hour of active monitoring.",
  },
  {
    question: "How accurate is the accident detection?",
    answer:
      "Our accident detection uses multiple signals including sudden speed changes, prolonged drowsiness, and loss of face detection. The system has a 10-second countdown before alerting contacts to prevent false alarms.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes! All AI processing happens on your device. We don't store or transmit video footage. Only trip statistics and alert logs are saved to your account for your reference.",
  },
  {
    question: "Can I use this while the phone is mounted?",
    answer:
      "Yes, we recommend mounting your phone on the dashboard or windshield with the front camera facing you. This provides the best angle for accurate detection.",
  },
]

export default function SupportPage() {
  const router = useRouter()
  const { isAuthenticated } = useDriverStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Support request submitted! We'll get back to you soon.")
  }

  if (!isAuthenticated) return null

  return (
    <DashboardLayout title="Support">
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Documentation</p>
                <p className="text-xs text-muted-foreground">User guides & tutorials</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-safe/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-safe" />
              </div>
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-xs text-muted-foreground">Chat with support</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-chart-5" />
              </div>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-xs text-muted-foreground">support@driversafety.ai</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Have a question or feedback? Send us a message.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue or feedback..." rows={4} />
              </div>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
