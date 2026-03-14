import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaLink, FaNewspaper, FaVideo, FaBlog, FaExternalLinkAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { useData } from '../../hooks/useData';

const RecentLinksContainer = styled.section`
  padding: 60px 0;
  background: linear-gradient(135deg, #0a0f1f 0%, #030614 100%);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LinksGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const LinkCard = styled(motion.a)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;

  &:hover {
    transform: translateX(5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.1);
  }
`;

const LinkIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #00d2ff;
`;

const LinkContent = styled.div`
  flex: 1;
`;

const LinkTitle = styled.h4`
  color: white;
  font-size: 1rem;
  margin-bottom: 5px;
  font-weight: 600;
`;

const LinkMeta = styled.p`
  color: #a0aec0;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ViewAllButton = styled(motion.button)`
  display: block;
  margin: 40px auto 0;
  padding: 12px 30px;
  background: transparent;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 210, 255, 0.1);
    transform: scale(1.05);
  }
`;

const RecentLinks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { recentLinks } = useData();

  const iconMap = {
    FaNewspaper: <FaNewspaper />,
    FaVideo: <FaVideo />,
    FaBlog: <FaBlog />,
    FaLink: <FaLink />
  };

  return (
    <RecentLinksContainer id="recent-links" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <FaLink /> Recent Updates
        </Title>

        <LinksGrid
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {recentLinks.slice(0, 4).map((link, index) => (
            <LinkCard
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <LinkIcon>{iconMap[link.icon] || <FaLink />}</LinkIcon>
              <LinkContent>
                <LinkTitle>{link.title}</LinkTitle>
                <LinkMeta>
                  {link.meta}
                  <FaExternalLinkAlt size={10} />
                </LinkMeta>
              </LinkContent>
            </LinkCard>
          ))}
        </LinksGrid>

        <ViewAllButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('#', '_blank')}
        >
          View All Updates
        </ViewAllButton>
      </Content>
    </RecentLinksContainer>
  );
};

export default RecentLinks;