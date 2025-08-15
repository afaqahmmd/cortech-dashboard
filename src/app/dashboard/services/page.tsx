import Link from "next/link"
import { PlusCircle, Code, Layout, Database, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { services } from "@/data/mockServicesList"


export default function ServicesPage() {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">Services</h1>
        <Button variant={"blue"} asChild size="sm">
          <Link href="/dashboard/services/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Service
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{service.title}</CardTitle>
              <service.icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>{service.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant={service.status === "Active" ? "default" : "outline"}>{service.status}</Badge>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
