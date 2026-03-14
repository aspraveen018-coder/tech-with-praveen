import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useData } from '../../hooks/useData';
import { 
  FaCertificate, 
  FaRobot, 
  FaCloud, 
  FaRoad, 
  FaPython, 
  FaCode,
  FaLink,
  FaHeart,
  FaBookmark
} from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';

const ResourcesContainer = styled.section`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const ResourceCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #00d2ff;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
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

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
  flex: 1;
`;

const LinkItem = styled.a`
  color: #a0aec0;
  text-decoration: none;
  padding: 10px 15px;
  background: rgba(0, 210, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;

  &:hover {
    background: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
    transform: translateX(5px);
  }

  svg {
    font-size: 0.9rem;
    color: #00d2ff;
  }
`;

const LinkText = styled.span`
  flex: 1;
`;

const ActionButtonsContainer = styled.div`
  margin-top: auto;
  padding-top: 15px;
`;

// Icon mapping
const getIcon = (iconName) => {
  switch(iconName) {
    case 'FaCertificate':
      return <FaCertificate />;
    case 'FaRobot':
      return <FaRobot />;
    case 'FaCloud':
      return <FaCloud />;
    case 'FaRoad':
      return <FaRoad />;
    case 'FaPython':
      return <FaPython />;
    case 'FaCode':
      return <FaCode />;
    default:
      return <FaCode />;
  }
};

const Resources = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { resources } = useData();

  return (
    <ResourcesContainer id="resources" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Learning Resources
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Curated learning materials to help you master in-demand tech skills
        </Subtitle>

        <Grid>
          {resources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CardHeader>
                <IconWrapper>
                  {getIcon(resource.icon)}
                </IconWrapper>
                <CardTitle>{resource.title}</CardTitle>
              </CardHeader>

              <StatsRow>
                <Stat>
                  <FaHeart /> {resource.likes || 0}
                </Stat>
                <Stat>
                  <FaBookmark /> {resource.saves || 0}
                </Stat>
              </StatsRow>

              <LinksList>
                {resource.links.map((link, linkIndex) => (
                  <LinkItem 
                    key={linkIndex} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FaLink size={12} />
                    <LinkText>{link.text}</LinkText>
                  </LinkItem>
                ))}
              </LinksList>

              <ActionButtonsContainer>
                <ActionButtons 
                  item={resource} 
                  type="resource"
                  onActionComplete={() => {
                    // Optional: Add any additional logic after action
                  }}
                />
              </ActionButtonsContainer>
            </ResourceCard>
          ))}
        </Grid>
      </Content>
    </ResourcesContainer>
  );
};

export default Resources;