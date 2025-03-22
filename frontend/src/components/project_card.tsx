import React, { useState } from 'react';

interface ProjectCardProps {
  title: string;
  imageUrl: string;
  technologies?: string[];
  projectLink?: string;
  githubLink?: string;
  // for tailwind stuff
  widthClass?: string;
  maxWidth?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title,
  imageUrl,
  technologies = [],
  projectLink,
  githubLink,
  widthClass = 'w-full sm:w-2/3 md:w-1/2 lg:w-2/3',
  maxWidth = 480
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  return (
    <div 
      className={`relative rounded-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl bg-gray-800 group ${widthClass}`}
      style={{ maxWidth: `${maxWidth}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Technology icons */}
      {technologies.length > 0 && (
        <div className="absolute left-3 flex z-20" style={{ top: 0, transform: 'translateY(-50%)' }}>
          {technologies.map((tech, index) => (
            <div 
              key={tech} 
              className="rounded-full bg-white bg-opacity-90 shadow-md flex items-center justify-center border border-gray-300 transition-transform group-hover:scale-105 w-8 h-8 md:w-10 md:h-10"
              style={{ marginLeft: index === 0 ? 0 : '0.75rem' }}
            >
              <img 
                src={`/icons/${tech.toLowerCase()}.svg`} 
                alt={tech} 
                title={tech}
                className="w-5 h-5 md:w-7 md:h-7"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* image/gif */}
      <div className="w-full rounded-lg overflow-hidden bg-gray-100">
        <img 
        
          src={imageUrl} 
          alt={title} 
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-b from-black/70 to-black/50 text-white flex flex-col justify-center items-center transition-opacity duration-300 overflow-auto p-3 md:p-6 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
      <div className="text-center mb-4">
        <p className="text-lg md:text-xl text-white font-semibold">{title}</p>
      </div>
      
        <div className="flex justify-center gap-2">
          {projectLink && (
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center text-sm md:text-base px-2 py-1 md:px-4 md:py-2"
            >
              <span>Check it out!</span>
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors duration-300 flex items-center text-sm md:text-base px-2 py-1 md:px-4 md:py-2"
            >
              <span>See the code</span>
              <img className="ml-1 w-4 h-4" src="icons/github-white.svg" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;