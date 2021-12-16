const axios = require("axios");
const {
	Card,
	renderError,
	renderChart,
	renderNameTitle,
} = require("./common.js");

/**
 *
 * @param {number} id 用户id
 * @returns {Object} 获取的用户数据 {name, color, ccfLevel, passed, hideInfo}
 */
async function fetchStats(id) {
	let headers = { Cookie: `__client_id=${process.env.cid};_uid=${process.env.uid}` };
	// console.log(headers);
	const res = await axios.get(`https://www.luogu.com.cn/user/${id}?_contentOnly`, { headers });

	const stats = {
		name: "NULL",
		color: "Gray",
		ccfLevel: 0,
		passed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		hideInfo: false,
		ranking: 0,
	};
	if (res.data.code !== 200) {
		return stats;
	}

	const user = res.data.currentData.user;
	const passed = res.data.currentData.passedProblems;

	stats.name = user.name;
	stats.color = user.color;
	stats.ccfLevel = user.ccfLevel;

	if (!passed) {
		stats.hideInfo = true;
		return stats;
	}

	for (let i of passed) {
		stats.passed[i.difficulty]++;
	}

	stats.passed[8] = res.data.currentData.submittedProblems.length;

	stats.ranking = res.data.currentData.user.ranking;

	return stats;
}

const renderSVG = (stats, options) => {
	const { name, color, ccfLevel, passed, hideInfo, ranking } = stats;

	const { hideTitle, darkMode, cardWidth = 500 } = options || {};

	if (hideInfo) {
		return renderError("用户开启了“完全隐私保护”，获取数据失败");
	}

	const paddingX = 25;
	const labelWidth = 90; //柱状图头部文字长度
	const progressWidth = cardWidth - 2 * paddingX - labelWidth - 60; //500 - 25*2(padding) - 90(头部文字长度) - 60(预留尾部文字长度)，暂时固定，后序提供自定义选项;

	const weights = [60, 1, 2, 3, 10, 20, 40, 80, 0];
	let score = 0;

	for (let i = 0; i < 8; ++i) score += weights[i] * passed[i];

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

	const title = renderNameTitle(
		name,
		color,
		ccfLevel,
		"的贺题情况",
		cardWidth,
		`已贺${passedSum}题, 被${ranking ? ranking - 1 : "INF"}人吊打`
	);

	return new Card({
		width: cardWidth - 2 * paddingX,
		height: datas.length * 30 + 10,
		hideTitle,
		darkMode,
		title,
		body,
		score,
	}).render();
};

module.exports = { fetchStats, renderSVG };
