import { RequestItem } from "./RequestItem";
import { HistoryEmptyState } from "./HistoryEmptyState";
import type { UserSongRequest } from "@/hooks/useUserHistory";

interface RequestListProps {
  requests: UserSongRequest[];
  handleReorder: (request: UserSongRequest) => void;
  handleSaveSong: (request: UserSongRequest) => void;
  isSongSaved: (songName: string, artistName: string) => boolean;
  goToFirstRequest: () => void;
}

export const RequestList = ({ requests, handleReorder, handleSaveSong, isSongSaved, goToFirstRequest }: RequestListProps) => {
  if (requests.length === 0) {
    return <HistoryEmptyState type="history" onActionClick={goToFirstRequest} />;
  }

  return (
    <div className="grid gap-4">
      {requests.map((request, index) => (
        <RequestItem
          key={request.id}
          request={request}
          index={index}
          handleReorder={handleReorder}
          handleSaveSong={handleSaveSong}
          isSongSaved={isSongSaved}
        />
      ))}
    </div>
  );
};
