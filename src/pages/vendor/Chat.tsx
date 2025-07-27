import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Send, 
  MessageCircle, 
  Search,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import { api, Conversation, Message, User } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VendorChat = () => {
  const { supplierId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
      
      // If supplierId is provided, find and select that conversation
      if (supplierId) {
        const conversation = data.find(conv => 
          conv.participants.some(p => p.id === supplierId)
        );
        if (conversation) {
          setSelectedConversation(conversation);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await api.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      const message = await api.sendMessage(selectedConversation.id, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: message, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getOtherParticipant = (conversation: Conversation): User | undefined => {
    return conversation.participants.find(p => p.id !== user?.id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="vendor">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your suppliers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations found</p>
                    <p className="text-sm">Start a conversation with a supplier</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => {
                      const otherParticipant = getOtherParticipant(conversation);
                      const isSelected = selectedConversation?.id === conversation.id;
                      
                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            isSelected ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={otherParticipant?.image} />
                              <AvatarFallback>
                                {otherParticipant?.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">
                                  {otherParticipant?.name}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              {conversation.lastMessage && (
                                <div className="flex items-center gap-1 mt-1">
                                  <p className="text-xs text-muted-foreground truncate">
                                    {conversation.lastMessage.content}
                                  </p>
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(conversation.lastMessage.createdAt)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getOtherParticipant(selectedConversation)?.image} />
                      <AvatarFallback>
                        {getOtherParticipant(selectedConversation)?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {getOtherParticipant(selectedConversation)?.name}
                      </CardTitle>
                      <CardDescription>
                        {getOtherParticipant(selectedConversation)?.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-[500px]">
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isOwnMessage = message.senderId === user?.id;
                            
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg p-3 ${
                                    isOwnMessage
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className={`flex items-center gap-1 mt-1 ${
                                    isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                  }`}>
                                    <span className="text-xs">
                                      {formatTime(message.createdAt)}
                                    </span>
                                    {isOwnMessage && (
                                      message.isRead ? (
                                        <CheckCheck className="h-3 w-3" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                    
                    <Separator />
                    
                    {/* Message Input */}
                    <div className="p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={isSending}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isSending}
                          size="icon"
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[500px]">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorChat;