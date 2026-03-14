import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useData } from '../../hooks/useData';
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaExternalLinkAlt,
  FaHeart,
  FaBookmark,
  FaClock
} from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';
import { formatDistanceToNow } from 'date-fns';

const JobContainer = styled.section`
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

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const JobCard = styled(motion.div)`
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
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);

    &:before {
      opacity: 1;
    }
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #00d2ff;
  font-weight: bold;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin-bottom: 5px;
`;

const JobRole = styled.p`
  color: #00d2ff;
  font-size: 1rem;
  font-weight: 500;
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

const JobDetails = styled.div`
  margin: 15px 0;
  padding: 15px 0;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
  flex: 1;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  margin-bottom: 12px;
  font-size: 0.95rem;

  svg {
    color: #00d2ff;
  }
`;

const Salary = styled.span`
  background: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const JobType = styled.span`
  background: rgba(160, 174, 192, 0.1);
  color: #a0aec0;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const ApplyButton = styled(motion.a)`
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

const PostedDate = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 0.85rem;
  margin-bottom: 10px;
`;

const ActionButtonsContainer = styled.div`
  margin-top: auto;
  padding-top: 15px;
`;

const JobUpdates = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { jobs } = useData();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <JobContainer id="jobs" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Job & Internship Updates
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Latest opportunities from top companies
        </Subtitle>

        <JobsGrid>
          {jobs.map((job, index) => (
            <JobCard
              key={job.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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

              <StatsRow>
                <Stat>
                  <FaHeart /> {job.likes || 0}
                </Stat>
                <Stat>
                  <FaBookmark /> {job.saves || 0}
                </Stat>
              </StatsRow>

              <JobDetails>
                <DetailItem>
                  <FaMapMarkerAlt /> {job.location}
                </DetailItem>
                <DetailItem>
                  <FaBriefcase /> <JobType>{job.type || 'Full-time'}</JobType>
                </DetailItem>
                {job.salary && (
                  <DetailItem>
                    <Salary>{job.salary}</Salary>
                  </DetailItem>
                )}
                <DetailItem>
                  <FaClock /> Posted {formatDistanceToNow(new Date(job.postedDate))} ago
                </DetailItem>
              </JobDetails>

              <ApplyButton
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Now <FaExternalLinkAlt style={{ marginLeft: '8px' }} />
              </ApplyButton>

              <PostedDate>
                <FaClock /> {new Date(job.postedDate).toLocaleDateString()}
              </PostedDate>

              <ActionButtonsContainer>
                <ActionButtons 
                  item={job} 
                  type="job"
                />
              </ActionButtonsContainer>
            </JobCard>
          ))}
        </JobsGrid>
      </Content>
    </JobContainer>
  );
};

export default JobUpdates;