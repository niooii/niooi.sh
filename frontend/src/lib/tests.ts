import { FileSystem, Path } from "./filesystem";

console.log("test begin");

let cwd = new Path("/");
let path1 = new Path("/");
console.log(path1.name());
console.log(path1.parent());

path1.push(new Path("type/shit//////"));
console.log(path1.name());
console.log(path1.parent());

console.log("testing fs");
let fs = new FileSystem();
let dPath = new Path("/a/b/c/d");
let d = fs.makeFile(dPath);
console.log(dPath.getPathParts());
console.log(fs);
let c = fs.getNode(new Path("/a/b/c/d"));
console.log(c);
let root = fs.getNode(new Path("/"));
console.log(root);