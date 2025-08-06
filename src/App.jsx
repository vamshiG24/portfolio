import React from 'react'
import Home from './components/Home.jsx'
import Timeline from './components/Timeline.jsx'
import Projects from './components/Projects.jsx'
import Buildlogs from './components/Buildlogs.jsx'
import MindSetSection from './components/MindSetSection.jsx'
import Contact from './components/Contact.jsx'

const App = () => {
  return (
    <div className='text-amber-600'>
      <Home />
      <Timeline />
      <Projects />
      <Buildlogs />
      <MindSetSection />
      <Contact />
    </div>
  )
}

export default App