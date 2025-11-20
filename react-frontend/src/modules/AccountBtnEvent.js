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

export function unSuscribe(fn) {
	for (let i = 0; i < linkedFns.length; i++) {
		if (linkedFns[i] == fn) linkedFns.splice(i, 1)
	}
}