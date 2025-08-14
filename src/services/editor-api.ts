import api from "@/lib/api"

export interface Editor {
  id: string
  name: string
  email: string
  role: "Editor"
}

export interface CreateEditorData {
  name: string
  email: string
  role: Editor["role"]
}

export const editorApi = {
  getEditors: async (): Promise<Editor[]> => {
    const response = await api.get("/editors/")
    return response.data
  },

  createEditor: async (data: CreateEditorData): Promise<Editor> => {
    const response = await api.post("/editors/", data)
    return response.data
  },

  updateEditor: async (id: string, data: CreateEditorData): Promise<Editor> => {
    const response = await api.put(`/editors/${id}/`, data)
    return response.data
  },

  deleteEditor: async (id: string): Promise<void> => {
    await api.delete(`/editors/${id}/`)
  },
}
