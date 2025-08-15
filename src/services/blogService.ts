import api from "@/lib/api"

import type { Editor, CreateEditorData } from "@/types/editor"

export const editorApi = {
  getBlogs: async (): Promise<Editor[]> => {
    const response = await api.get("/api/v1/blogs/")
    return response.data
  },

  createBlog: async (data: CreateEditorData): Promise<Editor> => {
    const response = await api.post("/api/v1/blogs/", data)
    return response.data
  },

  updateBlog: async (id: string, data: CreateEditorData): Promise<Editor> => {
    const response = await api.put(`/api/v1/blogs/${id}/`, data)
    return response.data
  },

  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/blogs/${id}/`)
  },
}
