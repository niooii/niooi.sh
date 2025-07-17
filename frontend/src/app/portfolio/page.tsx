"use client"

import CategoryMenu from "@/components/category_menu";
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
        <>
            <style jsx global>{`
                html, body {
                    background: #1f2937 !important;
                    min-height: 100%;
                }
            `}</style>
            <div style={{ 
                background: "#1f2937",
                minHeight: "100vh",
                width: "100vw",
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "2rem",
                paddingBottom: "4rem"
            }}>
            <div style={{ 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: "1200px"
            }}>
                <h1 className="text-center text-viewport-8 font-semibold mb-8 text-white">
                    My Portfolio
                </h1>
                <h1 className="text-center text-viewport-3 font-semibold mb-8 text-white">
                    i don't do web design could you tell
                </h1>
                <CategoryMenu projects={allProjects} />
            </div>
        </div>
        </>
    );
}