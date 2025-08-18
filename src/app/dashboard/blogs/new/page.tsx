"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogs } from "@/hooks/useBlogs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";

export default function AddBlogPage() {
  const router = useRouter();
  // We only need the addBlog mutation here
  const { addBlog } = useBlogs(1, 10); // page/limit irrelevant for addBlog

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">(
    "Draft"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !status) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }

    try {
      await addBlog.mutateAsync({ title, summary: content, published: status === "Published" });
      toast({ title: "Blog post created successfully!" });
      router.push("/dashboard/blogs"); // Redirect to blog list
    } catch (error: any) {
      toast({
        title: "Failed to create blog post",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add New Blog Post</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog post title"
            required
          />
        </div>

        {/* Content */}
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content..."
            rows={10}
            required
          />
        </div>

        {/* Status */}
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(val) => setStatus(val as any)}
            required
          >
            <SelectTrigger id="status" className="w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit button */}
        <Button type="submit" disabled={addBlog.isPending} className="w-fit" variant={"blue"}>
          {addBlog.isPending ? "Creating..." : "Create Blog Post"}
        </Button>
      </form>
    </div>
  );
}
