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
    VULKAN = "vulkan"
}

export enum ProjectCategory {
    SYSTEMS_PROGRAMMING = "Systems Programming",
    GAME_DEV = "Graphics/Games",
    FUNCTIONAL = "Functional",
    AI_ML = "AI & ML",
    WEB_DEV = "Web",
    APP_DEV = "Apps",
    DATA_SCIENCE = "Data Science",
    DEVOPS = "DevOps",
    SECURITY = "Security",
    SPOOKY = "???"
}

export default interface Project {
    name: string;
    description: string;
    summary: string;
    categories: ProjectCategory[];
    imageUrl?: string;
    usedTech?: Tech[];
    projectLink?: string;
    githubLink?: string;
}

/* Defining my projects here */
export const IKEA_GAME: Project = {
    name: "Procedural Level Generation",
    description: "Level generator inspired by WFC algorithms",
    summary: `An attempt at implementing a 2d WFC algorithm in rust.
    Built and distributed as a dynamic library and used in a unity game to generate an infinite maze.  
    Customizable with a JSON payload (questionable choice).`,
    categories: [ProjectCategory.GAME_DEV],
    imageUrl: "projects/procedural_gen.gif",
    usedTech: [Tech.RUST, Tech.CSHARP, Tech.UNITY],
    githubLink: "https://github.com/niooii/procedural-ikea-generation"
};

export const GDF: Project = {
    name: "GDF",
    description: "Multiplayer game built on a custom engine",
    summary: `Originally started as a very ambitious final project for my game development class (it's been 2 years). 
    The engine is being developed for
     low level, cross platform game development with a focus on efficient rendering and customizability.`,
    categories: [ProjectCategory.SYSTEMS_PROGRAMMING, ProjectCategory.GAME_DEV],
    imageUrl: "projects/gdf.gif",
    usedTech: [Tech.C, Tech.CPP, Tech.VULKAN],
    githubLink: "https://github.com/niooii/gdf"
};

export const JUPITER_ED: Project = {
    name: "Jupiter-Ed App",
    description: "Mobile app for viewing high school grades assignments, and more",
    summary: `An app I developed as an alternative to Jupiter Ed's web application,
    designed to be more intuitive with many new quality of life features. Spent a couple months  
    poking around their backend, and creating a thin wrapper around it exposed as a REST api. 
    The frontend was developed by a friend and I.`,
    categories: [ProjectCategory.APP_DEV, ProjectCategory.WEB_DEV],
    imageUrl: "projects/jupiter.gif",
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
    imageUrl: "projects/placeholder.svg",
    usedTech: [Tech.HASKELL],
    githubLink: "https://github.com/niooii/music-player"
};

export const OCLOUD: Project = {
    name: "ocloud",
    description: "A convenient set of tools for a self-hosted cloud service.",
    summary: `Infinite cloud storage for free! Except you pay for hard drives, possible hosting expenses, electricity, 
    data loss and corruption... 
    but at least you own your data`,
    categories: [ProjectCategory.WEB_DEV],
    imageUrl: "projects/placeholder.svg",
    usedTech: [Tech.RUST],
    githubLink: "https://github.com/niooii/ocloud"
};

export const FLYING_HORSE: Project = {
    name: "Flying horse",
    description: "A simulation/game in C++, built with SDL2",
    summary: `My first non-trivial C++ program, and first introduction to many linear algebra & physics concepts.
    What do you mean it's not good game design to trap the user inside your window until they win?`,
    categories: [ProjectCategory.GAME_DEV],
    imageUrl: "projects/horse.gif",
    usedTech: [Tech.CPP],
    githubLink: "https://github.com/niooii/FLYING-HORSE"
};

export const BARRIER_ST: Project = {
    name: "Barrier St.",
    description: "...",
    summary: `...`,
    categories: [ProjectCategory.SPOOKY],
    imageUrl: "projects/placeholder.svg",
    usedTech: [Tech.PYTHON],
    // githubLink: "https://github.com/niooii/FLYING-HORSE"
};