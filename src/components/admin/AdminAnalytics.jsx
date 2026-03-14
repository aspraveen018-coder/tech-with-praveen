import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import {
  FaChartLine,
  FaUsers,
  FaEye,
  FaDownload,
  FaClock,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaHeart,
  FaBookmark,
  FaShare,
  FaUserPlus,
  FaVideo,
  FaBriefcase,
  FaRoad,
  FaFileAlt,
  FaLink,
  FaFilter,
  FaDownload as FaDownloadIcon,
  FaPrint,
  FaChartBar,
  FaChartPie, // Changed from FaPieChart to FaChartPie
  FaChartArea
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Scatter
} from 'recharts';
import styled from 'styled-components';
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Container = styled.div`
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
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateRangePicker = styled.div`
  display: flex;
  gap: 10px;
  background: rgba(10, 20, 40, 0.6);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  padding: 5px;
`;

const DateButton = styled(motion.button)`
  padding: 8px 16px;
  background: ${props => props.active ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent'};
  border: none;
  border-radius: 8px;
  color: ${props => props.active ? 'white' : '#a0aec0'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'rgba(0, 210, 255, 0.1)'};
    color: ${props => props.active ? 'white' : '#00d2ff'};
  }
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ExportButton = styled(motion.button)`
  background: rgba(10, 20, 40, 0.6);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  padding: 10px 15px;
  color: #a0aec0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
    border-color: #00d2ff;
  }
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
  background: ${props => props.bg || 'linear-gradient(135deg, #00d2ff, #3a7bd5)'};
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

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const ChartTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartLegend = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a0aec0;
  font-size: 0.9rem;

  span {
    width: 12px;
    height: 12px;
    background: ${props => props.color};
    border-radius: 3px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ContentCard = styled.div`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
`;

const ContentList = styled.div`
  margin-top: 15px;
`;

const ContentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ContentTitle = styled.div`
  color: white;
  font-size: 0.95rem;
`;

const ContentStats = styled.div`
  display: flex;
  gap: 20px;
`;

const ContentStat = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #00d2ff;
  font-size: 0.9rem;
  font-weight: 600;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00d2ff;
  }

  option {
    background: #0a0f1f;
  }
`;

