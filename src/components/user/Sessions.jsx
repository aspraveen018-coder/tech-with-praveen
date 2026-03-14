import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useData } from '../../hooks/useData';
import {
  FaVideo,
  FaCalendar,
  FaClock,
  FaUsers,
  FaCertificate,
  FaRegCalendarAlt,
  FaHeart,
  FaBookmark,
  FaExternalLinkAlt
} from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';

const SessionsContainer = styled.section`
  padding: 80px 0;
  background: #030614;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #a0aec0;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
`;

const SessionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const SessionCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

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
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);

    &:before {
      opacity: 0.2;
    }
  }
`;

const SessionBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${props => props.upcoming ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 107, 107, 0.2)'};
  color: ${props => props.upcoming ? '#00d2ff' : '#ff6b6b'};
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1;
`;

const SessionIcon = styled.div`
  width: 70px;
  height: 70px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: #00d2ff;
  margin-bottom: 20px;
`;

const SessionTitle = styled.h3`
  font-size: 1.3rem;
  color: white;
  margin-bottom: 10px;
  padding-right: 80px;
`;

const SessionDescription = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
  }
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
  font-size: 0.9rem;
  background: rgba(0, 210, 255, 0.05);
  padding: 5px 12px;
  border-radius: 20px;

  svg {
    color: #00d2ff;
  }
`;

const Topic = styled.span`
  display: inline-block;
  padding: 5px 15px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  color: #00d2ff;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const FeaturesList = styled.div`
  margin: 15px 0;
  padding: 15px 0;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
  flex: 1;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  margin-bottom: 10px;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
  }
`;

const RegisterButton = styled(motion.a)`
  display: inline-block;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin: 15px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const ActionButtonsContainer = styled.div`
  margin-top: auto;
  padding-top: 15px;
`;

const Announcement = styled(motion.div)`
  text-align: center;
  margin-top: 50px;
  padding: 30px;
  background: rgba(10, 20, 40, 0.6);
  border-radius: 15px;
  border: 1px solid rgba(0, 210, 255, 0.2);

  h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    color: #a0aec0;
    margin-bottom: 20px;
  }
`;

const TopicTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const TopicTag = styled.span`
  padding: 8px 20px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  color: #00d2ff;
  font-size: 0.9rem;
`;

const Sessions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { sessions } = useData();

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  const topics = [
    'Cloud Computing',
    'DevOps',
    'Python',
    'Web Development',
    'Resume Building',
    'Interview Preparation'
  ];

  return (
    <SessionsContainer id="sessions" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Live Tech Sessions
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join our live sessions with Praveen and industry experts
        </Subtitle>

        <SessionsGrid>
          {sessions.map((session, index) => (
            <SessionCard
              key={session.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <SessionBadge upcoming={isUpcoming(session.date)}>
                {isUpcoming(session.date) ? 'Upcoming' : 'Past Session'}
              </SessionBadge>
              
              <SessionIcon>
                <FaVideo />
              </SessionIcon>

              <SessionTitle>{session.title}</SessionTitle>
              <SessionDescription>{session.description}</SessionDescription>

              <StatsRow>
                <Stat>
                  <FaHeart /> {session.likes || 0}
                </Stat>
                <Stat>
                  <FaBookmark /> {session.saves || 0}
                </Stat>
              </StatsRow>

              <SessionMeta>
                <MetaItem>
                  <FaCalendar />
                  {new Date(session.date).toLocaleDateString()}
                </MetaItem>
                <MetaItem>
                  <FaClock />
                  {session.time}
                </MetaItem>
              </SessionMeta>

              <Topic>{session.topic}</Topic>

              <FeaturesList>
                <Feature>
                  <FaUsers /> Interactive session with Q&A
                </Feature>
                <Feature>
                  <FaCertificate /> Free certificate of participation
                </Feature>
                <Feature>
                  <FaRegCalendarAlt /> Learning materials included
                </Feature>
              </FeaturesList>

              <RegisterButton
                href={session.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Register Now <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
              </RegisterButton>

              <ActionButtonsContainer>
                <ActionButtons 
                  item={session} 
                  type="session"
                />
              </ActionButtonsContainer>
            </SessionCard>
          ))}
        </SessionsGrid>

        <Announcement
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3>🎯 Topics We Cover</h3>
          <p>Join us for live sessions on:</p>
          <TopicTags>
            {topics.map((topic, index) => (
              <TopicTag key={index}>{topic}</TopicTag>
            ))}
          </TopicTags>
        </Announcement>
      </Content>
    </SessionsContainer>
  );
};

export default Sessions;