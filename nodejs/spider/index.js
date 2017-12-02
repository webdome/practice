const cheerio = require("cheerio");
const download = require("./curl");
const fs = require('fs');

var url = "http://s.g.wanfangdata.com.cn/Paper.aspx?q=nodejs%20DBID%3AWF_XW&f=top"
function findHref(data){
    let $ = cheerio.load(data);
    let urls = '';
    $('.title_li .abs_img').each(function(index,element){
        let link = $(element).attr('href');
        urls+=(link+'\n');
    });
    return urls;
}
download(url, function (data) {
    fs.writeFile(__dirname+'/test.html',data,function(err){
        if(err) console.log('load error');
        console.log('load done');
    });
    if (data) {
        let $ = cheerio.load(data);
        let count = $('.totalRecords').text().split('\n')[3];
        count?count=count:count=0;
        console.log('totalRecords: '+count);
        for(let i=1;i<count+1;i++){
            download(url+'&p='+i, function (data) {
                if(data){
                    fs.appendFile(__dirname+'/url.txt',findHref(data),function(err){
                        if(err) console.log(`page${i} load error`);
                        console.log(`page${i} load success`);
                    });
                }
            });
        }
        
    } else {
        console.log("no data");
    }
});