// PLEASE ADD SUM TYPES I BEG
export enum FileType {
    File,
    Directory
}

export class Path {
    private pathStr: string;
    
    constructor(pathString: string) {
        if (pathString.length === 0)
            throw new Error("Path cannot be an empty string.");
        this.pathStr = pathString;
        this.removeTrailingSlashes();
        // atp we can assume no trailing slashes
    }

    // A path is considered absolute if it starts with the root: "/"
    public isAbsolute(): boolean {
        return this.pathStr.startsWith("/");
    }

    // A path is considered relative if it does not start with the root: "/"
    public isRelative(): boolean {
        return !this.isAbsolute();
    }

    private removeTrailingSlashes() {
        if (this.pathStr.length > 1) {
            // Remove trailing slashes (regex magic)
            this.pathStr = this.pathStr.replace(/\/+$/, "");
        }
    }

    // Returns undefined if the path is the root directory, or if the parent
    // of the relative path cannot be known.
    public parent(): Path | undefined {
        if (this.pathStr === "/") {
            return undefined;
        }

        let path = this.pathStr;
        
        const lastSlashIdx = path.lastIndexOf("/");
        
        // if no slashes (rel file/dir)
        if (lastSlashIdx === -1) {
            return undefined;
        }

        // then parent must be root
        if (lastSlashIdx === 0) {
            return new Path("/");
        }

        return new Path(path.substring(0, lastSlashIdx));
    }

    public name(): string {
        let path = this.pathStr;
        
        // Handle root directory
        if (path === "/") {
            return "/";
        }

        const lastSlashIndex = path.lastIndexOf("/");
        if (lastSlashIndex === -1) {
            return path;
        }

        // Return everything after the last slash
        return path.substring(lastSlashIndex + 1);
    }

    public push(other: Path) {
        if (other.isAbsolute()) {
            throw new Error("Cannot push an absolute path");
        }

        let basePath = this.pathStr;
        
        if (basePath === "/") {
            basePath = "";
        }

        this.pathStr = `${basePath}/${other.pathStr}`;
    }

    public pop() {
        const parent = this.parent();
        if (parent === undefined) {
            throw new Error("Cannot pop from root or invalid path");
        }
        
        this.pathStr = parent.pathStr;
    }
}

interface INode {
    path: Path;
    type: FileType;
    // only present for files
    content?: string;
    // only present for directories 
    children?: Map<string, INode>;
    parent?: INode;
    createdAt: Date;
    modifiedAt: Date;
}

export class FileSystem {
    private root: INode;
    
    constructor() {
        this.root = this.createNode(new Path("/"), FileType.Directory);
    }

    private createNode(path: Path, type: FileType, content?: string): INode {
        const now = new Date();
        return {
            path,
            type,
            content: type === FileType.File ? content || "" : undefined,
            children: type === FileType.Directory ? new Map() : undefined,
            createdAt: now,
            modifiedAt: now,
        };
    }
}