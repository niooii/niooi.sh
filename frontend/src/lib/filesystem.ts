// PLEASE ADD (better) SUM TYPES I BEG
export enum FileType {
    File,
    Directory
}

export class Path {
    private pathStr: string;
    
    // Uses front slashes
    constructor(pathString: string) {
        if (pathString.length === 0)
            throw new Error("Path cannot be an empty string.");
        this.pathStr = pathString;
        this.removeTrailingSlashes();
        // atp we can assume no trailing slashes
        this.resolveRelativeParts();
    }

    public toString(): string {
        // force deep copy
        return `${this.pathStr}`;
    }

    // Returns a new path object from the current one, not a ref.
    public clone() {
        return new Path(this.toString());
    }

    // Sets the current path to the one passed in
    public set(to: Path) {
        this.pathStr = to.toString();
    }
    
    // A path is considered absolute if it starts with the root: "/"
    public isAbsolute(): boolean {
        return this.pathStr.startsWith("/");
    }

    public isRoot(): boolean {
        return this.pathStr === "/";
    }

    // A path is considered relative if it does not start with the root: "/"
    public isRelative(): boolean {
        return !this.isAbsolute();
    }

    // Includes the root path if applicable.
    public getPathParts(): string[] {
        if (this.isRoot())
            return ["/"];

        let parts = this.pathStr.split("/");
        if (this.isAbsolute()) {
            parts[0] = "/";
        }
        return parts;
    }

    // Processes all the '../' and './' parts of the path, or leaving them if they cannot be resolved.
    private resolveRelativeParts() {
        let parts = this.getPathParts();
        const isAbsolute = this.isAbsolute();
        if (isAbsolute) {
            parts.splice(0, 1);
        }

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part === "." && (i !== 0 || isAbsolute)) {
                parts.splice(i, 1);
                i--;
                continue;
            }
            if (part === "..") {
                if (parts[i-1] === "..")
                    continue;
                if (i >= 1) {
                    parts.splice(i - 1, 2);
                    i -= 2;
                } else if (isAbsolute) {
                    parts.splice(i, 1);
                    i--;
                }
                continue;
            }
        }
        this.pathStr = `${isAbsolute ? "/" : ""}${parts.join("/")}`;
    }

    private removeTrailingSlashes() {
        if (this.pathStr.length > 1) {
            const endsOnSlash = this.pathStr[this.pathStr.length-1] === "/";
            // Remove trailing slashes (regex magic)
            this.pathStr = this.pathStr.replace(/\/+$/, "");
            if (endsOnSlash)
                this.pathStr = this.pathStr.concat("/");
        }
    }

    public equals(other: Path): boolean {
        return other.pathStr === this.pathStr;
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
        
        const endsOnSlash = this.pathStr[this.pathStr.length-1] === "/";
        this.pathStr = `${basePath}${endsOnSlash ? "" : "/"}${other.pathStr}`;
        this.resolveRelativeParts();
        this.removeTrailingSlashes();
    }

    public pop() {
        const parent = this.parent();
        if (parent === undefined) {
            throw new Error("Cannot pop from root or invalid path");
        }
        
        this.pathStr = parent.pathStr;
    }
}

export interface FileNode {
    path: Path;
    type: FileType;
    // only present for files
    content?: string;
    // only present for directories 
    children?: Map<string, FileNode>;
    executable: boolean,
    executionCallback: ((args: string[]) => number) | undefined,
    parent?: FileNode;
    createdAt: Date;
    modifiedAt: Date;
}

// Fun little mock filesystem for the shell gimmick
export class FileSystem {
    private root: FileNode;
    
    constructor() {
        this.root = this.createNode(new Path("/"), FileType.Directory);
    }

    private createNode(path: Path, type: FileType, content?: string): FileNode {
        const now = new Date();
        return {
            path,
            type,
            content: type === FileType.File ? content || "" : undefined,
            children: type === FileType.Directory ? new Map() : undefined,
            executable: false,
            executionCallback: undefined,
            createdAt: now,
            modifiedAt: now,
        };
    }

    // creates all intermediate directories if they dont exist, up until the current name of the path
    // Returns the last created node (the parent of the target path) or the problematic node.
    // yay head recursion
    private createIntermediateDirectories(path: Path): [FileNode, boolean] {
        if (path.isRelative())
            throw new Error("To create intermediate direcotires, path cannot be relative.");

        // will never be undefined from implementation details.
        let subPath = path.parent()!;
        if (subPath.isRoot()) {
            // hit root directory
            return [this.root, true];
        } else {
            const nodeAtSubPath = this.getNode(subPath);
            if (nodeAtSubPath !== undefined) {
                return [nodeAtSubPath, nodeAtSubPath.type !== FileType.File];
            }
            
            let [node, status] = this.createIntermediateDirectories(subPath);
            if (!status) {
                return [node, status];
            }
            const name = subPath.name();
            const newNode = this.createNode(subPath, FileType.Directory);
            node.children!.set(name, newNode);
            return [newNode, true];
        }
    }

    public getNode(path: Path): FileNode | undefined {
        if (path.isRelative())
            throw new Error("Expected an absolute path when fetching node.");

        let parts = path.getPathParts();
        let node = this.root;
        // skip first node (is root)
        for (let i = 1; i < parts.length; i++) {
            let part = parts[i];
            console.log(part);
            let child = node.children!.get(part);
            // if child is a file and if it is not the last entry then return undefined
            if (child === undefined || (child.type === FileType.File && i !== parts.length - 1)) {
                return undefined;
            }
            node = child;
        }
        return node;
    }

    public makeDir(path: Path): FileNode | undefined {
        let [parentNode, status] = this.createIntermediateDirectories(path);
        if (!status)
            return undefined;

        parentNode.children!.set(path.name(), this.createNode(path, FileType.Directory));
        return parentNode.children!.get(path.name())!;
    }

    public makeFile(path: Path, content?: string): FileNode | undefined  {
        let [parentNode, status] = this.createIntermediateDirectories(path);
        if (!status)
            return undefined;

        parentNode.children!.set(path.name(), this.createNode(path, FileType.File));
        return parentNode.children!.get(path.name())!;
    }

    public setExecutable(file: FileNode, executionCallback: (args: string[]) => number) {
        file.executable = true;
        file.executionCallback = executionCallback;
    }
}