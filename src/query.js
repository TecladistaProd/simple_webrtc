export default (el) => {
	let docs = document.querySelectorAll(el)
	if(docs.length > 1)
		return docs
	else if(docs.length === 1)
		return docs[0]
	else
		return undefined
}