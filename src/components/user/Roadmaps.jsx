import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useData } from '../../hooks/useData';
import {
  FaRoad,
  FaCheckCircle,
  FaDownload,
  FaHeart,
  FaBookmark,
  FaClock,
  FaSignal
} from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';

const RoadmapsContainer = styled.section`
  padding: 80px 0;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const RoadmapCard = styled(motion.div)`
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
`;

const Icon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #00d2ff;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
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

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
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

const StepsList = styled.div`
  margin: 15px 0;
  padding: 15px 0;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
  flex: 1;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #a0aec0;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
    font-size: 0.9rem;
  }
`;

const ResourcesSection = styled.div`
  margin: 15px 0;
`;

const ResourcesTitle = styled.h4`
  color: white;
  font-size: 0.95rem;
  margin-bottom: 8px;
`;

const ResourceItem = styled.div`
  color: #a0aec0;
  font-size: 0.85rem;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 5px;

  &:before {
    content: '•';
    color: #00d2ff;
  }
`;

const DownloadButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  margin: 15px 0;
  background: transparent;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 210, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const ActionButtonsContainer = styled.div`
  margin-top: auto;
  padding-top: 15px;
`;

const Roadmaps = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { roadmaps } = useData();

  return (
    <RoadmapsContainer id="roadmaps" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Learning Roadmaps
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Step-by-step guides to master in-demand tech skills
        </Subtitle>

        <Grid>
          {roadmaps.map((roadmap, index) => (
            <RoadmapCard
              key={roadmap.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CardHeader>
                <Icon>
                  <FaRoad />
                </Icon>
                <CardTitle>{roadmap.title}</CardTitle>
              </CardHeader>

              <StatsRow>
                <Stat>
                  <FaHeart /> {roadmap.likes || 0}
                </Stat>
                <Stat>
                  <FaBookmark /> {roadmap.saves || 0}
                </Stat>
              </StatsRow>

              <Description>{roadmap.description}</Description>

              <MetaInfo>
                <MetaItem>
                  <FaSignal /> {roadmap.level || 'Beginner'}
                </MetaItem>
                <MetaItem>
                  <FaClock /> {roadmap.duration || '6 months'}
                </MetaItem>
              </MetaInfo>

              <StepsList>
                {roadmap.steps.slice(0, 4).map((step, idx) => (
                  <Step key={idx}>
                    <FaCheckCircle /> {step}
                  </Step>
                ))}
                {roadmap.steps.length > 4 && (
                  <Step>+{roadmap.steps.length - 4} more steps</Step>
                )}
              </StepsList>

              <ResourcesSection>
                <ResourcesTitle>Recommended Resources:</ResourcesTitle>
                {roadmap.resources.slice(0, 2).map((resource, idx) => (
                  <ResourceItem key={idx}>{resource}</ResourceItem>
                ))}
                {roadmap.resources.length > 2 && (
                  <ResourceItem>+{roadmap.resources.length - 2} more resources</ResourceItem>
                )}
              </ResourcesSection>

              <DownloadButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload /> Download PDF Guide
              </DownloadButton>

              <ActionButtonsContainer>
                <ActionButtons 
                  item={roadmap} 
                  type="roadmap"
                />
              </ActionButtonsContainer>
            </RoadmapCard>
          ))}
        </Grid>
      </Content>
    </RoadmapsContainer>
  );
};

export default Roadmaps;