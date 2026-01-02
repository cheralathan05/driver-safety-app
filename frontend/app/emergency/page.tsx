"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Phone, Plus, Trash2, Bell, Star } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import { toast } from "sonner"
import type { EmergencyContact } from "@/lib/types"

export default function EmergencyPage() {
  const router = useRouter()
  const { isAuthenticated, user, setUser, triggerSOS } = useDriverStore()
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "Family",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please fill in all fields")
      return
    }

    const contact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
      isPrimary: (user?.emergencyContacts?.length || 0) === 0,
    }

    setUser({
      ...user!,
      emergencyContacts: [...(user?.emergencyContacts || []), contact],
    })

    setNewContact({ name: "", phone: "", relationship: "Family" })
    setIsAddingContact(false)
    toast.success("Emergency contact added")
  }

  const handleDeleteContact = (id: string) => {
    setUser({
      ...user!,
      emergencyContacts: user?.emergencyContacts?.filter((c) => c.id !== id) || [],
    })
    toast.success("Contact removed")
  }

  const handleSetPrimary = (id: string) => {
    setUser({
      ...user!,
      emergencyContacts:
        user?.emergencyContacts?.map((c) => ({
          ...c,
          isPrimary: c.id === id,
        })) || [],
    })
    toast.success("Primary contact updated")
  }

  const handleTestSOS = () => {
    toast.info("This would trigger a test SOS alert to your emergency contacts")
  }

  if (!isAuthenticated) return null

  return (
    <DashboardLayout title="Emergency Settings">
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        {/* SOS Button */}
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-danger/20 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-12 h-12 text-danger" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-foreground mb-2">Emergency SOS</h2>
                <p className="text-muted-foreground mb-4">
                  In case of emergency, press the SOS button to immediately alert your emergency contacts with your
                  location.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="destructive" size="lg" onClick={triggerSOS} className="gap-2">
                    <Phone className="w-5 h-5" />
                    Trigger SOS
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleTestSOS}>
                    Test SOS (No Alert)
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>People who will be notified in case of emergency</CardDescription>
              </div>
              <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                    <DialogDescription>This person will be notified when you trigger an SOS alert.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Contact name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={newContact.relationship}
                        onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Colleague">Colleague</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddContact}>Add Contact</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {!user?.emergencyContacts?.length ? (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-2">No emergency contacts added</p>
                <p className="text-sm text-muted-foreground">
                  Add contacts who should be notified in case of emergency
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{contact.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{contact.name}</p>
                        {contact.isPrimary && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!contact.isPrimary && (
                        <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(contact.id)}>
                          Set Primary
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alert Settings
            </CardTitle>
            <CardDescription>Configure how emergency alerts are sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">Send SMS to emergency contacts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Location Sharing</Label>
                <p className="text-sm text-muted-foreground">Include live location in alerts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-detect Accidents</Label>
                <p className="text-sm text-muted-foreground">Automatically trigger SOS on detected accidents</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Countdown Timer</Label>
                <p className="text-sm text-muted-foreground">10 second delay before sending alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
