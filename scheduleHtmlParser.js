function scheduleHtmlParser(html) {
    let course = [];
    const $ = cheerio.load(html, { decodeEntities: false });
    
    // 遍历每个时间段的行（忽略表头）
    $('tr:not(.H)').each(function (trIdx, trElem) {
        const $tr = $(trElem);
        let timeSegment = "";

        // 获取时间段信息（上午、下午等）
        $tr.find('td[rowspan]').each(function () {
            timeSegment = $(this).text().trim();
        });

        // 遍历课程单元格（周一到周日）
        $tr.find('td:not([rowspan])').each(function (tdIdx, tdElem) {
            const $td = $(tdElem);
            const day = tdIdx + 1; // 周一为1，依此类推

            // 处理每个课程块
            $td.find('div[style*="padding-bottom:5px"]').each(function () {
                const $div = $(this);
                const content = $div.html().split(/<br\s*\/?>/i);
                
                // 解析课程基本信息
                const name = $div.find('font').text().trim();
                const teachers = content[1].replace(/&nbsp;/g, ' ').trim();
                const timeInfo = content[2].trim();
                const position = content[3].trim();

                // 解析时间信息
                const [weekInfo, sectionInfo] = timeInfo.match(/(.*?)\[(\d+)-(\d+)\]/).slice(1);
                const sections = Array.from({ length: sectionInfo[2]-sectionInfo[1]+1 }, (_, i) => parseInt(sectionInfo[1]) + i);

                // 处理多周次范围
                weekInfo.split(',').forEach(weekPart => {
                    let [flag, cleanWeek] = parseWeekType(weekPart);
                    cleanWeek.split(',').forEach(weekRange => {
                        const [start, end] = weekRange.includes('-') ? 
                            weekRange.split('-').map(Number) : 
                            [Number(weekRange), Number(weekRange)];
                        
                        const weeks = Array.from({ length: end - start + 1 }, (_, i) => start + i)
                            .filter(w => checkWeekType(w, flag));

                        // 构建课程对象
                        course.push({
                            name,
                            position,
                            teacher: teachers,
                            weeks,
                            day,
                            sections,
                        });
                    });
                });
            });
        });
    });

    return course;

    // 辅助函数：解析单双周标记
    function parseWeekType(weekStr) {
        const weekTypeMap = { '单': 1, '双': 2 };
        const [_, flag, clean] = weekStr.match(/(单|双)?\s*([\d,-]+)/) || [null, null, weekStr];
        return [flag ? weekTypeMap[flag] : 0, clean];
    }

    // 辅助函数：过滤周次
    function checkWeekType(week, flag) {
        return flag === 0 || (flag === 1 && week % 2 === 1) || (flag === 2 && week % 2 === 0);
    }
}
