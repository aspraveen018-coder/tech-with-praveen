import React from 'react';
import Hero from './Hero';
import About from './About';
import Resources from './Resources';
import RecentLinks from './RecentLinks';
import JobUpdates from './JobUpdates';
import Roadmaps from './Roadmaps';
import Sessions from './Sessions';
import Community from './Community';
import Downloads from './Downloads';
import Footer from './Footer';
import Navbar from './Navbar';

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Resources />
        <RecentLinks />
        <JobUpdates />
        <Roadmaps />
        <Sessions />
        <Community />
        <Downloads />
        <Footer />
      </main>
    </div>
  );
};

export default UserLayout;