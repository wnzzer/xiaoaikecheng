function scheduleHtmlParser(html){
    let course = [];
    const $ = cheerio.load(html, {decodeEntities: false}); // 避免中文乱码
    $(' tbody>tr ').each(function () {
        //大杂烩
        var name = $(this).children().eq(1).text();
        //这是课程名字
        console.log("name"+name)
        var teacher = $(this).children().eq(5).text();
        //这是教师名字
        var allData = $(this).children().eq(8).text();
        //数据位置大杂烩
        var sumTime = allData.split(",");
        var sumLength = sumTime.length;
        //时间个数
        console.log("输出时间个数:"+sumLength);


        if (sumLength == 1) {
            console.log("sumtime"+sumTime[0]);



            //在这里提前取出来单双周
            var flag = 0;

            if (sumTime[0].search("单")!=-1){
                flag = 1;
                sumTime[0]=sumTime[0].replace('(单)', '');
            }
            else if (sumTime[0].search("双")!=-1) {
                flag =2;
                sumTime[0]=sumTime[0].replace('(双)', '');
            }
            console.log("flag的值"+flag);
            var allTime = sumTime[0].split(" ");
            console.log("alltime"+allTime);
            var weeks = getWeeks(allTime[0],flag);
            console.log("weeks"+weeks);
            var day = getDay(sumTime[0]);
            console.log("day"+day);
            var sections = getSection(sumTime[0]);
            console.log("section"+sections);
            var position = allTime[allTime.length-1];
            console.log("position"+position);



            var obj = {
                name: name,
                position: position,
                teacher: teacher,
                weeks: weeks,
                day: day,
                sections: sections,
            }
            course.push(obj);


        }
        else if (sumLength > 1) {
            var i = 0;
            while (i <= sumLength-1) {
                console.log("第i段时间"+i);

                //在这里提前取出来单双周
                var flag = 0;

                if (sumTime[i].search("单")!=-1){
                    flag = 1;
                    sumTime[i]=sumTime[i].replace('(单)', '');
                }
                else if (sumTime[i].search("双")!=-1) {
                    flag =2;
                    sumTime[i]=sumTime[i].replace('(双)', '');
                }
                console.log("flag的值"+flag);
                var allTime = sumTime[i].split(" ");
                console.log("alltime"+allTime);
                var weeks = getWeeks(allTime[0],flag);
                console.log("weeks"+weeks);
                var day = getDay(sumTime[i]);
                //更新符号修饰
                console.log("day"+day);
                var sections = getSection(sumTime[i]);
                console.log("section"+sections);
                var position = allTime[allTime.length-1];
                console.log("position"+position);

                var obj = {
                    name: name,
                    position: position,
                    teacher: teacher,
                    weeks: weeks,
                    day: day,
                    sections: sections,
                }
                course.push(obj);
                i++;


            }
        }
    })
    console.log(course)
    return course;
}


function getDay(strDay){
    const dayEnd = strDay.search("\\[");
    strDay = strDay.slice(dayEnd-1,dayEnd);
        if (strDay.search("一") != -1 ){
            return 1;
        }
        else if (strDay.search("二") != -1){
            return 2;
        }
        else if (strDay.search("三") != -1){
            return 3;
        }
        else if (strDay.search("四") != -1){
            return 4;
        }
        else if (strDay.search("五") != -1){
            return 5;
        }
        else if (strDay.search("六") != -1){
            return 6;
        }
        else if (strDay.search("日") != -1){
            return 7;
        }

    }


function getWeeks(weekStr,flag){
    var week = [];
    weekStr = weekStr.replace('周','');

    if (flag == 1) {
        week = weekStr2IntList(weekStr).filter(v => v % 2 != 0);
    } else if (flag == 2) {
        week = weekStr2IntList(weekStr).filter(v => v % 2 == 0);
    } else {
        week = weekStr2IntList(weekStr);
    }
    return week;

}
function weekStr2IntList(week) {
    // 将全角逗号替换为半角逗号
    var a = week.split('-');
    var index = a[0];
    var end = a[1];
    let weeks =[];
    for(i = index;i<=end;i++){
        weeks.push(i);
    }
    return weeks;

}


function getSection(strSection){
    var sections = [];
    var indexSection = strSection.indexOf("[");
    var section = strSection.slice(indexSection+1,indexSection+2);
    console.log("section"+section)
    sections.push(parseInt(section),parseInt(section)+1);
    return sections;
}