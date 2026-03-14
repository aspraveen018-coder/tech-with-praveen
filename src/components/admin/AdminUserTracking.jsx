import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import {
  FaUsers,
  FaDownload,
  FaSearch,
  FaFilter
  // Removed unused icons: FaUserCircle, FaCalendar, FaMapMarkerAlt, FaGlobe, FaClock, FaChartLine
} from 'react-icons/fa';
import styled from 'styled-components';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.h2`
  font-size: 2rem;
  color: #00d2ff;
  margin-bottom: 5px;
`;

const StatLabel = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  padding: 10px 15px;
  width: 300px;

  svg {
    color: #a0aec0;
    margin-right: 10px;
  }

  input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    outline: none;

    &::placeholder {
      color: #4a5568;
    }
  }
`;

const FilterButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  padding: 10px 20px;
  color: #a0aec0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
  }
`;

const UsersTable = styled.div`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1fr 1.5fr;
  padding: 15px 20px;
  background: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1fr 1.5fr;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
  align-items: center;

  &:hover {
    background: rgba(0, 210, 255, 0.05);
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 20px;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserAvatarPlaceholder = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
`;

const UserName = styled.div`
  color: white;
  font-weight: 500;
`;

// Removed unused UserEmailStyled component

const Cell = styled.div`
  color: #a0aec0;
  font-size: 0.95rem;

  @media (max-width: 1200px) {
    display: flex;
    align-items: center;
    gap: 10px;

    &:before {
      content: attr(data-label);
      color: #00d2ff;
      font-weight: 600;
      width: 100px;
    }
  }
`;

const Badge = styled.span`
  background: ${props => {
    if (props.count > 10) return 'rgba(76, 175, 80, 0.2)';
    if (props.count > 5) return 'rgba(255, 152, 0, 0.2)';
    return 'rgba(0, 210, 255, 0.2)';
  }};
  color: ${props => {
    if (props.count > 10) return '#4caf50';
    if (props.count > 5) return '#ff9800';
    return '#00d2ff';
  }};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const DownloadButton = styled(motion.button)`
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid #00d2ff;
  color: #00d2ff;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    color: white;
  }
`;

const NoUsersMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #a0aec0;
`;

const AdminUserTracking = () => {
  const { getAllUsers } = useGoogleAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, new

  useEffect(() => {
    // Initial load
    const loadUsers = () => {
      const allUsers = getAllUsers();
      setUsers(allUsers || []);
    };
    
    loadUsers();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, [getAllUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'active') {
      const lastLogin = new Date(user.lastLogin);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return matchesSearch && lastLogin > oneDayAgo;
    }
    
    if (filter === 'new') {
      const loginTime = new Date(user.loginTime);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && loginTime > oneWeekAgo;
    }
    
    return matchesSearch;
  });

  const getDeviceIcon = (platform) => {
    if (platform?.toLowerCase().includes('win')) return '🪟';
    if (platform?.toLowerCase().includes('mac')) return '🍎';
    if (platform?.toLowerCase().includes('linux')) return '🐧';
    if (platform?.toLowerCase().includes('android')) return '📱';
    if (platform?.toLowerCase().includes('iphone')) return '📱';
    return '💻';
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `users_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const stats = {
    total: users.length,
    activeToday: users.filter(u => new Date(u.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    activeWeek: users.filter(u => new Date(u.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    newThisWeek: users.filter(u => new Date(u.loginTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  };

  return (
    <Container>
      <Header>
        <Title>
          <FaUsers /> User Tracking Dashboard
        </Title>
        <DownloadButton
          onClick={exportUsers}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDownload /> Export Data
        </DownloadButton>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue>{stats.activeToday}</StatValue>
          <StatLabel>Active Today</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>{stats.activeWeek}</StatValue>
          <StatLabel>Active This Week</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue>{stats.newThisWeek}</StatValue>
          <StatLabel>New This Week</StatLabel>
        </StatCard>
      </StatsGrid>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <FilterButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setFilter(filter === 'all' ? 'active' : filter === 'active' ? 'new' : 'all')}
        >
          <FaFilter /> Filter: {filter === 'all' ? 'All Users' : filter === 'active' ? 'Active Today' : 'New This Week'}
        </FilterButton>
      </div>

      <UsersTable>
        <TableHeader>
          <div>User</div>
          <div>Email</div>
          <div>First Login</div>
          <div>Last Login</div>
          <div>Logins</div>
          <div>Device</div>
        </TableHeader>

        {filteredUsers.map((user, index) => (
          <TableRow
            key={user.email}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <UserCell>
              {user.picture ? (
                <UserAvatar src={user.picture} alt={user.name} />
              ) : (
                <UserAvatarPlaceholder>
                  {user.name?.charAt(0).toUpperCase()}
                </UserAvatarPlaceholder>
              )}
              <UserName>{user.name}</UserName>
            </UserCell>
            <Cell data-label="Email">{user.email}</Cell>
            <Cell data-label="First Login">
              {new Date(user.loginTime).toLocaleDateString()}<br />
              <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>
                {new Date(user.loginTime).toLocaleTimeString()}
              </span>
            </Cell>
            <Cell data-label="Last Login">
              {new Date(user.lastLogin).toLocaleDateString()}<br />
              <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>
                {new Date(user.lastLogin).toLocaleTimeString()}
              </span>
            </Cell>
            <Cell data-label="Logins">
              <Badge count={user.loginCount || 1}>
                {user.loginCount || 1} times
              </Badge>
            </Cell>
            <Cell data-label="Device">
              {getDeviceIcon(user.deviceInfo?.platform)} {user.deviceInfo?.platform || 'Unknown'}
            </Cell>
          </TableRow>
        ))}

        {filteredUsers.length === 0 && (
          <NoUsersMessage>
            No users found
          </NoUsersMessage>
        )}
      </UsersTable>
    </Container>
  );
};

export default AdminUserTracking;