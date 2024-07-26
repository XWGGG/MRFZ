auto.waitFor();
//图像文字识别函数
function ocr(imgName, scrX, scrY, width, height, tgtText){
    tgtText = tgtText || null;
    if (!requestScreenCapture()) { 
        console.log('请求截图失败'); 
        exit(); 
    }
    var img = captureScreen();
    var imgClip = images.clip(img, scrX, scrY, width, height);
    var imgPath = "res/" + imgName + ".png";
    images.save(imgClip, imgPath);
    console.log("裁剪后的图片已保存至: " + imgPath);
    sleep(1000);
    var mdlPath = files.path("./paddleMoudel");
    var image = images.read(imgPath);
    if (!image) {
        console.log('图片读取失败');
        return null;
    }
    var ocrRes = paddle.ocr(image, mdlPath);
    if (tgtText === null) {
        // 若未提供目标文本，则返回识别结果的数组
        var resultText = [];
        ocrRes.forEach(function(textObj) {
            resultText.push(textObj.text);
        });
        return resultText;
    } else {
        // 若提供了目标文本，则在识别结果中查找该文本
        var tgtPos = ocrRes.find(function(textObj) {
            return textObj.text.includes(tgtText);
        });
        if (tgtPos) {
            // 若找到目标文本，则返回该文本的中心坐标
            var { left, top, right, bottom } = tgtPos.bounds;
            var centerX = (left + right) / 2 + scrX;
            var centerY = (top + bottom) / 2 + scrY;
            console.log(`${tgtText}中心坐标:(${centerX},${centerY})`);
            return { x: centerX, y: centerY };
        } else {
            // 若未找到目标文本，则打印提示信息并返回 null
            console.log(`未找到文本 "${tgtText}"`);
            return null;
        }
    }
}

//找图并点击函数
function findAndClick(imageName, clickTimes, x, y, width, height) {
    // 默认参数设定
    clickTimes = clickTimes || 0;
    x = x || 0; y = y || 0; width = width || 1280; height = height || 720;
    // 读取模板图像
    const templateImg = images.read(`res/${imageName}.png`);
    if (!templateImg) {
        console.error(`读取图像失败: res/${imageName}.png`);
        return false;
    }
    // 截取屏幕图像，并在指定区域查找模板图像
    if (!requestScreenCapture()) {
        console.log('请求截图失败');
        return false;
    }
    const screenImg = captureScreen();
    const clippedImg = images.clip(screenImg, x, y, width, height);
    const position = images.findImage(clippedImg, templateImg, { threshold: 0.7 });
    // 若找到图像，则点击指定次数
    if (position) {
        console.log(`找到图片: ${imageName}`);
        const offsetX = x + position.x + templateImg.width / 2;
        const offsetY = y + position.y + templateImg.height / 2;
        for (let i = 0; i < clickTimes; i++) {
            click(offsetX, offsetY);
            console.log(`点击图片: ${imageName} ${i + 1}次`);
            sleep(100); // 点击间隔
        }
        return { x: offsetX, y: offsetY };
    }
    // 未找到图像
    console.log(`未在指定区域找到图片: ${imageName}`);
    return false;
}

// 360度滑动函数
function swipe360(angle, x, y, radius, duration){
    // 设置默认参数
    x = x || 640;
    y = y || 360;
    radius = radius || 220;
    duration = duration || 1000;
    // 计算终点坐标
    const endX = x + radius * Math.cos(angle * Math.PI / 180);
    const endY = y - radius * Math.sin(angle * Math.PI / 180);
    const offsetX = 2 * x - endX;
    const offsetY = 2 * y - endY;
    swipe(offsetX, offsetY, endX, endY, duration);
}

// 导出模块
module.exports = {ocr,findAndClick,swipe360,};