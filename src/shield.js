const anf = require('anafanafo');
const NAMECOLOR = {
	Gray: "#bbbbbb",
	Blue: "#0e90d2",
	Green: "#5eb95e",
	Orange: "#e67e22",
	Red: "#e74c3c",
	Purple: "#9d3dcf",
	Cheater: "#ad8b00",
};
const renderSVG = (stats, options) => {
	const { name, color, ccfLevel, passed, hideInfo, ranking } = stats;

	if (hideInfo) {
		return renderError("用户开启了“完全隐私保护”，获取数据失败");
	}

	const paddingX = 25;
	const labelWidth = 90; //柱状图头部文字长度
	const progressWidth = cardWidth - 2 * paddingX - labelWidth - 60; //500 - 25*2(padding) - 90(头部文字长度) - 60(预留尾部文字长度)，暂时固定，后序提供自定义选项;

	const datas = [
		{ label: "未评定", color: "#bfbfbf", data: passed[0] },
		{ label: "入门", color: "#fe4c61", data: passed[1] },
		{ label: "普及-", color: "#f39c11", data: passed[2] },
		{ label: "普及/提高-", color: "#ffc116", data: passed[3] },
		{ label: "普及+/提高", color: "#52c41a", data: passed[4] },
		{ label: "提高+/省选-", color: "#3498db", data: passed[5] },
		{ label: "省选/NOI-", color: "#9d3dcf", data: passed[6] },
		{ label: "NOI/NOI+/CTSC", color: "#0e1d69", data: passed[7] },
		{ label: "写挂了", color: "#996600", data: passed[8] },
	];
	const passedSum = passed.reduce((a, b) => a + b) - passed[8];
	const body = renderChart(datas, labelWidth, progressWidth, "题");

    const nameLength = anf(name) * 0.11;

    let p1 = "", p2 = "", s1 = nameLength + 6, s2 = nameLength + 9;

    for (let i = 0; i < 8; ++i) {
        const nameL = anf(passed[i]) * 0.11;
        p1 += `<rect x="${s1}" width="${nameL + 6}" height="19" fill="${datas[i].color}"/>`;
        s1 += nameL + 6;
    }
    for (let i = 0; i < 8; ++i) {
        const nameL = anf(passed[i]) * 0.11;
        p2 += `<text x="${s2 + 3}" y="14" fill="#fff" textLength="${nameL}">${name}</text>`;
        s2 += nameL + 6;
    }

    return 
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="96" height="20" role="img">
      <title>${name}</title>
      <g>
        <rect width="${nameLength + 6}" height="19" fill="${NAMECOLOR[color]}"/>
        ${p1}
      </g>
      <g fill="#fff" font-family="Verdana, Microsoft Yahei" text-rendering="geometricPrecision" font-size="11">
        <text x="3" y="14" fill="#fff" textLength="${nameLength}">${name}</text>
        ${p2}
      </g>
    </svg>`

};

module.exports = { renderSVG };