const express = require('express');
const cors = require('cors');
const fs = require('fs');
const yaml = require('js-yaml');
const app = express();
const { exec, spawn } = require('child_process');
const bodyParser = require('body-parser')



app.use(cors({
    exposedHeaders: [
        "Map-Resolution", "Origin-X", "Origin-Y"
    ]
}));

app.use(bodyParser.json());


const cmdBegin = "rostopic pub /move_base_simple/goal geometry_msgs/PoseStamped '{ header: { frame_id: \"map\" }, pose:"
const cmdEnd = "}'"

let positions = ""
app.post('/target', function (req, res) {
    const data = req.body;
    if(data.position){
        console.log(JSON.stringify(data) );
    }else if(data.positions){
        fs.writeFileSync('target.json', JSON.stringify(data.positions))
        let dataString = ""
        data.positions.forEach(position => {
            dataString += JSON.stringify(position)+"\n" 
        });
        if(positions != dataString) {
            const time = new Date().getTime() ;
            const header = "header" + time + "\n";
            const end = "end"+ time;
            positions = dataString;
            console.log(dataString);
            fs.writeFileSync('target.txt', header + dataString + end)
        }

        
    }
    //console.log(xx.length)
    // const cmd = cmdBegin + JSON.stringify(pose) + cmdEnd;
    // console.log(cmd)
    // exec(cmd)
    res.send("done")
})


//const shellLocation = spawn('sh',['./script.sh']);

const shellLocation = spawn('node', ['./fakelocation.js']);

let locationData
shellLocation.stdout.on('data', (data) => {
    try {
        locationData = yaml.safeLoad(data.toString().substring(0, data.length - 4))
        const timeAngle = new Date().getTime() / 3000;
        locationData.pose.pose.position.x = .1 * (Math.random() - 0.5) + Math.sin(timeAngle) * 3
        locationData.pose.pose.position.y = .1 * (Math.random() - 0.5) + Math.cos(timeAngle) * 3
        locationData.pose.pose.orientation.z =   Math.sin((-(timeAngle+ Math.PI)%(2*Math.PI)+Math.PI) / 2 )
        locationData.pose.pose.orientation.w =   Math.cos((-(timeAngle+ Math.PI)%(2*Math.PI) + Math.PI)/ 2 )
    } catch{ }
});
shellLocation.stderr.on('data', (data) => {
    console.error(data);
});

app.get('/location', function (req, res) {
    if (locationData) {
        res.send(locationData.pose.pose)
    } else {
        res.statusCode = 404;
        res.write('data not available');
        res.end();
    }
})

const shellMap = spawn('node', ['./fakeMap.js']);

let mapFile;
shellMap.stdout.on('data', (data) => {
    dataString = data.toString();
    if (dataString.length < 10) {
        try {
            const mapCount = parseInt(dataString);
            info = yaml.safeLoad(fs.readFileSync(__dirname + '/Files/' + 'map' + mapCount + '.yaml', 'utf8'));
            path = __dirname + '/Files/map' + mapCount + '.pgm' // 模拟选项
            mapFile = { info, path }
        } catch{
            mapFile = null;
        }
    }
});
shellMap.stderr.on('data', (data) => {
    console.error(data);
});


app.get('/map', function (req, res) {

    if (mapFile) {
        res.setHeader("Map-Resolution", mapFile.info.resolution);
        res.setHeader("Origin-X", mapFile.info.origin[0]);
        res.setHeader("Origin-Y", mapFile.info.origin[1]);
        res.sendFile(mapFile.path);
    }
    else {
        res.statusCode = 404;
        res.write('404 sorry not found');
        res.end();
    }
});



app.listen(5000);
