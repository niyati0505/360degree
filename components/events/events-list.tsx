"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Bell } from "lucide-react"
import React, { useEffect, useState } from "react"

type Event = {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
  type: string
  attendees?: string
  status?: string
}

const getEventTypeColor = (type?: string) => {
  if (!type || typeof type !== "string") {
    return "bg-muted text-muted-foreground"
  }
  switch (type.toLowerCase()) {
    case "festival":
      return "bg-primary text-primary-foreground"
    case "religious":
      return "bg-secondary text-secondary-foreground"
    case "cultural":
      return "bg-accent text-accent-foreground"
    case "pilgrimage":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/events")
        if (!res.ok) throw new Error("Failed to fetch events")
        const data = await res.json()
        setEvents(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">All Events</h2>
        <p className="text-muted-foreground">Complete calendar of monastery events and festivals</p>
      </div>

      {loading && <div className="text-center text-muted-foreground">Loading events...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32 flex-shrink-0">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-20 md:h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                    <Badge className={`${getEventTypeColor(event.type)} text-xs`}>{event.type}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees}
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.location}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Bell className="h-4 w-4 mr-2" />
                        Remind Me
                      </Button>
                      <Button size="sm" variant="outline">
                        Add to Calendar
                      </Button>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More Events</Button>
      </div>
    </section>
  )
}
