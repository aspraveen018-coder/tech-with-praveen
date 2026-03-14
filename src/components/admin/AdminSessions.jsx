import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaVideo,
  FaCalendar,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import styled from 'styled-components';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
`;

const AddButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const SessionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const SessionCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.1;
  }
`;

const SessionBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 12px;
  background: ${props => props.upcoming ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 107, 107, 0.2)'};
  color: ${props => props.upcoming ? '#00d2ff' : '#ff6b6b'};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const SessionIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #00d2ff;
  margin-bottom: 15px;
`;

const SessionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const SessionDescription = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const SessionMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 0.85rem;

  svg {
    color: #00d2ff;
  }
`;

const Topic = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  color: #00d2ff;
  font-size: 0.75rem;
  margin-right: 5px;
  margin-bottom: 5px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &.edit {
    background: rgba(0, 210, 255, 0.2);
    color: #00d2ff;
    
    &:hover {
      background: rgba(0, 210, 255, 0.3);
    }
  }

  &.delete {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    
    &:hover {
      background: rgba(255, 107, 107, 0.3);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }

  option {
    background: #0a0f1f;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 25px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled(motion.button)`
  padding: 12px 25px;
  background: transparent;
  border: 2px solid #a0aec0;
  color: #a0aec0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
`;

const AdminSessions = () => {
  const { sessions, addSession, updateSession, deleteSession } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    topic: 'Cloud',
    registrationLink: ''
  });

  const topics = [
    'Cloud Computing',
    'DevOps',
    'Python',
    'Web Development',
    'Resume Building',
    'Interview Preparation',
    'AI/ML',
    'Cybersecurity'
  ];

  const handleOpenModal = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title,
        description: session.description,
        date: session.date,
        time: session.time,
        topic: session.topic,
        registrationLink: session.registrationLink
      });
    } else {
      setEditingSession(null);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        topic: 'Cloud',
        registrationLink: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.registrationLink) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingSession) {
      updateSession(editingSession.id, formData);
    } else {
      addSession(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(id);
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  return (
    <Container>
      <Header>
        <Title>Manage Live Sessions</Title>
        <AddButton
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Schedule New Session
        </AddButton>
      </Header>

      <SessionsGrid>
        {sessions.map((session, index) => (
          <SessionCard
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SessionBadge upcoming={isUpcoming(session.date)}>
              {isUpcoming(session.date) ? 'Upcoming' : 'Past'}
            </SessionBadge>

            <SessionIcon>
              <FaVideo />
            </SessionIcon>

            <SessionTitle>{session.title}</SessionTitle>
            <SessionDescription>{session.description}</SessionDescription>

            <SessionMeta>
              <MetaItem>
                <FaCalendar /> {new Date(session.date).toLocaleDateString()}
              </MetaItem>
              <MetaItem>
                <FaClock /> {session.time}
              </MetaItem>
            </SessionMeta>

            <Topic>{session.topic}</Topic>

            <CardActions>
              <ActionButton
                className="edit"
                onClick={() => handleOpenModal(session)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(session.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Delete
              </ActionButton>
              {session.registrationLink && (
                <ActionButton
                  className="edit"
                  as="a"
                  href={session.registrationLink}
                  target="_blank"
                  style={{ textDecoration: 'none' }}
                >
                  <FaExternalLinkAlt /> Link
                </ActionButton>
              )}
            </CardActions>
          </SessionCard>
        ))}
      </SessionsGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSession ? 'Edit Session' : 'Schedule New Session'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Session Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to Kubernetes"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what will be covered in this session..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Topic</Label>
            <Select name="topic" value={formData.topic} onChange={handleInputChange}>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Time</Label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Registration Link</Label>
            <Input
              type="url"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleInputChange}
              placeholder="https://zoom.us/meeting/..."
              required
            />
          </FormGroup>

          <FormActions>
            <CancelButton
              type="button"
              onClick={handleCloseModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave /> {editingSession ? 'Update' : 'Schedule'}
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminSessions;