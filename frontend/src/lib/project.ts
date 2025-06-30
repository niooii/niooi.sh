export enum Tech {
    APACHE_MAVEN = "apache_maven",
    C = "c",
    CPP = "cpp",
    CSHARP = "csharp",
    DART = "dart",
    DISCORD = "discord",
    FLUTTER = "flutter",
    GITHUB = "github-white",
    GOOGLE_GMAIL = "google-gmail",
    HASKELL = "haskell",
    JAVA = "java",
    NASM = "nasm",
    PYTHON = "python",
    RUST = "rust",
    TAILWIND = "tailwind",
    UNITY = "unity",
    VULKAN = "vulkan",
    TS = "ts",
    ROBLOX = "roblox",
    LUA = "lua"
}

export enum ProjectCategory {
    SYSTEMS_PROGRAMMING = "Systems Programming",
    GRAPHICS = "Graphics",
    GAMES = "Games",
    FUNCTIONAL = "Functional",
    AI_ML = "AI & ML",
    WEB_DEV = "Web",
    APP_DEV = "Apps",
    DATA_SCIENCE = "Data Science",
    DEVOPS = "DevOps",
    SECURITY = "Security",
    DISCORD_SHENANIGANS = "Discord Shenanigans",
    SPOOKY = "???"
}

export default interface Project {
    name: string;
    description: string;
    summary: string;
    categories: ProjectCategory[];
    imageUrl?: string;
    videoUrl?: string;
    usedTech?: Tech[];
    projectLink?: string;
    githubLink?: string;
}

/* Defining my projects here */
export const IKEA_GAME: Project = {
    name: "WFC Level Generation",
    description: "Level generator inspired by WFC algorithms",
    summary: `An attempt at implementing a 2d WFC algorithm in rust.
    Built and distributed as a dynamic library and used in a unity game to generate an infinite maze.  
    Customizable with a JSON payload (questionable choice).`,
    categories: [ProjectCategory.GAMES],
    imageUrl: "projects/procedural_gen.gif",
    usedTech: [Tech.RUST, Tech.CSHARP, Tech.UNITY],
    githubLink: "https://github.com/niooii/procedural-ikea-generation"
};

export const GDF: Project = {
    name: "GDF",
    description: "WIP voxel engine & soon-to-be game",
    summary: `Originally started as a very ambitious final project for my game development class (it's been 2 years). 
    The engine is being developed for
     low level, cross platform game development with a focus on efficient voxel rendering and customizability.`,
    categories: [ProjectCategory.SYSTEMS_PROGRAMMING, ProjectCategory.GRAPHICS, ProjectCategory.GAMES],
    imageUrl: "projects/gdf.gif",
    usedTech: [Tech.C, Tech.CPP, Tech.VULKAN],
    githubLink: "https://github.com/niooii/gdf"
};

export const JUPITER_ED: Project = {
    name: "Jupiter-Ed App",
    description: "Mobile app for viewing high school grades, assignments, and more",
    summary: `An app I developed as an alternative to Jupiter Ed's web application,
    designed to be more intuitive with many new quality of life features. Spent a couple months  
    poking around their backend, and creating a thin wrapper around it exposed as a REST api. 
    The frontend was developed by a friend and I.`,
    imageUrl: "projects/output.gif",
    categories: [ProjectCategory.APP_DEV, ProjectCategory.WEB_DEV],
    usedTech: [Tech.RUST, Tech.JAVA, Tech.FLUTTER],
    githubLink: "https://github.com/niooii/jupitered-frontend"
};

export const YOLO_CV: Project = {
    name: "Autonomy and Computer Vision",
    description: "Training YOLO models & building autonomous systems for a rover",
    summary: `Python brings me so much pain`,
    categories: [ProjectCategory.AI_ML, ProjectCategory.APP_DEV],
    imageUrl: "projects/cv.gif",
    usedTech: [Tech.UNITY, Tech.PYTHON],
    githubLink: "https://github.com/BinghamtonRover/Rover-Code"
};

export const ONION_OS: Project = {
    name: "Onion OS",
    description: "Tiny OS kernel written in Rust and C",
    summary: `A tiny kernel written with C and Rust, with an automatic one-way binding 
    generator so I could easily integrate lower level C/assembly functions in my Rust code. 
    Mostly an educational and for-fun thing. Extremely unfinished. `,
    categories: [ProjectCategory.SYSTEMS_PROGRAMMING],
    imageUrl: "projects/onion-os-small.gif",
    usedTech: [Tech.C, Tech.RUST],
    githubLink: "https://github.com/niooii/onion-os"
};

export const MUSIC_LANG: Project = {
    name: "Music Language Compiler",
    description: "A language that \"compiles\" down to a .wav file",
    summary: `My first introduction to functional parsing. Probably the thing that got me interested in category theory.`,
    categories: [ProjectCategory.FUNCTIONAL],
    usedTech: [Tech.HASKELL],
    githubLink: "https://github.com/niooii/music-player"
};

export const OCLOUD: Project = {
    name: "ocloud",
    description: "A convenient set of tools for a self-hosted cloud service",
    summary: `Infinite cloud storage for free! Except you pay for hard drives, possible hosting expenses, electricity, 
    data loss and corruption... 
    but at least you own your data`,
    categories: [ProjectCategory.WEB_DEV],
    usedTech: [Tech.RUST],
    githubLink: "https://github.com/niooii/ocloud"
};

export const FLYING_HORSE: Project = {
    name: "Flying horse",
    description: "A simulation/game in C++, built with SDL2",
    summary: `My first non-trivial C++ program, and first introduction to many linear algebra & physics concepts.
    What do you mean it's not good game design to trap the user inside your window until they win?`,
    categories: [ProjectCategory.GAMES],
    imageUrl: "projects/horse.gif",
    usedTech: [Tech.CPP],
    githubLink: "https://github.com/niooii/FLYING-HORSE",
    projectLink: "https://github.com/niooii/FLYING-HORSE/releases/tag/1.2"
};

export const BARRIER_ST: Project = {
    name: "Barrier St.",
    description: "...",
    summary: `...`,
    categories: [ProjectCategory.SPOOKY],
    usedTech: [Tech.PYTHON],
    // githubLink: "https://github.com/niooii/FLYING-HORSE"
};

export const MANDELBULB_RENDER: Project = {
    name: "Mandlebulb Explorer",
    description: "Messing around with 3d fractals",
    summary: `...`,
    categories: [ProjectCategory.GRAPHICS],
    videoUrl: "projects/mandelbulb.mov",
    usedTech: [Tech.RUST],
    githubLink: "https://github.com/niooii/sdl-gl-rs-template"
};

export const JULIA_RENDER: Project = {
    name: "Julia Set(?)",
    description: "Julia set parameterization getting out of hand...",
    summary: `...`,
    categories: [ProjectCategory.GRAPHICS],
    videoUrl: "projects/julia.mov",
    usedTech: [Tech.TS],
    projectLink: "/mandelbrot",
    githubLink: "https://github.com/niooii/niooi.sh/blob/main/frontend/src/components/vfx/mandelbrot.tsx"
};

export const DISCORD_USER: Project = {
    name: "Discord User API",
    description: "Reverse engineering over reading documentation",
    summary: `A discord API wrapper written in Rust, with a focus on the user API. 
    Spent a good two weeks reverse engineering the gateway API, I don't think this is allowed but
    it was definitely worthwhile.`,
    categories: [ProjectCategory.WEB_DEV, ProjectCategory.DISCORD_SHENANIGANS],
    usedTech: [Tech.RUST],
    githubLink: "https://github.com/niooii/discord-rs"
};

export const DISCORD_CLONER: Project = {
    name: "Discord Cloner",
    description: "Fine-tuning a LLM on discord messages (with consent)",
    summary: `An attempt to 'clone' a discord user by fine-tuning a LLM on our messages. A WIP.`, 
    categories: [ProjectCategory.AI_ML, ProjectCategory.DISCORD_SHENANIGANS],
    usedTech: [Tech.RUST],
    githubLink: "https://github.com/niooii/discordinator"
};

export const SCORN: Project = {
    name: "Scorn",
    description: "Roblox combat game with a bunch of lore",
    summary: `...`, 
    videoUrl: "projects/scorn.mov",
    categories: [ProjectCategory.GAMES],
    usedTech: [Tech.ROBLOX, Tech.LUA],
};

export const SHADER_APP: Project = {
    name: "Mobile Raymarcher",
    description: "Having fun with SDFs and infinite tiled geometry",
    summary: `An introduction to raymarching and path tracing ideas. Took quite some tweaks to get it
     to work on mobile.`, 
    videoUrl: `projects/shader_app.mp4`,
    categories: [ProjectCategory.GRAPHICS, ProjectCategory.APP_DEV],
    usedTech: [Tech.FLUTTER],
};

export const TRUMAN: Project = {
    name: "The Truman Show",
    description: "...",
    summary: `...`, 
    categories: [ProjectCategory.AI_ML, ProjectCategory.DISCORD_SHENANIGANS],
    usedTech: [Tech.RUST],
    githubLink: "https://github.com/niooii/discord-rs"
};