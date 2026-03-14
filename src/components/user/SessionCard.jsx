import React from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaCalendar, FaClock } from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';

const Card = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${props => props.upcoming ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 107, 107, 0.2)'};
  color: ${props => props.upcoming ? '#00d2ff' : '#ff6b6b'};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Icon = styled.div`
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

const Title = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const Meta = styled.div`
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
  margin-bottom: 15px;
`;

const RegisterButton = styled.a`
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 10px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const SessionCard = ({ session }) => {
  const isUpcoming = new Date(session.date) >= new Date();

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Badge upcoming={isUpcoming}>
        {isUpcoming ? 'Upcoming' : 'Past'}
      </Badge>

      <Icon>
        <FaVideo />
      </Icon>

      <Title>{session.title}</Title>
      <Description>{session.description}</Description>

      <Topic>{session.topic}</Topic>

      <Meta>
        <MetaItem>
          <FaCalendar /> {new Date(session.date).toLocaleDateString()}
        </MetaItem>
        <MetaItem>
          <FaClock /> {session.time}
        </MetaItem>
      </Meta>

      <RegisterButton href={session.registrationLink} target="_blank">
        Register Now
      </RegisterButton>

      <ActionButtons 
        item={session} 
        type="session"
      />
    </Card>
  );
};

export default SessionCard;