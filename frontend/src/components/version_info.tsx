import { useEffect, useState } from "react";

interface CommitInfoProps {
    className?: string;
}

const CommitInfo = ({className}: CommitInfoProps) => {
    const [commitInfo, setCommitInfo] = useState({
        sha: "Loading...",
        message: "Loading..."
    });

    useEffect(() => {
        setCommitInfo({
            sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "UNKNOWN",
            message: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE || "UNKNOWN"
        });
    }, []);

    return (
        <h1 className={className}>
            Build: {commitInfo.sha.substring(0, 7)} - "{commitInfo.message}"
        </h1>
    );
};

export default CommitInfo;