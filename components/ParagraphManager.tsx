"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import { Paragraph, ParagraphCategory } from "@/types";

interface ParagraphManagerProps {
  paragraphs: Paragraph[];
  userId: string;
  onUpdate?: () => void;
}

export function ParagraphManager({
  paragraphs,
  userId,
  onUpdate,
}: ParagraphManagerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Paragraph | null>(null);
  const [category, setCategory] = useState<ParagraphCategory>("intro");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const introParagraphs = paragraphs.filter((p) => p.category === "intro");
  const experienceParagraphs = paragraphs.filter(
    (p) => p.category === "experience"
  );
  const conclusionParagraphs = paragraphs.filter(
    (p) => p.category === "conclusion"
  );

  const handleOpen = (cat: ParagraphCategory) => {
    setCategory(cat);
    setContent("");
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (paragraph: Paragraph) => {
    setEditing(paragraph);
    setCategory(paragraph.category);
    setContent(paragraph.content);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from("paragraphs")
          .update({ content, updated_at: new Date().toISOString() })
          .eq("id", editing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("paragraphs").insert({
          user_id: userId,
          category,
          content,
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editing
          ? "Paragraph updated"
          : "Paragraph added",
      });

      setOpen(false);
      setContent("");
      setEditing(null);
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save paragraph",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this paragraph?")) return;

    try {
      const { error } = await supabase
        .from("paragraphs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Paragraph deleted",
      });

      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete paragraph",
        variant: "destructive",
      });
    }
  };

  const renderCategory = (
    title: string,
    items: Paragraph[],
    cat: ParagraphCategory
  ) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {cat === "intro" || cat === "conclusion"
                ? "At least 1 required"
                : "Add multiple to choose from"}
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => handleOpen(cat)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No paragraphs yet</p>
        ) : (
          items.map((p) => (
            <div
              key={p.id}
              className="p-3 border rounded-lg bg-gray-50 space-y-2"
            >
              <p className="text-sm whitespace-pre-wrap">{p.content}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(p)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderCategory("Intro Paragraphs", introParagraphs, "intro")}
      {renderCategory(
        "Experience Paragraphs",
        experienceParagraphs,
        "experience"
      )}
      {renderCategory(
        "Conclusion Paragraphs",
        conclusionParagraphs,
        "conclusion"
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : "Add"} {category} Paragraph
            </DialogTitle>
            <DialogDescription>
              Write a paragraph that will be adapted to match job requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Enter your paragraph content..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


