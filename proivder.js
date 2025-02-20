async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    return await request('get', 'gbk','http://jwgl.hist.edu.cn/wsxk/xkjg.ckdgxsxdkchj_data10319.jsp?params='+getParam());
}
async function request(tag, encod, url) {
    let formatText = (text, encoding) => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader()
            fr.onload = (event) => {
                resolve(fr.result)
            }

            fr.onerror = (err) => {
                reject(err)
            }

            fr.readAsText(text, encoding)
        })
    }
    return await fetch(url, { method: tag })
        .then((rp) => rp.blob().then((v) => formatText(v, encod)))
        .then((v) => v)
        .catch((er) => er)
}
function getParam(){
    const date = new Date();
    let year = date.getFullYear();//获取完整的年份(4位)
    const month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let xq = 0;
    if(month < 7 && month >= 2){
        xq = 1;
        year = year - 1;
    }
    return btoa('xn='+year+'&xq='+xq);

}

