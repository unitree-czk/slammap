const spawn = require('child_process').spawn;


const myShellScript = spawn('sh',['./script.sh']);

myShellScript.stdout.on('data', (data)=>{
    dataString = data.toString();
    console.log(dataString.length)
    // do whatever you want here with data
});
myShellScript.stderr.on('data', (data)=>{
    console.error(data);
});
