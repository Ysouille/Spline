canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
var pts_color = "purple"
//var X = [250, 250, 350, 350, 100, 100, 450]
//var Y = [250, 350, 350, 150, 150, 450, 450]
var PTS =[];
var spline_pts = [];

function drawPoints(pts, color) {
    for (var i = 0; i < pts.length; i++){
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 5, 0, 2 *Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function intermediatePoints(pt1, pt2, t){
    return{
        x: (pt2.x * t) + ((1 - t) * pt1.x),
        y: (pt2.y * t) + ((1 - t) * pt1.y)
       };
}

function draw (pt1, pt2, t) {
    ctx.beginPath();
    ctx.strokeStyle = "#00FFF0";
    ctx.lineWidth = 5;
    ctx.moveTo(pt1.x, pt1.y)
    var pt = intermediatePoints(pt1, pt2, t)
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function nextLevel(points, t){
    var newPoints = []; 
    for(var i = 0; i < points.length - 1; i++){
        newPoints.push(intermediatePoints(points[i], points[i + 1], t));
    }
    return newPoints; 
}

canvas.addEventListener("click", function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left; 
    var y = e.clientY - rect.top;
    PTS.push({ x: x, y: y});
});

function draw_spline() {
    ctx.beginPath();
    ctx.moveTo(spline_pts[0].x, spline_pts[0].y);
    ctx.lineWidth = 5
    ctx.strokeStyle = "green";
    for (var i = 0; i < spline_pts.length - 1; i++) {
        ctx.lineTo(spline_pts[i].x, spline_pts[i].y);
    }
    ctx.stroke();
}

t = 0;
setInterval(function() {
    t += 0.01;
    if(t > 1) {
        t = 0;
        spline_pts = []
    }
    clear ();
    var points = PTS;
    while (points.length > 1) {
        for (var i = 0; i < points.length - 1; i++) {
            draw(points[i], points[i + 1], 1);
        }
        drawPoints(points, pts_color);
    points = nextLevel(points, t);
    }
    if(points.length >=1) {
        spline_pts.push(points[0]);
        draw_spline();
    }
} , 10);

function load (){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    PTS = urlParams.get('PTS');
    PTS = eval(PTS);
    if(PTS == null){
        PTS =[
            { x : 250, y: 250},
            { x : 250, y: 350},
            { x : 350, y: 350},
            { x : 350, y: 150},
            { x : 100, y: 150},
            { x : 100, y: 450},
            { x : 450, y: 450},
        ];
    }
}
load()
function save(){
    k= JSON.stringify(PTS)
    k2= encodeURIComponent(k)
    const url = window.location.href.split('?')[0] = "?PTS=" + k2;
    window.location.replace(url);
}