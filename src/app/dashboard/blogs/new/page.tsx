"use client"

import { useActionState } from "react"
import { createBlogPost } from "@/actions/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function NewBlogPostPage() {
  const [state, formAction, isPending] = useActionState(createBlogPost, null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      })
      redirect("/dashboard/blogs") // Redirect on success
    } else if (state?.success === false) {
      toast({
        title: "Error!",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-semibold text-lg md:text-2xl">Create New Blog Post</h1>
      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>Fill in the details for your new blog post.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter blog post title" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog post content here..."
                rows={10}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Draft" required>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-fit" variant={"blue"} type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Blog Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
