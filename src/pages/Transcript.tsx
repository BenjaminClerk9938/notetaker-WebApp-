import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  Clock,
  Users,
  Search,
  Plus,
  ChevronRight,
  FileText,
  FileSearch,
  Users2,
  Mail,
  Trash2,
  Star,
  ListTodo,
} from "lucide-react";
import { currentSpace, speakerColors } from "../data/meetings";
import { Meeting, Message, ActionItem } from "../types";
import { MeetingListView } from "../components/MeetingListView";
import { MessageList } from "../components/MessageList";
import { ActionItems, SpeakerStats } from "../components/Sidebar";
import { UserMenu } from "../components/UserMenu";
import { cn } from "../lib/utils";
import { fetchMeetings, joinMeeting } from "../apis/meeting";
import { Badge } from "@mui/material";

const Transcript = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>();
  const [user_name, setUser_name] = useState<string | null>();
  const [meetings, setMeetings] = useState<Meeting[] | null>();
  const [socket, setSocket] = useState<any | null>();
  const [transcripts, setTranscripts] = useState([]);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "",
      speaker: "",
      timestamp: "",
      content: "",
      isStarred: false,
      isComplete: true,
    },
  ]);

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: "1",
      content: "Review Q3 performance report",
      isInferred: true,
      isEditing: false,
    },
    {
      id: "2",
      content: "Analyze potential new markets",
      isInferred: true,
      isEditing: false,
    },
    {
      id: "3",
      content: "Custom action item",
      isInferred: false,
      isEditing: false,
    },
  ]);

  const [newActionItem, setNewActionItem] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [hoveredDelete, setHoveredDelete] = useState<string | null>(null);
  const [speakerStats, setSpeakerStats] = useState<Record<string, number>>({
    Alice: 35,
    Bob: 28,
    Charlie: 20,
    Diana: 12,
    Eve: 5,
  });
  const [badgeColor, setbadgeColor] = useState<string>("#fff");

  useEffect(() => {
    setInterval(() => {
      const fetchMeetingsData = async () => {
        const username = localStorage.getItem("username");
        setUser_name(username);
        if (!username) {
          window.location.href = "/login";
          return;
        }
        const fetchedMeetings = await fetchMeetings(username);
        setMeetings(fetchedMeetings); // Set loading to false after fetching
      };

      fetchMeetingsData();
    }, 1000);
  }, []);
  const handleMeetingSelect = (meeting: Meeting) => {
    const joinMeetingData = async () => {
      if (!user_name) {
        return;
      }
      await joinMeeting(meeting.id, user_name);
    };
    joinMeetingData();

    setSelectedMeeting(meeting);
  };

  const toggleStar = (id: string) => {
    setMessages(
      (msgs) =>
        msgs &&
        msgs.map((msg) =>
          msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
        )
    );
  };

  const addToActionItems = (content: string) => {
    setActionItems((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        content,
        isInferred: false,
        isEditing: false,
      },
    ]);
  };

  const deleteMessage = (id: string) => {
    setMessages((msgs) => msgs && msgs.filter((msg) => msg.id !== id));
  };

  const handleInviteMember = () => {
    if (newMemberEmail.trim()) {
      // Here you would typically make an API call to invite the member
      setNewMemberEmail("");
    }
  };

  useEffect(() => {
    if (!selectedMeeting || !user_name) return;

    // Construct WebSocket URL
    const wsUrl = `wss://api.stru.ai/ws/meetings/${selectedMeeting.id}/transcript?user=${user_name}`;
    let ws: any;
    let reconnectInterval: any;

    const initializeWebSocket = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        setSocket(ws);
        if (reconnectInterval) clearInterval(reconnectInterval); // Clear reconnection attempts if connected
      };

      ws.onmessage = (event: any) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Received message:", message);

          if (message.type === "history") {
            setMessages(message.data);
          } else if (message.type === "stream") {
            setMessages((prevMessages) => {
              if (
                prevMessages.length > 0 &&
                !prevMessages[prevMessages.length - 1].isComplete
              ) {
                // If the last message is incomplete, assume this chunk is part

                return [
                  ...prevMessages.slice(0, -1), // Keep previous messages
                  message.data.message,
                ];
              } else {
                // Otherwise, treat it as a new message
                return [...prevMessages, message.data.message];
              }
            });
          } else if (message.type === "status") {
            if (message.data.is_active) setbadgeColor("#91ff91");
            else setbadgeColor("#ff9191");
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setError("Error parsing incoming data");
        }
      };

      ws.onerror = (event: any) => {
        console.error("WebSocket error:", event);
        setError("WebSocket error occurred");
      };

      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setSocket(null);
        // Attempt reconnection if not manually closed
        if (!reconnectInterval) {
          reconnectInterval = setInterval(() => {
            console.log("Reconnecting to WebSocket...");
            initializeWebSocket();
          }, 5000); // Attempt reconnection every 5 seconds
        }
      };
    };

    initializeWebSocket();

    // Cleanup function to close WebSocket and stop reconnection
    return () => {
      if (ws) ws.close();
      if (reconnectInterval) clearInterval(reconnectInterval);
    };
  }, [selectedMeeting, user_name]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Side Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">Spaces</h2>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Users2 className="mr-2" />
            Product Team
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users2 className="mr-2" />
            Engineering
          </Button>
          <Button variant="ghost" className="w-full justify-start text-primary">
            <Plus className="mr-2" />
            Create Space
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Navigation */}
        <nav className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold">MeetScribe</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Button
                variant="ghost"
                className="text-muted-foreground px-4 py-2 h-auto hover:bg-secondary"
                onClick={() => setSelectedMeeting(null)}
              >
                Product Team
              </Button>
              {selectedMeeting && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {selectedMeeting.name}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    {currentSpace.members.length} Members
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">
                      Team Members
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Email address"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="bg-background"
                      />
                      <Button onClick={handleInviteMember}>
                        <Mail className="mr-2 h-4 w-4" />
                        Invite
                      </Button>
                    </div>
                    <Separator className="bg-border" />
                    <div className="space-y-2">
                      {currentSpace.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className={speakerColors[member.name]}>
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground">
                                {member.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {member.email}
                              </div>
                            </div>
                          </div>
                          {/* <Badge variant="secondary">{member.role}</Badge> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <UserMenu />
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-[1fr_350px] gap-8">
            {/* Main Column */}
            <div className="min-w-0">
              {selectedMeeting ? (
                <>
                  {/* Meeting Header */}
                  <Badge
                    // color="success"
                    sx={{
                      width: "100%",
                      "& .MuiBadge-badge": {
                        top: 25, // Adjust the top position
                        right: 25, // Adjust the right position
                        backgroundColor: badgeColor, // Set badge background color
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
                    <Card className="mb-4" style={{ width: "100%" }}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{selectedMeeting.name}</CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>
                                  {selectedMeeting.date} |{" "}
                                  {new Date(
                                    selectedMeeting.start_time
                                  ).toLocaleTimeString()}{" "}
                                  -{" "}
                                  {new Date(
                                    selectedMeeting.end_time
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center"
                                  >
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>
                                      {selectedMeeting.participants.length}{" "}
                                      Participants
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-card border-border">
                                  <div className="space-y-2">
                                    {selectedMeeting.participants.map(
                                      (member) => (
                                        <div
                                          key={member}
                                          className="flex items-center space-x-2"
                                        >
                                          <Avatar
                                            className={speakerColors[member]}
                                          >
                                            <AvatarFallback>
                                              {member[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span>{member}</span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <span className="text-sm text-muted-foreground">
                                Recorded by MeetScribe AI
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="secondary" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Minutes
                          </Button>
                          <Button variant="secondary" size="sm">
                            <FileSearch className="mr-2 h-4 w-4" />
                            Detailed Summary
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  </Badge>

                  {/* Transcript */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Transcript</CardTitle>
                      <div className="w-64">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search..." className="pl-8" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MessageList
                        messages={messages || []}
                        hoveredDelete={hoveredDelete}
                        onStar={toggleStar}
                        onAddToActionItems={addToActionItems}
                        onDelete={deleteMessage}
                        onHoverDelete={setHoveredDelete}
                      />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <MeetingListView
                  meetings={meetings || []}
                  onMeetingSelect={handleMeetingSelect}
                />
              )}
            </div>

            {/* Sidebar */}
            {selectedMeeting && (
              <div className="space-y-8">
                <ActionItems
                  items={actionItems}
                  newItem={newActionItem}
                  onNewItemChange={setNewActionItem}
                  onAddItem={() => {
                    if (newActionItem.trim()) {
                      setActionItems([
                        ...actionItems,
                        {
                          id: crypto.randomUUID(),
                          content: newActionItem,
                          isInferred: false,
                          isEditing: false,
                        },
                      ]);
                      setNewActionItem("");
                    }
                  }}
                  onDeleteItem={(id) => {
                    setActionItems((items) =>
                      items.filter((item) => item.id !== id)
                    );
                  }}
                  onEditItem={(id, content) => {
                    setActionItems((items) =>
                      items.map((item) =>
                        item.id === id
                          ? { ...item, content, isEditing: false }
                          : item
                      )
                    );
                  }}
                  onSetEditing={setActionItems}
                />
                <SpeakerStats stats={speakerStats} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcript;
