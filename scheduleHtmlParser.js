function scheduleHtmlParser(html) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const course = [];

    // 统一处理函数
    const processTimeBlock = (name, teacher, timeBlock) => {
        // 健壮性：处理未排课情况
        if (timeBlock.includes("*未排课*")) return;

        // 增强分隔符容错（处理中英文分号）
        const timeSegments = timeBlock.split(/[;；]/).filter(s => s.trim());
        
        timeSegments.forEach(segment => {
            // 统一去除前后空格
            segment = segment.trim();
            if (!segment) return;

            // 提取单双周标志（支持括号格式）
            let parity = 0;
            const parityMatch = segment.match(/\((单|双)\)/);
            if (parityMatch) {
                parity = parityMatch[1] === "单" ? 1 : 2;
                segment = segment.replace(parityMatch[0], "").trim();
            }

            // 拆分时间和地点部分
            const parts = segment.split(/\s+/).filter(p => p);
            if (parts.length < 3) return; // 无效数据跳过

            // 提取周次信息（支持多段周次）
            const weekInfo = parts[0];
            const weeks = getWeeks(weekInfo, parity);

            // 解析星期（增强容错）
            const day = getDay(parts[1]);
            if (isNaN(day) || day < 1 || day > 7) return;

            // 解析节次（支持多节次格式）
            const sections = getSections(parts[1]);
            if (!sections.length) return;

            // 提取地点（最后部分）
            const position = parts.slice(2).join(" ");

            course.push({
                name: name || "未命名课程",
                position: position || "未安排地点",
                teacher: teacher || "未安排教师",
                weeks: weeks,
                day: day,
                sections: sections
            });
        });
    };

    // 主处理逻辑
    $('tbody > tr').each(function() {
        const cols = $(this).children();
        
        // 健壮性：列数不足时跳过
        if (cols.length < 9) return;

        const name = cols.eq(1).text().trim();
        const teacher = cols.eq(5).text().trim();
        const timeBlocks = cols.eq(8).text().trim();

        // 统一处理时间块
        processTimeBlock(name, teacher, timeBlocks);
    });

    console.log("解析结果：", course);
    return course;
}

// 增强周次解析（支持多段周次）
function getWeeks(weekStr, parity) {
    const weeks = [];
    weekStr = weekStr.replace(/周/g, "");

    weekStr.split(",").forEach(part => {
        const range = part.split("-").map(n => parseInt(n));
        if (range.length !== 2 || isNaN(range[0]) || isNaN(range[1])) return;

        for (let w = range[0]; w <= range[1]; w++) {
            if (parity === 1 && w % 2 === 0) continue;
            if (parity === 2 && w % 2 !== 0) continue;
            weeks.push(w);
        }
    });

    return weeks.length ? weeks : [1]; // 默认第一周防止空数组
}

// 增强星期解析（正则匹配）
function getDay(timeStr) {
    const dayMap = { 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 日:7 };
    const match = timeStr.match(/周?([一二三四五六七日])/);
    return match ? dayMap[match[1]] || 1 : 1; // 默认星期一
}

// 增强节次解析（支持多节次）
function getSections(timeStr) {
    const sectionMatch = timeStr.match(/\[(\d+)\s*-\s*(\d+)\]/);
    if (!sectionMatch) return [];
    
    const start = parseInt(sectionMatch[1]);
    const end = parseInt(sectionMatch[2]);
    return Array.from({length: end - start + 1}, (_, i) => start + i);
}
