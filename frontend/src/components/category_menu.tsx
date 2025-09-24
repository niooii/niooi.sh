import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Cpu, Gamepad2, Image as ImageIcon, FunctionSquare, Brain, Globe2, Smartphone, Database, Settings, Shield, Ghost, MessageSquare } from "lucide-react";
import Project, { ProjectCategory, Tech } from "@/lib/project";

interface CategoryMenuProps {
    projects: Project[];
    className?: string;
}

const ICONS_PATH = "/icons/";
const PLACEHOLDER_IMAGES = ["", undefined, null];
const ALL_CATEGORY = "All";

const CategoryMenu = ({ projects, className }: CategoryMenuProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
    const [cardsVisible, setCardsVisible] = useState(false);
    const [pendingCategory, setPendingCategory] = useState<string | null>(null);
    const [gridKey, setGridKey] = useState(ALL_CATEGORY);
    const fadeTimeout = useRef<NodeJS.Timeout | null>(null);

    // Get all unique categories from projects
    const categories = Array.from(new Set(
        projects.flatMap(project => project.categories)
    ));

    // Add 'All' at the start
    const displayCategories = [ALL_CATEGORY, ...categories];

    // Filter projects by selected category only
    const filteredProjects = selectedCategory === ALL_CATEGORY
        ? projects
        : projects.filter(project => project.categories.includes(selectedCategory as ProjectCategory));

    const handleCategoryClick = (category: string) => {
        if (category === selectedCategory) return;
        setCardsVisible(false);
        setPendingCategory(category);
    };

    useEffect(() => {
        if (pendingCategory !== null) {
            if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
            fadeTimeout.current = setTimeout(() => {
                setSelectedCategory(pendingCategory);
                setGridKey(pendingCategory + '-' + Date.now()); // force grid re-mount for animation
                setPendingCategory(null);
            }, 220); // match fade out duration
            return () => { if (fadeTimeout.current) clearTimeout(fadeTimeout.current); };
        }
    }, [pendingCategory]);

    useLayoutEffect(() => {
        setCardsVisible(false);
        const raf = requestAnimationFrame(() => {
            setCardsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
    }, [gridKey]);

    // triangle pointer removed

    // Clean up timeout on unmount
    useEffect(() => {
        return () => { if (fadeTimeout.current) clearTimeout(fadeTimeout.current); };
    }, []);

    const categoryColors: Record<string, string> = {
        [ProjectCategory.SYSTEMS_PROGRAMMING]: "from-blue-500/20 to-cyan-500/20 border-blue-400/30",
        [ProjectCategory.GAMES]: "from-purple-500/20 to-pink-500/20 border-purple-400/30",
        [ProjectCategory.GRAPHICS]: "from-blue-500/20 to-white-500/20 border-blue-400/30",
        [ProjectCategory.FUNCTIONAL]: "from-green-500/20 to-emerald-500/20 border-green-400/30",
        [ProjectCategory.AI_ML]: "from-orange-500/20 to-red-500/20 border-orange-400/30",
        [ProjectCategory.WEB_DEV]: "from-indigo-500/20 to-blue-500/20 border-indigo-400/30",
        [ProjectCategory.APP_DEV]: "from-teal-500/20 to-cyan-500/20 border-teal-400/30",
        [ProjectCategory.DATA_SCIENCE]: "from-yellow-500/20 to-orange-500/20 border-yellow-400/30",
        [ProjectCategory.DEVOPS]: "from-gray-500/20 to-slate-500/20 border-gray-400/30",
        [ProjectCategory.SECURITY]: "from-red-500/20 to-pink-500/20 border-red-400/30",
        [ProjectCategory.SPOOKY]: "from-violet-500/20 to-purple-500/20 border-violet-400/30",
        [ProjectCategory.DISCORD_SHENANIGANS]: "from-blue-400/20 to-indigo-500/20 border-blue-400/30",
    };

    const CategoryIcon = ({ name }: { name: string }) => {
        const cls = "mr-2 h-4 w-4 shrink-0 opacity-80";
        switch (name) {
            case ProjectCategory.SYSTEMS_PROGRAMMING: return <Cpu className={cls} />;
            case ProjectCategory.GAMES: return <Gamepad2 className={cls} />;
            case ProjectCategory.GRAPHICS: return <ImageIcon className={cls} />;
            case ProjectCategory.FUNCTIONAL: return <FunctionSquare className={cls} />;
            case ProjectCategory.AI_ML: return <Brain className={cls} />;
            case ProjectCategory.WEB_DEV: return <Globe2 className={cls} />;
            case ProjectCategory.APP_DEV: return <Smartphone className={cls} />;
            case ProjectCategory.DATA_SCIENCE: return <Database className={cls} />;
            case ProjectCategory.DEVOPS: return <Settings className={cls} />;
            case ProjectCategory.SECURITY: return <Shield className={cls} />;
            case ProjectCategory.SPOOKY: return <Ghost className={cls} />;
            case ProjectCategory.DISCORD_SHENANIGANS: return <MessageSquare className={cls} />;
            default: return null;
        }
    };

    const hasMedia = (project: Project) => {
        const hasImage = project.imageUrl && !PLACEHOLDER_IMAGES.includes(project.imageUrl);
        const hasVideo = project.videoUrl && project.videoUrl.trim() !== '';
        return hasImage || hasVideo;
    };

    const getTransitionDelay = (idx: number, columns: number) => {
        const row = Math.floor(idx / columns);
        const col = idx % columns;
        // 60ms per card, row by row, left to right
        return (row * columns + col) * 60;
    };

    const getColumns = () => {
        if (typeof window === 'undefined') return 1;
        if (window.innerWidth >= 1280) return 5;
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    };
    const [columns, setColumns] = useState(getColumns());
    useEffect(() => {
        const onResize = () => setColumns(getColumns());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div className={`w-full max-w-7xl px-4 mx-auto flex flex-col items-center relative ${className}`} style={{ minHeight: 500 }}>
            {/* Category Selector Bar (non-sticky) */}
            <div className="w-full mb-6 md:mb-8">
                <div className="relative w-full rounded-xl border border-white/10 bg-black/30 backdrop-blur px-4 py-3 shadow-sm">
                    <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center">
                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3 z-10 relative">
                            {displayCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`
                                px-4 py-2 rounded-lg border transition-all duration-300
                                bg-black/20
                                ${selectedCategory === category 
                                    ? (categoryColors[category] || 'border-gray-400/50') + ' ring-1 ring-white/10' 
                                    : 'border-gray-600/30 hover:border-gray-400/50 hover:bg-black/30'
                                }
                                text-viewport-2 font-medium whitespace-nowrap
                            `}
                                    >
                                        <span className="inline-flex items-center">
                                            <CategoryIcon name={category} />
                                            {category}
                                        </span>
                                    </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="w-full relative" style={{ minHeight: 400 }}>
                {selectedCategory && (
                    <div className="space-y-6 w-full absolute left-0 top-0">
                        <div
                            key={gridKey}
                            className="mx-auto max-w-screen-xl grid gap-6 items-start justify-center grid-cols-[repeat(auto-fit,minmax(260px,1fr))]"
                        >
                            {filteredProjects.map((project, idx) => {
                                // Use the first category for color if in 'All'
                                const mainCategory = (project.categories && project.categories.length > 0)
                                    ? project.categories[0]
                                    : ProjectCategory.WEB_DEV;
                                const colorClass = categoryColors[mainCategory] || 'border-gray-400/50';
                                const delay = getTransitionDelay(idx, columns);
                                return (
                                    <div
                                        key={project.name}
                                        className={`
                                            group relative overflow-hidden rounded-xl border-2
                                            backdrop-blur-sm bg-black/20
                                            ${colorClass}
                                            transition-all duration-200 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5
                                            hover:ring-1 hover:ring-white/10
                                            ${cardsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                                        `}
                                        style={{
                                            pointerEvents: cardsVisible ? 'auto' : 'none',
                                            transitionDelay: `${cardsVisible ? delay : 0}ms`,
                                            maxWidth: 340,
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                    >
                                        {/* Project Image/Video (only if real) */}
                                        {hasMedia(project) ? (
                                            <div className="relative h-48 overflow-hidden">
                                                {project.videoUrl ? (
                                                    <video
                                                        src={project.videoUrl}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img
                                                        src={project.imageUrl}
                                                        alt={project.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                {/* Category badges */}
                                                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                                                    {project.categories?.slice(0, 2).map((c) => (
                                                        <span key={c} className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative h-16 bg-gradient-to-br from-slate-800/50 to-slate-600/40" />
                                        )}
                                        {/* Project Content */}
                                        <div className="p-6">
                                            <h3 className="text-viewport-3 font-semibold mb-2 group-hover:text-white transition-colors">
                                                {project.name}
                                            </h3>
                                            {/* Show description in All, but not summary */}
                                            {selectedCategory === ALL_CATEGORY ? (
                                                <p className="text-viewport-1 text-gray-300 mb-3">
                                                    {project.description}
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="text-viewport-1 text-gray-300 mb-3">
                                                        {project.description}
                                                    </p>
                                                    <p className="text-viewport-1 text-gray-400 text-sm leading-relaxed">
                                                        {project.summary}
                                                    </p>
                                                </>
                                            )}
                                            {/* Tech Stack as icons */}
                                            {project.usedTech && project.usedTech.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4 items-center">
                                                    {project.usedTech.map((tech: Tech) => {
                                                        const iconPath = `${ICONS_PATH}${tech}.svg`;
                                                        return (
                                                            <img
                                                                key={tech}
                                                                src={iconPath}
                                                                alt={tech}
                                                                title={tech.replace('_', ' ')}
                                                                className="w-6 h-6 inline-block bg-white/10 rounded p-1 border border-white/20"
                                                                onError={(e) => {
                                                                    // fallback to text if icon missing
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    const sibling = document.createElement('span');
                                                                    sibling.textContent = tech.replace('_', ' ');
                                                                    sibling.className = 'ml-1 text-xs text-gray-300';
                                                                    target.parentNode?.appendChild(sibling);
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {/* Links */}
                                            <div className="flex gap-3 mt-4">
                                                {project.githubLink && (
                                                    <a
                                                        href={project.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-viewport-1 text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        GitHub →
                                                    </a>
                                                )}
                                                {project.projectLink && (
                                                    <a
                                                        href={project.projectLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-viewport-1 text-green-400 hover:text-green-300 transition-colors"
                                                    >
                                                        Try It →
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryMenu; 
