import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, Users } from "lucide-react";
import { Meeting } from "../types";
import { speakerColors } from "../data/meetings";

interface MeetingListViewProps {
  meetings: Meeting[];
  onMeetingSelect: (meeting: Meeting) => void;
}

export function MeetingListView({
  meetings,
  onMeetingSelect,
}: MeetingListViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map((meeting) => (
        <Card
          key={meeting.id}
          className="cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => onMeetingSelect(meeting)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{meeting.name}</CardTitle>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {meeting.date} | {meeting.start_time} - {meeting.end_time}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{meeting.participants.length} Participants</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 4).map((participant, i) => (
                <Avatar
                  key={i}
                  className={`border-2 border-background ${speakerColors[participant]}`}
                >
                  <AvatarFallback>{participant[0]}</AvatarFallback>
                </Avatar>
              ))}
              {meeting.participants.length > 4 && (
                <Avatar className="border-2 border-background bg-secondary">
                  <AvatarFallback>
                    +{meeting.participants.length - 4}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
