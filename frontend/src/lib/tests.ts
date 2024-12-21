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

let p = new Path("/a/./././../b");
console.log(p.toString());
let p2 = new Path(".");
console.log(p2.toString());
let p3 = new Path("/a/b/../");
console.log(p3.toString());
let p4 = new Path("/home/niooi/../../../");
console.log(p4.toString());
let p5 = new Path("/");
console.log(p5.toString());
p5.push(new Path("./"));
console.log(p5.toString());