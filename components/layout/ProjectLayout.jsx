import ProjectNav from './ProjectNav';
import ProjectHeader from './ProjectHeader';
import { useEffect } from 'react';


export default function ProjectLayout({ children }) {
  useEffect(() => {
    const h = document.getElementById("project-header").clientHeight
    document.getElementById("project-header-pad").style.height = h + 'px'
  }, [])

  return <>
    <div id="project-header" className="fixed w-full top-0 left-0 z-50">
      <ProjectHeader />
      <ProjectNav />
    </div>

    <div id="project-header-pad" className=""></div>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
      {children}
    </main>
  </>;
}