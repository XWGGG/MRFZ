
function ClipScreenshot(x, y, width, height, imageName) {
    // 请求截图权限
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    }
    var img = captureScreen();
    var imgclip = images.clip(img, x, y, width, height);
    // 构建图片路径
    var imagePath = "./res/" + imageName + ".png";
    images.save(imgclip, imagePath);
}
ClipScreenshot(600,630,80,80,'6');
//导出
