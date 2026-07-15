import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // If navigated from Property Details, we might have an initial user to chat with
  useEffect(() => {
    if (location.state?.ownerId) {
      setActiveUser(location.state.ownerId);
    }
  }, [location.state]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
      if (!activeUser && res.data.length > 0 && !location.state?.ownerId) {
        setActiveUser(res.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line
  }, []);

  const fetchMessages = async () => {
    if (!activeUser) return;
    try {
      const res = await api.get(`/messages/conversation/${activeUser._id}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchMessages();
    // Simple Polling every 5 seconds for MVP "real-time" feel
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [activeUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const res = await api.post('/messages', {
        receiverId: activeUser._id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      
      // If this was a new conversation, refresh the list
      if (!conversations.find(c => c._id === activeUser._id)) {
        fetchConversations();
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0" style={{ height: '70vh' }}>
        <Row className="g-0 h-100">
          {/* Contacts Sidebar */}
          <Col md={4} className="border-end h-100 overflow-auto bg-light">
            <div className="p-3 bg-white border-bottom sticky-top">
              <h5 className="mb-0">Messages</h5>
            </div>
            <ListGroup variant="flush">
              {/* If we started a new chat not yet in history, show it at the top */}
              {activeUser && !conversations.find(c => c._id === activeUser._id) && (
                 <ListGroup.Item 
                 active
                 className="cursor-pointer"
               >
                 <strong>{activeUser.name}</strong> <small>({activeUser.userType})</small>
               </ListGroup.Item>
              )}

              {conversations.length === 0 && !activeUser && (
                <div className="p-3 text-muted text-center">No active conversations.</div>
              )}

              {conversations.map(contact => (
                <ListGroup.Item 
                  key={contact._id} 
                  action 
                  active={activeUser?._id === contact._id}
                  onClick={() => setActiveUser(contact)}
                  className="cursor-pointer"
                >
                  <strong>{contact.name}</strong> <small className="text-muted d-block">{contact.userType}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Chat Window */}
          <Col md={8} className="d-flex flex-column h-100">
            {activeUser ? (
              <>
                <div className="p-3 bg-white border-bottom shadow-sm z-1">
                  <h5 className="mb-0">{activeUser.name}</h5>
                </div>
                
                <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: '#f0f2f5' }}>
                  {messages.length === 0 ? (
                    <div className="text-center text-muted mt-5">Say hi to {activeUser.name}!</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`d-flex mb-3 ${msg.senderId === user._id ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div 
                          className={`p-3 rounded-3 shadow-sm ${msg.senderId === user._id ? 'bg-primary text-white' : 'bg-white'}`}
                          style={{ maxWidth: '75%' }}
                        >
                          {msg.content}
                          <small className={`d-block mt-1 ${msg.senderId === user._id ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-top">
                  <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <Form.Control 
                      type="text" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" variant="primary">Send</Button>
                  </Form>
                </div>
              </>
            ) : (
              <div className="d-flex h-100 flex-column align-items-center justify-content-center text-muted">
                <i className="bi bi-chat-square-dots fs-1 mb-3"></i>
                <h4>No conversation selected</h4>
                {user?.userType === 'Tenant' ? (
                  <p>To start a new chat, go to a <strong>Property's Details</strong> page and click <strong>"Chat with Owner"</strong>.</p>
                ) : (
                  <p>When a tenant messages you about a property, it will appear here.</p>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Chat;
