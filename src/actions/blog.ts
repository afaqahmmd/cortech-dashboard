"use server";

import { revalidatePath } from "next/cache";

type Status = "Published" | "Draft" | "Pending Review";

// Simulate database fetching for demo,
// will be removed after backend connection with frontend

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  status: "Published" | "Draft" | "Pending Review";
}

// Generate mock blog posts for pagination
const generateDummyBlogPosts = (count: number): BlogPost[] => {
  const posts: BlogPost[] = [];

  const statuses: Status[] = ["Published", "Draft", "Pending Review"];
  for (let i = 1; i <= count; i++) {
    posts.push({
      id: String(i),
      title: `Blog Post Title ${i}`,
      description: `This is a short description for blog post number ${i}. It covers various topics.`,
      content: `Full content for blog post ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return posts;
};

const dummyBlogPosts: BlogPost[] = generateDummyBlogPosts(20); // Generate 35 dummy posts

export async function createBlogPost(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const status = formData.get("status") as BlogPost["status"];

  if (!title || !content || !status) {
    return { success: false, message: "All fields are required." };
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // In a real app, you'd save this to a database
  const newPost: BlogPost = {
    id: String(dummyBlogPosts.length + 1), // Simple ID generation
    title,
    description:
      content.substring(0, Math.min(content.length, 100)) +
      (content.length > 100 ? "..." : ""),
    content,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    status,
  };
  dummyBlogPosts.unshift(newPost); // Would push to a real array/DB, unshift to show at top

  revalidatePath("/dashboard/blogs"); // Revalidate the blogs page to show new data (if using a real DB)

  return {
    success: true,
    message: `Blog post "${title}" created successfully!`,
  };
}

export async function updateBlogPost(prevState: any, formData: FormData) {
  console.log("inside update blog post function")
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const status = formData.get("status") as BlogPost["status"];

  if (!id || !title || !content || !status) {
    return { success: false, message: "All fields are required." };
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you'd find and update this in your database
  const existingPostIndex = dummyBlogPosts.findIndex((post) => post.id === id);
  if (existingPostIndex !== -1) {
    // dummyBlogPosts[existingPostIndex] = {
    //   ...dummyBlogPosts[existingPostIndex],
    //   title,
    //   description: content.substring(0, Math.min(content.length, 100)) + (content.length > 100 ? "..." : ""),
    //   content,
    //   status,
    // };
  } else {
    return { success: false, message: "Blog post not found." };
  }

  revalidatePath("/dashboard/blogs"); // Revalidate the blogs page to show updated data (if using a real DB)

  return {
    success: true,
    message: `Blog post "${title}" updated successfully!`,
  };
}

export async function getPaginatedBlogPosts({
  page = 1,
  limit = 9,
}: {
  page?: number;
  limit?: number;
}) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = dummyBlogPosts.slice(startIndex, endIndex);
  const totalPosts = dummyBlogPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    posts: paginatedPosts,
    totalPosts,
    totalPages,
    currentPage: page,
    limit,
  };
}
