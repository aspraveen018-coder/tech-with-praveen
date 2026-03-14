import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaInstagram, 
  FaTelegram, 
  FaYoutube, 
  FaLinkedin, 
  FaDiscord, 
  FaTwitter,
  FaUsers,
  FaComments,
  FaShare
} from 'react-icons/fa';
import styled from 'styled-components';
import { useData } from '../../hooks/useData';

const CommunityContainer = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #0a0f1f 0%, #030614 100%);
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

const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
`;

const CommunityCard = styled(motion.a)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00d2ff, transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.15);

    &:before {
      transform: translateX(100%);
    }
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.bg || 'rgba(0, 210, 255, 0.1)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: ${props => props.color || '#00d2ff'};
  margin: 0 auto 20px;
  transition: all 0.3s ease;

  ${CommunityCard}:hover & {
    transform: scale(1.1);
  }
`;

const PlatformName = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const MemberCount = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const JoinButton = styled(motion.span)`
  display: inline-block;
  margin-top: 20px;
  padding: 8px 25px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 25px;
  color: #00d2ff;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;

  ${CommunityCard}:hover & {
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    color: white;
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 50px;
  padding: 40px;
  background: rgba(10, 20, 40, 0.4);
  border-radius: 20px;
  border: 1px solid rgba(0, 210, 255, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.h3`
  font-size: 2rem;
  color: #00d2ff;
  margin-bottom: 10px;
`;

const StatLabel = styled.p`
  color: #a0aec0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Community = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { community } = useData();

  const platforms = [
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: community.instagram,
      color: '#E4405F',
      bg: 'rgba(228, 64, 95, 0.1)',
      members: '11K+'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram />,
      url: community.telegram,
      color: '#0088cc',
      bg: 'rgba(0, 136, 204, 0.1)',
      members: '650+'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      url: community.youtube,
      color: '#FF0000',
      bg: 'rgba(255, 0, 0, 0.1)',
      members: '3.5K+'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: community.linkedin,
      color: '#0077B5',
      bg: 'rgba(0, 119, 181, 0.1)',
      members: '1.1K+'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: '#', // Replace with actual Twitter URL when available
      color: '#1DA1F2',
      bg: 'rgba(29, 161, 242, 0.1)',
      members: '0'
    }
  ];

  const stats = [
    { number: '11K+', label: 'Community Members', icon: <FaUsers /> },
    { number: '5K+', label: 'Daily Active Users', icon: <FaComments /> },
    { number: '12+', label: 'Content Shares', icon: <FaShare /> }
  ];

  return (
    <CommunityContainer id="community" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Join Our Community
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connect with thousands of learners and tech enthusiasts
        </Subtitle>

        <CommunityGrid>
          {platforms.map((platform, index) => (
            <CommunityCard
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <CardIcon color={platform.color} bg={platform.bg}>
                {platform.icon}
              </CardIcon>
              <PlatformName>{platform.name}</PlatformName>
              <MemberCount>
                <FaUsers /> {platform.members} members
              </MemberCount>
              <JoinButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </JoinButton>
            </CommunityCard>
          ))}
        </CommunityGrid>

        <StatsContainer
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>
                {stat.icon} {stat.label}
              </StatLabel>
            </StatItem>
          ))}
        </StatsContainer>
      </Content>
    </CommunityContainer>
  );
};

export default Community;