"use client"

import CategoryMenu from "@/components/category_menu";
import ShinyText from "@/components/ShinyText";
import { FLYING_HORSE, GDF, IKEA_GAME, JUPITER_ED, MUSIC_LANG, ONION_OS, OCLOUD, YOLO_CV, BARRIER_ST, MANDELBULB_RENDER, JULIA_RENDER, DISCORD_USER, DISCORD_CLONER, SCORN, SHADER_APP, OSU } from "@/lib/project";

export default function Portfolio() {
    // All projects array for the category menu
    const allProjects = [
        GDF,
        FLYING_HORSE,
        SCORN,
        IKEA_GAME,
        OSU,
        YOLO_CV,
        MANDELBULB_RENDER,
        JULIA_RENDER,
        SHADER_APP,
        JUPITER_ED,
        ONION_OS,
        DISCORD_USER,
        DISCORD_CLONER,
        OCLOUD,
        BARRIER_ST,
        MUSIC_LANG,
    ];

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            {/* Header */}
            <header className="relative mx-auto w-full max-w-7xl px-6 pt-16 pb-8 text-center">
                <ShinyText
                    text="Portfolio"
                    className="text-viewport-9 font-semibold tracking-tight"
                    speed={6}
                />
                <p className="mx-auto mt-3 max-w-3xl text-viewport-3 text-gray-300">
                     Fun personal projects
                </p>
            </header>

            {/* Content */}
            <main className="relative mx-auto w-full max-w-7xl px-4 pb-16">
                <CategoryMenu projects={allProjects} />
            </main>
        </div>
    );
}
