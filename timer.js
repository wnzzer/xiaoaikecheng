/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({
                                 providerRes,
                                 parserRes
                             } = {}) {



    var selections=[];
    var sumSections = [
        { section: 1, startTime: "08:00", endTime: "08:45" },
        { section: 2, startTime: "08:55", endTime: "9:40" },
        { section: 3, startTime: "10:10", endTime: "10:55" },
        { section: 4, startTime: "11:05", endTime: "11:50" },
        { section: 5, startTime: "15:00", endTime: "15:45" },
        { section: 6, startTime: "15:55", endTime: "16:40" },
        { section: 7, startTime: "17:10", endTime: "17:55" },
        { section: 8, startTime: "18:05", endTime: "18:50" },
        { section: 9, startTime: "20:00", endTime: "20:45" },
        { section: 10, startTime: "20:55", endTime: "21:40"}
    ]
    var winSections=[
        { section: 1, startTime: "08:00", endTime: "08:45" },
        { section: 2, startTime: "08:88", endTime: "9:40" },
        { section: 3, startTime: "10:10", endTime: "10:55" },
        { section: 4, startTime: "11:05", endTime: "11:50" },
        { section: 5, startTime: "14:30", endTime: "15:15" },
        { section: 6, startTime: "15:25", endTime: "16:10" },
        { section: 7, startTime: "16:40", endTime: "16:10" },
        { section: 8, startTime: "17:35", endTime: "18:20" },
        { section: 9, startTime: "19:30", endTime: "20:15" },
        { section: 10, startTime: "20:25", endTime: "21:10"}

    ]
    var myDate = new Date();//获取系统当前时间
    var nowMonth=myDate.getMonth();
    var selections="";
    if(nowMonth>=5&&nowMonth<=9){
        selections=sumSections;
    }
    else {
        selections=winSections;
    }
    return {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: true, // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 2, // 晚间课程节数：[0, 10]之间的整数
        sections:selections, // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    }

}
