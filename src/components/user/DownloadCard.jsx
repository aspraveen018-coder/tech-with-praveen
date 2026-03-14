import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFileAlt } from 'react-icons/fa';
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

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);
  }
`;

const FreeBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 210, 255, 0.2);
  color: #00d2ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const Icon = styled.div`
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

const Title = styled.h3`
  color: white;
  font-size: 1.2rem;
  flex: 1;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 0.85rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const DownloadButton = styled.a`
  display: inline-block;
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin: 10px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const DownloadCard = ({ download }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <FreeBadge>FREE</FreeBadge>

      <Header>
        <Icon>
          <FaFileAlt />
        </Icon>
        <Title>{download.title}</Title>
      </Header>

      <FileInfo>
        {download.fileName} • {download.fileSize}
      </FileInfo>

      <Description>{download.description}</Description>

      <DownloadButton href={download.downloadUrl} download>
        <FaDownload /> Download
      </DownloadButton>

      <ActionButtons 
        item={download} 
        type="download"
      />
    </Card>
  );
};

export default DownloadCard;