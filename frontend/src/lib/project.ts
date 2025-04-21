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
    GAME_DEV = "Graphicps/Game dev",
    FUNCTIONAL = "Functional",
    AI_ML = "AI & ML",
    WEB_DEV = "Web dev",
    APP_DEV = "App dev",
    DATA_SCIENCE = "Data Science",
    DEVOPS = "DevOps",
    SECURITY = "Security"
}

export default interface Project {
    id: number;
    name: string;
    description: string;
    categories: ProjectCategory[];
    imageUrl?: string;
    usedTech?: Tech[];
    projectLink?: string;
    githubLink?: string;
}