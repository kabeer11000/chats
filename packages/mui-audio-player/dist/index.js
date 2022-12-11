var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "react", "@mui/material/Stack", "wavesurfer-react", "@mui/material", "@mui/material/IconButton", "@mui/icons-material/PlayArrow", "@mui/icons-material/Pause", "@mui/material/Slider"], function (require, exports, react_1, Stack_1, wavesurfer_react_1, material_1, IconButton_1, PlayArrow_1, Pause_1, Slider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    react_1 = __importStar(react_1);
    Stack_1 = __importDefault(Stack_1);
    IconButton_1 = __importDefault(IconButton_1);
    PlayArrow_1 = __importDefault(PlayArrow_1);
    Pause_1 = __importDefault(Pause_1);
    Slider_1 = __importDefault(Slider_1);
    var MuiAudioPlayer = function (_a) {
        var src = _a.src, _b = _a.size, size = _b === void 0 ? "medium" : _b, _c = _a.id, id = _c === void 0 ? "audio-player" : _c, _d = _a.display, display = _d === void 0 ? "waveform" : _d, _e = _a.showTimestamps, showTimestamps = _e === void 0 ? true : _e, _f = _a.containerWidth, containerWidth = _f === void 0 ? 250 : _f, _g = _a.containerHeight, containerHeight = _g === void 0 ? "auto" : _g, _h = _a.paperize, paperize = _h === void 0 ? true : _h, _j = _a.waveHeight, waveHeight = _j === void 0 ? 48 : _j, _k = _a.inline, inline = _k === void 0 ? false : _k, playPauseIconButtonProps = _a.playPauseIconButtonProps, props = __rest(_a, ["src", "size", "id", "display", "showTimestamps", "containerWidth", "containerHeight", "paperize", "waveHeight", "inline", "playPauseIconButtonProps"]);
        var _l = (0, react_1.useState)(true), loading = _l[0], setLoading = _l[1];
        var _m = (0, react_1.useState)(0), progress = _m[0], setProgress = _m[1];
        var _o = (0, react_1.useState)(false), playing = _o[0], setPlaying = _o[1];
        var _p = (0, react_1.useState)(0), position = _p[0], setPosition = _p[1];
        var _q = (0, react_1.useState)("00:00"), currentTime = _q[0], setCurrentTime = _q[1];
        var _r = (0, react_1.useState)(""), endTime = _r[0], setEndTime = _r[1];
        var _s = (0, react_1.useState)(null), audioElement = _s[0], setAudioElement = _s[1];
        var wavesurferRef = react_1.default.useRef();
        var handleMount = react_1.default.useCallback(function (waveSurfer) {
            wavesurferRef.current = waveSurfer;
            if (wavesurferRef.current) {
                if (src) {
                    wavesurferRef.current.load(src);
                }
                wavesurferRef.current.on("ready", function () {
                    var _a, _b;
                    setLoading(false);
                    if ((_a = wavesurferRef === null || wavesurferRef === void 0 ? void 0 : wavesurferRef.current) === null || _a === void 0 ? void 0 : _a.getDuration()) {
                        setEndTime(secondsToTimestring((_b = wavesurferRef === null || wavesurferRef === void 0 ? void 0 : wavesurferRef.current) === null || _b === void 0 ? void 0 : _b.getDuration()));
                    }
                });
                wavesurferRef.current.on("loading", function (n) {
                    setProgress(n);
                });
                ["finish", "error", "destroy", "pause"].forEach(function (e) { var _a; return (_a = wavesurferRef.current) === null || _a === void 0 ? void 0 : _a.on(e, function () { return setPlaying(false); }); });
                wavesurferRef.current.on("error", function (e) { return console.error(e); });
                wavesurferRef.current.on("playing", function () { return setPlaying(true); });
                wavesurferRef.current.on("audioprocess", function (e) {
                    setCurrentTime(secondsToTimestring(e));
                });
            }
        }, [src]);
        (0, react_1.useEffect)(function () {
            if (display != "timeline")
                return;
            audioElement === null || audioElement === void 0 ? void 0 : audioElement.pause();
            var audio = new Audio(src);
            audio.addEventListener("playing", function () { return setPlaying(true); });
            ["pause", "ended"].forEach(function (e) {
                return audio.addEventListener(e, function () { return setPlaying(false); });
            });
            audio.addEventListener("canplaythrough", function () {
                setLoading(false);
                setEndTime(secondsToTimestring(audio.duration));
            });
            audio.addEventListener("timeupdate", function () {
                setCurrentTime(secondsToTimestring(audio.currentTime));
                setPosition((audio.currentTime / audio.duration) * 100);
            });
            audio.addEventListener("error", function (e) { return console.error(e); });
            setAudioElement(audio);
        }, [src, display]);
        var handlePlay = function () {
            if (display == "timeline") {
                console.log(playing);
                if (!playing) {
                    console.info("playing");
                    audioElement === null || audioElement === void 0 ? void 0 : audioElement.play();
                }
                else
                    audioElement === null || audioElement === void 0 ? void 0 : audioElement.pause();
                return;
            }
            if (!wavesurferRef.current)
                return;
            if (playing) {
                return wavesurferRef.current.pause();
            }
            wavesurferRef.current.play();
            setPlaying(true);
        };
        var theme = (0, material_1.useTheme)();
        var waveColor = props.waveColor || theme.palette.primary.main;
        var PlayPauseButton = (0, react_1.useCallback)(function () {
            return loading && !playing ? null : (react_1.default.createElement(IconButton_1.default, __assign({ onClick: handlePlay, color: "primary" }, playPauseIconButtonProps), playing ? (react_1.default.createElement(Pause_1.default, { fontSize: size })) : (react_1.default.createElement(PlayArrow_1.default, { fontSize: size }))));
        }, [size, playPauseIconButtonProps, playing, loading, handlePlay]);
        if (!src)
            return null;
        return (react_1.default.createElement(Stack_1.default, { sx: __assign(__assign({}, (props.containerSx || {})), { height: containerHeight, width: containerWidth }), direction: inline ? "row" : "column", component: paperize ? material_1.Paper : "div", alignItems: "center" },
            loading && (react_1.default.createElement(material_1.Box, { width: "100%", flexGrow: 1 },
                react_1.default.createElement(material_1.LinearProgress, { variant: "determinate", style: { flexGrow: 1 }, value: progress }))),
            inline && !loading && (react_1.default.createElement(material_1.Box, { p: 1 },
                react_1.default.createElement(PlayPauseButton, null))),
            react_1.default.createElement(Stack_1.default, { component: material_1.Box, direction: "row", flexGrow: loading ? 0 : 1, height: "100%", width: "100%", alignItems: "center", spacing: 1 },
                showTimestamps && !loading && (react_1.default.createElement(material_1.Box, { pl: 1 },
                    react_1.default.createElement("small", { style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                            height: "100%",
                        } }, currentTime))),
                react_1.default.createElement(material_1.Box, { flexGrow: 1, height: "100%", width: "100%", alignItems: "center" },
                    display == "waveform" && (react_1.default.createElement(wavesurfer_react_1.WaveSurfer, { onMount: handleMount },
                        react_1.default.createElement(wavesurfer_react_1.WaveForm, { id: id, fillParent: true, mediaControls: true, waveColor: waveColor, height: waveHeight, hideScrollbar: true }))),
                    display == "timeline" && !loading && (react_1.default.createElement(material_1.Box, { mx: 1, display: "flex", alignItems: "center", height: "100%" },
                        react_1.default.createElement(Slider_1.default, { onChange: function (e, v) {
                                if (audioElement && typeof v == "number")
                                    audioElement.fastSeek((audioElement.duration / 100) * v);
                            }, size: "small", value: position })))),
                showTimestamps && !loading && (react_1.default.createElement(material_1.Box, { pr: 1 },
                    react_1.default.createElement("small", { style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                            height: "100%",
                        } }, endTime)))),
            react_1.default.createElement(material_1.Box, { display: "flex", p: 1, justifyContent: "center", alignItems: "center" }, !inline && (react_1.default.createElement(Stack_1.default, { spacing: 1, direction: "row" },
                react_1.default.createElement(PlayPauseButton, null))))));
    };
    var secondsToTimestring = function (seconds) {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(seconds);
        return date.toTimeString().slice(3, 8);
    };
    exports.default = react_1.default.memo(MuiAudioPlayer);
});
