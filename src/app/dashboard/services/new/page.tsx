"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";
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
  const { addService } = useServices();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !slug) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }

    try {
      await addService.mutateAsync({
        title,
        description,
       slug,
      });
      toast({ title: "Service created successfully!" });
      router.push("/dashboard/services"); // Redirect to services
    } catch (error: any) {
      toast({
        title: "Failed to create service",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add New Service</h1>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter service title"
            required
          />
        </div>

        {/* Content */}
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your service description..."
            rows={10}
            required
          />
        </div>

        {/* Slug */}
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="title"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter service slug"
            required
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={addService.isPending}
          className="w-fit"
          variant={"blue"}
        >
          {addService.isPending ? "Creating..." : "Create Service"}
        </Button>
      </form>
    </div>
  );
}
