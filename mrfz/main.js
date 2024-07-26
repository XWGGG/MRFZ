// 导入所需的基础函数
var bF = require('./baseFunctions');

// 启动明日方舟
app.launchApp('明日方舟');

function STOPALL () {
    home();
    console.log("出现错误");
    engines.stopAllAndToast();
}

function clickStart() {

    for(let i = 0; i < 9; i++) {
        if(bF.findAndClick('start', 1, 600, 630, 80, 80) == false) {
            sleep(5000);
        } else {
            console.log("点击开始");
            sleep(5000);//等待游戏加载完毕
            click(640,520); //点击开始游戏
            console.log("点击开始唤醒"); 
            break;
        }
    }
}

clickStart();