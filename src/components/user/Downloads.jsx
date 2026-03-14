import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useData } from '../../hooks/useData';
import {
  FaDownload,
  FaRobot,
  FaRoad,
  FaCloud,
  FaFileAlt,
  FaHeart,
  FaBookmark,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive
} from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';

const DownloadsContainer = styled.section`
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

const DownloadsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const DownloadCard = styled(motion.div)`
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

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);

    &:after {
      opacity: 0.1;
    }
  }
`;

const PreviewBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 210, 255, 0.2);
  color: #00d2ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
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

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 10px;
  padding: 5px 0;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
`;

const DownloadButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  margin: 15px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const DownloadCount = styled.div`
  color: #a0aec0;
  font-size: 0.85rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ActionButtonsContainer = styled.div`
  margin-top: auto;
  padding-top: 15px;
`;

const getFileIcon = (fileName) => {
  const ext = fileName?.split('.').pop().toLowerCase();
  switch(ext) {
    case 'pdf':
      return <FaFilePdf style={{ color: '#ff6b6b' }} />;
    case 'doc':
    case 'docx':
      return <FaFileWord style={{ color: '#3a7bd5' }} />;
    case 'xls':
    case 'xlsx':
      return <FaFileExcel style={{ color: '#4caf50' }} />;
    case 'zip':
    case 'rar':
      return <FaFileArchive style={{ color: '#ff9800' }} />;
    default:
      return <FaFileAlt />;
  }
};

const iconMap = {
  FaRobot: <FaRobot />,
  FaRoad: <FaRoad />,
  FaCloud: <FaCloud />,
  FaFileAlt: <FaFileAlt />
};

const Downloads = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { downloads } = useData();

  return (
    <DownloadsContainer id="downloads" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Free Resources & Guides
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Download comprehensive guides, cheat sheets, and templates
        </Subtitle>

        <DownloadsGrid>
          {downloads.map((download, index) => (
            <DownloadCard
              key={download.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <PreviewBadge>FREE</PreviewBadge>
              
              <CardHeader>
                <Icon>{iconMap[download.icon] || <FaFileAlt />}</Icon>
                <CardTitle>{download.title}</CardTitle>
              </CardHeader>

              <StatsRow>
                <Stat>
                  <FaHeart /> {download.likes || 0}
                </Stat>
                <Stat>
                  <FaBookmark /> {download.saves || 0}
                </Stat>
              </StatsRow>

              <FileInfo>
                {getFileIcon(download.fileName)} {download.fileName || 'Document'} • {download.fileSize || '2.5 MB'}
              </FileInfo>

              <Description>{download.description}</Description>

              <DownloadCount>
                <FaDownload /> {download.downloads || 0} downloads
              </DownloadCount>

              <DownloadButton
                href={download.downloadUrl}
                download
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload /> Download Now
              </DownloadButton>

              <ActionButtonsContainer>
                <ActionButtons 
                  item={download} 
                  type="download"
                />
              </ActionButtonsContainer>
            </DownloadCard>
          ))}
        </DownloadsGrid>
      </Content>
    </DownloadsContainer>
  );
};

export default Downloads;