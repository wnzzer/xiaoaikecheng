async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    return await request('get', 'gbk','http://jwgl.hist.edu.cn/wsxk/xkjg.ckdgxsxdkchj_data10319.jsp?params=eG49MjAyMiZ4cT0wJnhoPTIwMjEwMDAwNTExMg==');
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

