import React, { useState, useEffect } from 'react';
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import { Avatar, AvatarFallback } from "./components/ui/avatar"
import { Badge } from "./components/ui/badge"
import { Separator } from "./components/ui/separator"
import { 
  Clock, Users, Search, Plus, ChevronRight,
  FileText, FileSearch, Users2, Mail, Trash2,
  Star, ListTodo
} from "lucide-react"
import { meetings, currentSpace, speakerColors } from './data/meetings'
import { Meeting, Message, ActionItem } from './types'
import { MeetingListView } from './components/MeetingListView'
import { MessageList } from './components/MessageList'
import { ActionItems, SpeakerStats } from './components/Sidebar'
import { UserMenu } from './components/UserMenu'
import { cn } from './lib/utils'

export default function App() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(meetings[0]);
  const [messages, setMessages] = useState<Message[]>(() => {
    const transcript = selectedMeeting?.transcript || [];
    return transcript.map(msg => ({
      ...msg,
      isStarred: false
    }));
  });

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: '1', content: 'Review Q3 performance report', isInferred: true, isEditing: false },
    { id: '2', content: 'Analyze potential new markets', isInferred: true, isEditing: false },
    { id: '3', content: 'Custom action item', isInferred: false, isEditing: false }
  ]);

  const [newActionItem, setNewActionItem] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [hoveredDelete, setHoveredDelete] = useState<string | null>(null);
  const [speakerStats, setSpeakerStats] = useState<Record<string, number>>({
    'Alice': 35,
    'Bob': 28,
    'Charlie': 20,
    'Diana': 12,
    'Eve': 5
  });

  useEffect(() => {
    if (selectedMeeting?.transcript) {
      setMessages(selectedMeeting.transcript.map(msg => ({
        ...msg,
        isStarred: false
      })));
    }
  }, [selectedMeeting]);

  const handleMeetingSelect = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const toggleStar = (id: string) => {
    setMessages(msgs => 
      msgs.map(msg => 
        msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
  };

  const addToActionItems = (content: string) => {
    setActionItems(items => [
      ...items,
      { 
        id: crypto.randomUUID(), 
        content, 
        isInferred: false, 
        isEditing: false 
      }
    ]);
  };

  const deleteMessage = (id: string) => {
    setMessages(msgs => msgs.filter(msg => msg.id !== id));
  };

  const handleInviteMember = () => {
    if (newMemberEmail.trim()) {
      // Here you would typically make an API call to invite the member
      setNewMemberEmail('');
    }
  };

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
                  <span className="text-muted-foreground">{selectedMeeting.title}</span>
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
                    <DialogTitle className="text-foreground">Team Members</DialogTitle>
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
                              <div className="font-medium text-foreground">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                          <Badge variant="secondary">{member.role}</Badge>
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
                  <Card className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedMeeting.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>
                                {selectedMeeting.date} | {selectedMeeting.timeStart} - {selectedMeeting.timeEnd}
                              </span>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="flex items-center">
                                  <Users className="mr-2 h-4 w-4" />
                                  <span>{selectedMeeting.participants.length} Participants</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 bg-card border-border">
                                <div className="space-y-2">
                                  {selectedMeeting.participants.map((member) => (
                                    <div key={member} className="flex items-center space-x-2">
                                      <Avatar className={speakerColors[member]}>
                                        <AvatarFallback>{member[0]}</AvatarFallback>
                                      </Avatar>
                                      <span>{member}</span>
                                    </div>
                                  ))}
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
                        messages={messages}
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
                  meetings={meetings}
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
                          isEditing: false 
                        }
                      ]);
                      setNewActionItem('');
                    }
                  }}
                  onDeleteItem={(id) => {
                    setActionItems(items => items.filter(item => item.id !== id));
                  }}
                  onEditItem={(id, content) => {
                    setActionItems(items => items.map(item =>
                      item.id === id ? { ...item, content, isEditing: false } : item
                    ));
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
}