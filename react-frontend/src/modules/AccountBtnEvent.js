let linkedFns = []

export function fireAccountBtnEvent() {
	linkedFns.forEach(fn => fn())
	//console.log(linkedFns)
}

export function suscribeToAccountBtn(fn) {
	if (!linkedFns.includes(fn)) {
		linkedFns.push(fn)
	}
	console.log(linkedFns)
}