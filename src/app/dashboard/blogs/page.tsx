"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState } from "react";
import { updateBlogPost, getPaginatedBlogPosts } from "@/actions/blog";
import { toast } from "@/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  status: "Published" | "Draft" | "Pending Review";
}

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;
  const postsPerPage = 6; // Number of posts per page

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateState, updateFormAction, isUpdatePending] = useActionState(
    updateBlogPost,
    null
  );

  // Fetch paginated blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { posts, totalPages: fetchedTotalPages } =
        await getPaginatedBlogPosts({
          page: currentPage,
          limit: postsPerPage,
        });
      setBlogPosts(posts);
      setTotalPages(fetchedTotalPages);
      setLoading(false);
    };
    fetchPosts();
  }, [currentPage, postsPerPage]); 

  // Handle update 
  useEffect(() => {
    console.log("useeffect called")
    if (updateState?.success) {
      console.log("update successfull")
      toast({
        title: "Success!",
        description: updateState.message,
        variant: "default",
      });
      setIsModalOpen(false); // Close modal on success
      // Re-fetch posts to reflect changes (update state directly or revalidate)
      const fetchPosts = async () => {
        const { posts, totalPages: fetchedTotalPages } =
          await getPaginatedBlogPosts({
            page: currentPage,
            limit: postsPerPage,
          });
        setBlogPosts(posts);
        setTotalPages(fetchedTotalPages);
      };
      fetchPosts();
    } else if (updateState?.success === false) {
      console.log("else if, false")
      toast({
        title: "Error!",
        description: updateState.message,
        variant: "destructive",
      });
    }
    else{
      console.log("error")
    }
  }, [updateState, currentPage, postsPerPage]);

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/dashboard/blogs?${params.toString()}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Number of page links to show directly
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href="#" onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">All Blogs</h1>
        <Button asChild size="sm" variant="blue">
          <Link href="/dashboard/blogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Blog Post
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className="text-center text-muted-foreground">
          Loading blog posts...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {post.title}
                      <Badge
                        variant={
                          post.status === "Published" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Published on: {post.date}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(post)}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No blog posts found.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage <= 1}
                    tabIndex={currentPage <= 1 ? -1 : undefined}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={currentPage >= totalPages}
                    tabIndex={currentPage >= totalPages ? -1 : undefined}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {editingPost && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
              <DialogDescription>
                Make changes to your blog post here. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <form action={updateFormAction} className="grid gap-4 py-4">
              <input type="hidden" name="id" value={editingPost.id} />
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingPost.title}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  defaultValue={editingPost.content}
                  placeholder="Write your blog post content here..."
                  rows={10}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  name="status"
                  defaultValue={editingPost.status}
                  required
                >
                  <SelectTrigger id="edit-status" className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Pending Review">
                      Pending Review
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant={"blue"} type="submit" disabled={isUpdatePending}>
                  {isUpdatePending ? "Saving Changes..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
