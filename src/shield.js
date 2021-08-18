const anf = require('anafanafo');
const { renderError } = require("../src/common.js");
const NAMECOLOR = {
	Gray: "#bbbbbb",
	Blue: "#0e90d2",
	Green: "#5eb95e",
	Orange: "#e67e22",
	Red: "#e74c3c",
	Purple: "#9d3dcf",
	Cheater: "#ad8b00",
};
const renderCCFBadge = (level, x) => {
	const ccfColor = (ccf) => {
		if (ccf >= 3 && ccf <= 5) return "#5eb95e";
		if (ccf >= 6 && ccf <= 7) return "#3498db";
		if (ccf >= 8) return "#f1c40f";
		return null;
	};
	return `
  <svg xmlns="http://www.w3.org/2000/svg" x="${x}" y="1" width="18" height="18" viewBox="0 0 18 18" fill="${ccfColor(
		level
	)}" style="margin-bottom: -3px;">
    <path d="M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z">
    </path>
  </svg>`;
};
const renderSVG = (stats, options) => {
	const { name, color, ccfLevel, passed, hideInfo, ranking } = stats;

	if (hideInfo) {
		return renderError("用户开启了“完全隐私保护”，获取数据失败");
	}

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

    let nameLength = anf(name) * 0.11, onameLength = nameLength;

    let ccf = "";

    if (ccfLevel >= 3) ccf = renderCCFBadge(ccfLevel, nameLength + 6), nameLength += 18;

    let p1 = "", p2 = "", s1 = nameLength + 6, s2 = nameLength + 9;

    for (let i = 0; i < 8; ++i) {
        const nameL = anf(passed[i].toString()) * 0.11;
        p1 += `<rect x="${s1}" width="${nameL + 6}" height="19" fill="${datas[i].color}"/>`;
        s1 += nameL + 6;
    }
    for (let i = 0; i < 8; ++i) {
        const nameL = anf(passed[i].toString()) * 0.11;
        p2 += `<text x="${s2}" y="14" fill="#fff" textLength="${nameL}">${passed[i]}</text>`;
        s2 += nameL + 6;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${s2}" height="19" role="img">
      <title>${name}</title>
      <g>
        <rect width="${nameLength + 6}" height="19" fill="#fff"/>
        ${p1}
      </g>
      <g fill="#fff" font-family="Verdana, Microsoft Yahei" text-rendering="geometricPrecision" font-size="11">
        <text x="3" y="14" fill="${NAMECOLOR[color]}" textLength="${onameLength}">${name}</text>
        ${ccf}
        ${p2}
      </g>
    </svg>`

};

module.exports = { renderSVG };