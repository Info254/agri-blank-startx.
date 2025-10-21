import { CreateDiscussionDialog } from "./CreateDiscussionDialog";

interface DiscussionHeaderProps {
  onDiscussionCreated?: () => void;
}

export const DiscussionHeader = ({ onDiscussionCreated }: DiscussionHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quality Control Discussions</h1>
        <p className="text-muted-foreground mt-2">
          Join the conversation on agricultural quality standards and challenges
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <CreateDiscussionDialog onDiscussionCreated={onDiscussionCreated} />
      </div>
    </div>
  );
};
