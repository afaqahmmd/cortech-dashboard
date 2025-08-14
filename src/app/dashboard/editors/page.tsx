"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { editorApi, type Editor } from "@/services/editor-api"
import { EditorTable } from "@/components/editors/editorTable"
import { AddEditorDialog } from "@/components/editors/addModal"
import { EditEditorDialog } from "@/components/editors/editModal"
import { TeamOverview } from "@/components/editors/teamOverview"

const mockEditors: Editor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Editor",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Editor",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    role: "Editor",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
]

export default function EditorManagement() {
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)
  const [editingEditor, setEditingEditor] = useState<Editor | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadEditors()
  }, [])

  const loadEditors = async () => {
    try {
      setLoading(true)
      const data = await editorApi.getEditors()
      setEditors(Array.isArray(data) ? data : [])
      setUsingMockData(false)
    } catch (error: any) {
      console.error("Failed to load editors:", error)
      setEditors(mockEditors)
      setUsingMockData(true)
      toast({
        title: "Using Demo Data",
        description: "Could not connect to backend. Showing demo editors.",
        variant: "default",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddEditor = async (editorData: { name: string; email: string; role: Editor["role"] }) => {
    if (usingMockData) {
      const newEditor: Editor = {
        id: Date.now().toString(),
        ...editorData,
      }
      setEditors((prev) => [...prev, newEditor])
      toast({
        title: "Success",
        description: "Editor added to demo data.",
      })
      return
    }

    try {
      const newEditor = await editorApi.createEditor(editorData)
      setEditors((prev) => [...prev, newEditor])
      toast({
        title: "Success",
        description: "Editor added successfully.",
      })
    } catch (error) {
      console.error("Failed to add editor:", error)
      toast({
        title: "Error",
        description: "Failed to add editor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditEditor = async (editorData: { name: string; email: string; role: Editor["role"] }) => {
    if (!editingEditor) return

    if (usingMockData) {
      setEditors((prev) =>
        prev.map((editor) => (editor.id === editingEditor.id ? { ...editor, ...editorData } : editor)),
      )
      toast({
        title: "Success",
        description: "Editor updated in demo data.",
      })
      return
    }

    try {
      const updatedEditor = await editorApi.updateEditor(editingEditor.id, editorData)
      setEditors((prev) => prev.map((editor) => (editor.id === editingEditor.id ? updatedEditor : editor)))
      toast({
        title: "Success",
        description: "Editor updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update editor:", error)
      toast({
        title: "Error",
        description: "Failed to update editor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEditor = async (editorId: string) => {
    if (usingMockData) {
      setEditors((prev) => prev.filter((editor) => editor.id !== editorId))
      toast({
        title: "Success",
        description: "Editor removed from demo data.",
      })
      return
    }

    try {
      await editorApi.deleteEditor(editorId)
      setEditors((prev) => prev.filter((editor) => editor.id !== editorId))
      toast({
        title: "Success",
        description: "Editor removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete editor:", error)
      toast({
        title: "Error",
        description: "Failed to delete editor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (editor: Editor) => {
    setEditingEditor(editor)
    setIsEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditingEditor(null)
    setIsEditDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading editors...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Editor Management</h1>
            <p className="text-muted-foreground">
              Manage your editorial team members and their roles
              {usingMockData && " (Demo Mode)"}
            </p>
          </div>
          <AddEditorDialog onAdd={handleAddEditor} />
        </div>

        <TeamOverview editors={editors} />
        <EditorTable editors={editors} onEdit={openEditDialog} onDelete={handleDeleteEditor} />

        <EditEditorDialog
          editor={editingEditor}
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          onSave={handleEditEditor}
        />
      </div>
    </div>
  )
}
