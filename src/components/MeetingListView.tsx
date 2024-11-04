import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, Users } from "lucide-react";
import { Meeting } from "../types";
import { speakerColors } from "../data/meetings";
import { fetchMeetings } from "../apis/meeting";
import { Badge } from "@mui/material";

interface MeetingListViewProps {
  meetings: Meeting[];
  onMeetingSelect: (meeting: Meeting) => void;
}

export function MeetingListView({
  meetings,
  onMeetingSelect,
}: MeetingListViewProps) {
  const username = localStorage.getItem("username");
  console.log(username);
  useEffect(() => {
    // if (username) setInterval(() => fetchMeetings(username), 1000);
    // fetchMeetings();
  }, [username]);
  console.log(meetings);
  // const [badgeColor, setbadgeColor] = useState<string>("#fff");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map((meeting) => (
        <Badge
          // color="success"
          sx={{
            width: "100%",
            "& .MuiBadge-badge": {
              top: "5%", // Adjust the top position
              right: "5%", // Adjust the right position
              backgroundColor: meeting.is_active ? "#91ff91" : "#ff9191", // Set badge background color
              color: "#FFFFFF", // Set badge text color
              boxShadow: `0 0 0 rgba(217, 255, 211, 0.4)`,
              animation: "pulse 1.5s infinite", // Apply pulse animation

              // Optional: Adjust badge size for better visibility
              minWidth: "14px",
              height: "14px",
              borderRadius: "50%", // Disable default transform if you need exact positioning
            },
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
                boxShadow: `0 0 0 0 rgba(217, 255, 211, 0.4)`,
              },
              "70%": {
                transform: "scale(1.1)",
                boxShadow: `0 0 0 10px rgba(217, 255, 211, 0)`,
              },
              "100%": {
                transform: "scale(1)",
                boxShadow: `0 0 0 0 rgba(217, 255, 211, 0)`,
              },
            },
          }}
          badgeContent=""
          // variant="dot"
        >
          <Card
            key={meeting.id}
            className="cursor-pointer hover:bg-secondary/50 transition-colors w-full"
            onClick={() => onMeetingSelect(meeting)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{meeting.name}</CardTitle>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {meeting.date} |{" "}
                    {new Date(meeting.start_time).toLocaleTimeString()} -{" "}
                    {new Date(meeting.end_time).toLocaleTimeString()}
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
        </Badge>
      ))}
    </div>
  );
}