const COLORS = ['#00d2ff', '#3a7bd5', '#ff6b6b', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#f44336'];

const AdminAnalytics = () => {
  const { resources, jobs, roadmaps, sessions, downloads, recentLinks, analytics, getCounts } = useData();
  const { getAllUsers } = useGoogleAuth();
  const [dateRange, setDateRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [contentType, setContentType] = useState('all');
  const [trafficData, setTrafficData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [users, setUsers] = useState([]);

  // Load users data
  useEffect(() => {
    const allUsers = getAllUsers?.() || [];
    setUsers(allUsers);
  }, [getAllUsers]);

  // Generate traffic data based on date range
  useEffect(() => {
    generateTrafficData();
    generateEngagementData();
  }, [dateRange, users, resources, jobs, roadmaps, sessions, downloads, recentLinks]);

  const generateTrafficData = () => {
    let days = 7;
    if (dateRange === 'day') days = 1;
    if (dateRange === 'week') days = 7;
    if (dateRange === 'month') days = 30;
    if (dateRange === 'year') days = 365;

    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'MMM dd');
      
      // Generate realistic traffic patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseVisitors = isWeekend ? 150 : 300;
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      
      data.push({
        date: dateStr,
        visitors: Math.round(baseVisitors * randomFactor * (users.length ? 1 + users.length/100 : 1)),
        pageViews: Math.round(baseVisitors * randomFactor * 3 * (users.length ? 1 + users.length/100 : 1)),
        uniqueUsers: Math.round(baseVisitors * randomFactor * 0.6 * (users.length ? 1 + users.length/100 : 1)),
        newUsers: Math.round(baseVisitors * randomFactor * 0.2)
      });
    }
    
    setTrafficData(data);
  };

  const generateEngagementData = () => {
    const totalLikes = 
      (resources?.reduce((acc, r) => acc + (r.likes || 0), 0) || 0) +
      (jobs?.reduce((acc, j) => acc + (j.likes || 0), 0) || 0) +
      (roadmaps?.reduce((acc, r) => acc + (r.likes || 0), 0) || 0) +
      (sessions?.reduce((acc, s) => acc + (s.likes || 0), 0) || 0) +
      (downloads?.reduce((acc, d) => acc + (d.likes || 0), 0) || 0) +
      (recentLinks?.reduce((acc, l) => acc + (l.likes || 0), 0) || 0);

    const totalSaves = 
      (resources?.reduce((acc, r) => acc + (r.saves || 0), 0) || 0) +
      (jobs?.reduce((acc, j) => acc + (j.saves || 0), 0) || 0) +
      (roadmaps?.reduce((acc, r) => acc + (r.saves || 0), 0) || 0) +
      (sessions?.reduce((acc, s) => acc + (s.saves || 0), 0) || 0) +
      (downloads?.reduce((acc, d) => acc + (d.saves || 0), 0) || 0) +
      (recentLinks?.reduce((acc, l) => acc + (l.saves || 0), 0) || 0);

    const totalDownloads = downloads?.reduce((acc, d) => acc + (d.downloads || 0), 0) || 0;
    const totalClicks = recentLinks?.reduce((acc, l) => acc + (l.clicks || 0), 0) || 0;

    setEngagementData([
      { name: 'Likes', value: totalLikes, color: '#ff6b6b' },
      { name: 'Saves', value: totalSaves, color: '#00d2ff' },
      { name: 'Downloads', value: totalDownloads, color: '#4caf50' },
      { name: 'Clicks', value: totalClicks, color: '#ff9800' }
    ]);
  };

  const getTopContent = () => {
    const allContent = [
      ...(resources?.map(item => ({ ...item, type: 'resource' })) || []),
      ...(jobs?.map(item => ({ ...item, type: 'job', title: `${item.company} - ${item.role}` })) || []),
      ...(roadmaps?.map(item => ({ ...item, type: 'roadmap' })) || []),
      ...(sessions?.map(item => ({ ...item, type: 'session' })) || []),
      ...(downloads?.map(item => ({ ...item, type: 'download' })) || []),
      ...(recentLinks?.map(item => ({ ...item, type: 'link', title: item.title })) || [])
    ];

    return allContent
      .sort((a, b) => ((b.likes || 0) + (b.saves || 0) + (b.downloads || 0) + (b.clicks || 0)) - 
                        ((a.likes || 0) + (a.saves || 0) + (a.downloads || 0) + (a.clicks || 0)))
      .slice(0, 10)
      .map(item => ({
        ...item,
        engagement: (item.likes || 0) + (item.saves || 0) + (item.downloads || 0) + (item.clicks || 0)
      }));
  };

  const getUserStats = () => {
    const now = new Date();
    const oneDayAgo = subDays(now, 1);
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    const activeToday = users.filter(u => new Date(u.lastLogin) > oneDayAgo).length;
    const activeWeek = users.filter(u => new Date(u.lastLogin) > oneWeekAgo).length;
    const activeMonth = users.filter(u => new Date(u.lastLogin) > oneMonthAgo).length;
    const newThisMonth = users.filter(u => new Date(u.loginTime) > oneMonthAgo).length;

    return { activeToday, activeWeek, activeMonth, newThisMonth };
  };

  const getContentStats = () => {
    const totalLikes = engagementData.find(d => d.name === 'Likes')?.value || 0;
    const totalSaves = engagementData.find(d => d.name === 'Saves')?.value || 0;
    const totalDownloads = engagementData.find(d => d.name === 'Downloads')?.value || 0;
    const totalClicks = engagementData.find(d => d.name === 'Clicks')?.value || 0;

    return { totalLikes, totalSaves, totalDownloads, totalClicks };
  };

  const exportToExcel = () => {
    const data = [
      ['Analytics Report', new Date().toLocaleString()],
      [],
      ['Traffic Data', ...trafficData.map(d => d.date)],
      ['Visitors', ...trafficData.map(d => d.visitors)],
      ['Page Views', ...trafficData.map(d => d.pageViews)],
      [],
      ['User Statistics'],
      ['Total Users', users.length],
      ['Active Today', getUserStats().activeToday],
      ['Active This Week', getUserStats().activeWeek],
      ['Active This Month', getUserStats().activeMonth],
      ['New This Month', getUserStats().newThisMonth],
      [],
      ['Content Statistics'],
      ['Total Resources', resources?.length || 0],
      ['Total Jobs', jobs?.length || 0],
      ['Total Roadmaps', roadmaps?.length || 0],
      ['Total Sessions', sessions?.length || 0],
      ['Total Downloads', downloads?.length || 0],
      ['Total Links', recentLinks?.length || 0],
      [],
      ['Engagement Statistics'],
      ['Total Likes', getContentStats().totalLikes],
      ['Total Saves', getContentStats().totalSaves],
      ['Total Downloads', getContentStats().totalDownloads],
      ['Total Clicks', getContentStats().totalClicks]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
    XLSX.writeFile(wb, `analytics_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(0, 210, 255);
    doc.text('Analytics Report', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // User Statistics
    doc.setTextColor(0, 210, 255);
    doc.text('User Statistics', 20, 45);
    doc.setTextColor(160, 174, 192);
    doc.text(`Total Users: ${users.length}`, 30, 55);
    doc.text(`Active Today: ${getUserStats().activeToday}`, 30, 62);
    doc.text(`Active This Week: ${getUserStats().activeWeek}`, 30, 69);
    doc.text(`Active This Month: ${getUserStats().activeMonth}`, 30, 76);
    doc.text(`New This Month: ${getUserStats().newThisMonth}`, 30, 83);
    
    // Content Statistics
    doc.setTextColor(0, 210, 255);
    doc.text('Content Statistics', 20, 98);
    doc.setTextColor(160, 174, 192);
    doc.text(`Resources: ${resources?.length || 0}`, 30, 108);
    doc.text(`Jobs: ${jobs?.length || 0}`, 30, 115);
    doc.text(`Roadmaps: ${roadmaps?.length || 0}`, 30, 122);
    doc.text(`Sessions: ${sessions?.length || 0}`, 30, 129);
    doc.text(`Downloads: ${downloads?.length || 0}`, 30, 136);
    doc.text(`Links: ${recentLinks?.length || 0}`, 30, 143);
    
    // Engagement Statistics
    doc.setTextColor(0, 210, 255);
    doc.text('Engagement Statistics', 20, 158);
    doc.setTextColor(160, 174, 192);
    doc.text(`Total Likes: ${getContentStats().totalLikes}`, 30, 168);
    doc.text(`Total Saves: ${getContentStats().totalSaves}`, 30, 175);
    doc.text(`Total Downloads: ${getContentStats().totalDownloads}`, 30, 182);
    doc.text(`Total Clicks: ${getContentStats().totalClicks}`, 30, 189);
    
    doc.save(`analytics_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const stats = [
    {
      icon: <FaUsers />,
      label: 'Total Users',
      value: users.length.toLocaleString(),
      change: `+${getUserStats().newThisMonth} this month`,
      positive: true,
      bg: 'linear-gradient(135deg, #00d2ff, #3a7bd5)'
    },
    {
      icon: <FaUserPlus />,
      label: 'Active Today',
      value: getUserStats().activeToday.toLocaleString(),
      change: `${((getUserStats().activeToday / users.length) * 100).toFixed(1)}% of users`,
      positive: true,
      bg: 'linear-gradient(135deg, #4caf50, #45a049)'
    },
    {
      icon: <FaEye />,
      label: 'Page Views',
      value: trafficData.reduce((acc, d) => acc + d.pageViews, 0).toLocaleString(),
      change: `Avg ${Math.round(trafficData.reduce((acc, d) => acc + d.pageViews, 0) / trafficData.length)} per day`,
      positive: true,
      bg: 'linear-gradient(135deg, #ff9800, #f57c00)'
    },
    {
      icon: <FaHeart />,
      label: 'Total Engagement',
      value: (getContentStats().totalLikes + getContentStats().totalSaves + 
              getContentStats().totalDownloads + getContentStats().totalClicks).toLocaleString(),
      change: 'Across all content',
      positive: true,
      bg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
    }
  ];

  const topContent = getTopContent();
  const userStats = getUserStats();
  const contentStats = getContentStats();

  return (
    <Container>
      <Header>
        <Title>
          <FaChartLine /> Analytics Dashboard
        </Title>
        
        <DateRangePicker>
          <DateButton 
            active={dateRange === 'day'} 
            onClick={() => setDateRange('day')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Day
          </DateButton>
          <DateButton 
            active={dateRange === 'week'} 
            onClick={() => setDateRange('week')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Week
          </DateButton>
          <DateButton 
            active={dateRange === 'month'} 
            onClick={() => setDateRange('month')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Month
          </DateButton>
          <DateButton 
            active={dateRange === 'year'} 
            onClick={() => setDateRange('year')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Year
          </DateButton>
        </DateRangePicker>

        <ExportButtons>
          <ExportButton
            onClick={exportToExcel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownloadIcon /> Excel
          </ExportButton>
          <ExportButton
            onClick={exportToPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPrint /> PDF
          </ExportButton>
        </ExportButtons>
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
                {stat.change}
              </StatChange>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      <ChartsContainer>
        <ChartCard>
          <ChartTitle>
            <FaChartLine /> Traffic Overview
          </ChartTitle>
          <ChartLegend>
            <LegendItem color="#00d2ff"><span /> Visitors</LegendItem>
            <LegendItem color="#3a7bd5"><span /> Page Views</LegendItem>
            <LegendItem color="#4caf50"><span /> Unique Users</LegendItem>
          </ChartLegend>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10,20,40,0.9)', 
                  border: '1px solid #00d2ff',
                  borderRadius: '10px',
                  color: 'white'
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="visitors" fill="#00d2ff" stroke="#00d2ff" fillOpacity={0.3} />
              <Bar dataKey="pageViews" fill="#3a7bd5" barSize={20} />
              <Line type="monotone" dataKey="uniqueUsers" stroke="#4caf50" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
  <FaChartPie /> Engagement Distribution  {/* To this */}
</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10,20,40,0.9)', 
                  border: '1px solid #00d2ff',
                  borderRadius: '10px',
                  color: 'white'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsContainer>

      <ContentGrid>
        <ContentCard>
          <ChartTitle>
            <FaUsers /> User Statistics
          </ChartTitle>
          <ContentList>
            <ContentItem>
              <ContentTitle>Total Users</ContentTitle>
              <ContentStats>
                <ContentStat>{users.length}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Active Today</ContentTitle>
              <ContentStats>
                <ContentStat>{userStats.activeToday}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Active This Week</ContentTitle>
              <ContentStats>
                <ContentStat>{userStats.activeWeek}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Active This Month</ContentTitle>
              <ContentStats>
                <ContentStat>{userStats.activeMonth}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>New This Month</ContentTitle>
              <ContentStats>
                <ContentStat>{userStats.newThisMonth}</ContentStat>
              </ContentStats>
            </ContentItem>
          </ContentList>
        </ContentCard>

        <ContentCard>
          <ChartTitle>
            <FaChartBar /> Content Overview
          </ChartTitle>
          <ContentList>
            <ContentItem>
              <ContentTitle>Resources</ContentTitle>
              <ContentStats>
                <ContentStat>{resources?.length || 0}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Jobs</ContentTitle>
              <ContentStats>
                <ContentStat>{jobs?.length || 0}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Roadmaps</ContentTitle>
              <ContentStats>
                <ContentStat>{roadmaps?.length || 0}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Sessions</ContentTitle>
              <ContentStats>
                <ContentStat>{sessions?.length || 0}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Downloads</ContentTitle>
              <ContentStats>
                <ContentStat>{downloads?.length || 0}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Links</ContentTitle>
              <ContentStats>
                <ContentStat>{recentLinks?.length || 0}</ContentStat>
              </ContentStats>
            </ContentItem>
          </ContentList>
        </ContentCard>

        <ContentCard>
          <ChartTitle>
            <FaHeart /> Engagement Stats
          </ChartTitle>
          <ContentList>
            <ContentItem>
              <ContentTitle>Total Likes</ContentTitle>
              <ContentStats>
                <ContentStat>{contentStats.totalLikes.toLocaleString()}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Total Saves</ContentTitle>
              <ContentStats>
                <ContentStat>{contentStats.totalSaves.toLocaleString()}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Total Downloads</ContentTitle>
              <ContentStats>
                <ContentStat>{contentStats.totalDownloads.toLocaleString()}</ContentStat>
              </ContentStats>
            </ContentItem>
            <ContentItem>
              <ContentTitle>Total Clicks</ContentTitle>
              <ContentStats>
                <ContentStat>{contentStats.totalClicks.toLocaleString()}</ContentStat>
              </ContentStats>
            </ContentItem>
          </ContentList>
        </ContentCard>
      </ContentGrid>

      <ContentCard>
        <ChartTitle>
          <FaChartLine /> Top Performing Content
        </ChartTitle>
        <FilterBar>
          <FilterSelect value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option value="all">All Content</option>
            <option value="resource">Resources</option>
            <option value="job">Jobs</option>
            <option value="roadmap">Roadmaps</option>
            <option value="session">Sessions</option>
            <option value="download">Downloads</option>
            <option value="link">Links</option>
          </FilterSelect>
        </FilterBar>
        <ContentList>
          {topContent
            .filter(item => contentType === 'all' || item.type === contentType)
            .map((item, index) => (
              <ContentItem key={index}>
                <ContentTitle>{item.title || item.name || `${item.company} - ${item.role}`}</ContentTitle>
                <ContentStats>
                  {item.likes > 0 && <ContentStat><FaHeart /> {item.likes}</ContentStat>}
                  {item.saves > 0 && <ContentStat><FaBookmark /> {item.saves}</ContentStat>}
                  {item.downloads > 0 && <ContentStat><FaDownload /> {item.downloads}</ContentStat>}
                  {item.clicks > 0 && <ContentStat><FaEye /> {item.clicks}</ContentStat>}
                </ContentStats>
              </ContentItem>
            ))}
        </ContentList>
      </ContentCard>
    </Container>
  );
};

export default AdminAnalytics;