(function () {
    const script = document.createElement('script');
    if (!localStorage.getItem("measurement-id")) localStorage.setItem("measurement-id", Math.random())
    const device = localStorage.getItem("measurement-id");
    script.onload = function () {
        console.re.log(device, performance.toJSON());
        setInterval(() => {
            console.re.log(device, performance.measureUserAgentSpecificMemory())
        }, 500);
    };
    script.setAttribute("data-channel", "kabeer-chats-prod");
    script.src = '//console.re/connector.js';
    script.crossOrigin = true;
    document.head.appendChild(script);
})()