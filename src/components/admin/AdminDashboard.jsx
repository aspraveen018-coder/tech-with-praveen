import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaBook,
  FaBriefcase,
  FaRoad,
  FaVideo,
  FaDownload,
  FaUsers,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaUserPlus,
  FaFileAlt
} from 'react-icons/fa';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  background: rgba(10, 20, 40, 0.6);
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid rgba(0, 210, 255, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
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
    background: linear-gradient(90deg, #00d2ff, #3a7bd5);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.15);

    &:before {
      transform: translateX(100%);
    }
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.bg || 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)'};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.h3`
  font-size: 2rem;
  color: white;
  margin-bottom: 5px;
`;

const StatLabel = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
`;

const StatChange = styled.span`
  color: ${props => props.positive ? '#4caf50' : '#ff6b6b'};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const ActivityList = styled.div`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d2ff;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h4`
  color: white;
  font-size: 1rem;
  margin-bottom: 5px;
`;

const ActivityTime = styled.p`
  color: #a0aec0;
  font-size: 0.85rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 30px;
`;

const ActionButton = styled(motion.button)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const AdminDashboard = () => {
  const { resources, jobs, roadmaps, sessions, downloads, recentLinks } = useData();

  const stats = [
    {
      icon: <FaBook />,
      label: 'Total Resources',
      value: resources?.length || 0,
      change: '+12%',
      positive: true,
      bg: 'linear-gradient(135deg, #00d2ff, #3a7bd5)'
    },
    {
      icon: <FaBriefcase />,
      label: 'Active Jobs',
      value: jobs?.length || 0,
      change: '+8%',
      positive: true,
      bg: 'linear-gradient(135deg, #4caf50, #45a049)'
    },
    {
      icon: <FaRoad />,
      label: 'Learning Roadmaps',
      value: roadmaps?.length || 0,
      change: '+5%',
      positive: true,
      bg: 'linear-gradient(135deg, #ff9800, #f57c00)'
    },
    {
      icon: <FaVideo />,
      label: 'Upcoming Sessions',
      value: sessions?.length || 0,
      change: '+15%',
      positive: true,
      bg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
    },
    {
      icon: <FaDownload />,
      label: 'Total Downloads',
      value: downloads?.reduce((acc, d) => acc + (d.downloads || 0), 0) || 0,
      change: '+23%',
      positive: true,
      bg: 'linear-gradient(135deg, #9c27b0, #7b1fa2)'
    },
    {
      icon: <FaUsers />,
      label: 'Community Members',
      value: '50K+',
      change: '+18%',
      positive: true,
      bg: 'linear-gradient(135deg, #00bcd4, #0097a7)'
    }
  ];

  const recentActivity = [
    { icon: <FaUserPlus />, title: 'New user joined the community', time: '5 minutes ago' },
    { icon: <FaFileAlt />, title: 'New resource added: DevOps Roadmap', time: '1 hour ago' },
    { icon: <FaBriefcase />, title: 'New job posted: Cloud Engineer at Google', time: '2 hours ago' },
    { icon: <FaVideo />, title: 'Live session scheduled: Kubernetes Workshop', time: '3 hours ago' },
    { icon: <FaDownload />, title: 'Guide downloaded: AI Agents Guide', time: '5 hours ago' },
  ];

  const quickActions = [
    { icon: <FaBook />, label: 'Add Resource', path: '/admin/resources' },
    { icon: <FaBriefcase />, label: 'Post Job', path: '/admin/jobs' },
    { icon: <FaRoad />, label: 'Create Roadmap', path: '/admin/roadmaps' },
    { icon: <FaVideo />, label: 'Schedule Session', path: '/admin/sessions' },
  ];

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard Overview</Title>
        <DateDisplay>
          <FaCalendar />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </DateDisplay>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <StatIcon bg={stat.bg}>{stat.icon}</StatIcon>
            <StatInfo>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
              <StatChange positive={stat.positive}>
                {stat.positive ? <FaArrowUp /> : <FaArrowDown />}
                {stat.change}
              </StatChange>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      <ActivityList>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Recent Activity</h3>
        {recentActivity.map((activity, index) => (
          <ActivityItem
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ActivityIcon>{activity.icon}</ActivityIcon>
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>

      <QuickActions>
        {quickActions.map((action, index) => (
          <ActionButton
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = action.path}
          >
            {action.icon} {action.label}
          </ActionButton>
        ))}
      </QuickActions>
    </DashboardContainer>
  );
};

export default AdminDashboard;