import { Button } from "@/components/ui/button";

const prompts = [
  "How do I register to vote?",
  "What ID documents are accepted?",
  "How can I find my polling station?",
  "What are the rights of a voter?",
];

export function QuickPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {prompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="border-white/10 bg-white/5 hover:bg-primary/20 hover:text-white hover:border-primary/50 text-muted-foreground rounded-full"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
