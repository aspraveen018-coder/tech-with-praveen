import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';
import { formatDistanceToNow } from 'date-fns';

const Card = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const CompanyLogo = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #00d2ff;
  font-weight: bold;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const JobRole = styled.p`
  color: #00d2ff;
  font-size: 0.95rem;
`;

const Details = styled.div`
  margin: 15px 0;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  margin-bottom: 8px;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
  }
`;

const ApplyButton = styled.a`
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const JobCard = ({ job }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <CompanyHeader>
        <CompanyLogo>
          {getInitials(job.company)}
        </CompanyLogo>
        <CompanyInfo>
          <CompanyName>{job.company}</CompanyName>
          <JobRole>{job.role}</JobRole>
        </CompanyInfo>
      </CompanyHeader>

      <Details>
        <DetailItem>
          <FaMapMarkerAlt /> {job.location}
        </DetailItem>
        <DetailItem>
          Posted {formatDistanceToNow(new Date(job.postedDate))} ago
        </DetailItem>
      </Details>

      <ApplyButton href={job.applyLink} target="_blank" rel="noopener noreferrer">
        Apply Now <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
      </ApplyButton>

      <ActionButtons 
        item={job} 
        type="job"
      />
    </Card>
  );
};

export default JobCard;