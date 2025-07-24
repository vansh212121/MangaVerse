// components/EmptyState.jsx
import { Button } from "@/components/ui/button";


const EmptyState = ({ message = "No manga found", onRetry }) => {
  return (
    <div className="text-center py-12">
      <img
        src="/1.png"
        alt="No manga"
        className="mx-auto w-24 h-24 mb-4"
      />
      <p className="text-lg text-muted-foreground mb-2">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
