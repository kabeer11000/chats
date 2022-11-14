export default function convert() {
    const reg = `
        import AppBar from "@mui/material/AppBar"
        import Avatar from "@mui/material/Avatar"
        import IconButton from "@mui/material/IconButton"
        import Typography from "@mui/material/Typography"
        import Toolbar from "@mui/material/Toolbar";
        import InputBase from "@mui/material/InputBase";
        import Paper from "@mui/material/Paper";
        import MenuIcon from "@mui/icons-material/Menu";
        import SearchIcon from "@mui/icons-material/Search";
    `.replaceAll(`'`, `"`).trim().split("\n")
    const conv = (n, p) => `const ${n} = dynamic(() => import("${p}"))`;
    const regexStart = /(import )([A-z]+)(?= from)/ // /(import\s)([^\s#]+)(?=\sfrom)/g
    const regexEnd = /(\"[^)]+\")+/
    const output = []

    for (const string of reg) {
        const namedImport = regexStart.exec(string.trim())[2]//?.[0].split(" ")[1];
        const module = regexEnd.exec(string.trim())[0].slice(1, -1)
        output.push(conv(namedImport, module))
    }
    return (output.join("\n"));
}