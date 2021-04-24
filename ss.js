const si = require('systeminformation');

// callback style
si.cpu(function(data) {
    console.log('CPU-Information:-00000000000000');
    console.log(data);
});
si.battery(function(data) {
    console.log('CPU-Information:-111111111111111');
    console.log(data,data.percent);
});
si.mem(function(data) {
    console.log('cpuTemperature-Information:-22222222222222222');
    console.log(data);
});

si.processes(function(data) {
    console.log('cpuTemperature-Information:-33333333333333');
    console.log(data,data.all);
});
// promises style - new in version 3
si.cpu()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// full async / await example (node >= 7.6)
/*
async function cpu() {
    try {
        const data = await si.cpu();
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}*/
