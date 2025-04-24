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
    name: "Procedural level generation",
    description: "Level generator inspired by the wave function collapse algorithm",
    summary: `An attempt at implementing a 2d WFC algorithm in rust.
    Used in conjunction with a unity project to generate infinite scenes in a
    goofy, survival themed horror game.`,
    categories: [ProjectCategory.GAME_DEV],
    imageUrl: "projects/procedural_gen.gif",
    usedTech: [Tech.RUST, Tech.CSHARP, Tech.UNITY],
    githubLink: "https://github.com/niooii/procedural-ikea-generation"
};

export const GDF: Project = {
    name: "GDF",
    description: "Graphics framework built for low level game development, paired with a game",
    summary: `The game you see here is currently in development, written in C++. 
    One of it's dependencies is a C library I am currently developing for
     low level, cross platform game development with a focus on efficient rendering and customizability.`,
    categories: [ProjectCategory.SYSTEMS_PROGRAMMING, ProjectCategory.GAME_DEV],
    imageUrl: "projects/gdf.gif",
    usedTech: [Tech.C, Tech.CPP, Tech.VULKAN],
    githubLink: "https://github.com/niooii/gdf"
};

export const JUPITER_ED: Project = {
    name: "Academic Summary App",
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
    name: "Rover CV",
    description: "Training YOLO models & building autonomous systems",
    summary: ``,
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
    summary: `...`,
    categories: [ProjectCategory.FUNCTIONAL],
    imageUrl: "projects/placeholder.svg",
    usedTech: [Tech.HASKELL],
    githubLink: "https://github.com/niooii/onion-os"
};

export const NIOOI_SH: Project = {
    name: "This Website",
    description: "ahahah...",
    summary: `...`,
    categories: [ProjectCategory.WEB_DEV],
    imageUrl: "projects/placeholder.svg",
    usedTech: [Tech.C],
    githubLink: "https://github.com/niooii/niooi.sh"
};

export const FLYING_HORSE: Project = {
    name: "Flying horse",
    description: "A simulation/game in C++, built with SDL2",
    summary: `My first non-trivial C++ program. Originally aimed to be a physics simulation but quickly 
    spun off into a game about a flying horse trying to break free from captivity. The game is mostly a simulation, 
    but you can activate the boss fight by pressing a certain key. The boss traps you in the window (yes, you as the user) until you either defeat him, 
    or die.`,
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