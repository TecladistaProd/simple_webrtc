import $ from './query'

import { message } from './handleTemplates'

export const onData = (data, cl = 'message') => {
	if(typeof data === 'string')
		$('.chat').innerHTML += message({cl, body: data})
	else {
		if('file' in data){
			$('#download').href = URL.createObjectURL(new Blob([new Uint8Array(data.file)], {type: data.fileType}))
			$('#download').download = data.fileName
			$('#download').innerText = 'Sent File'
		} else {
			document.otherPeer = data.otherPeer
		}
	}
}

export const onOpen = (conn, ownPeer) => {
	$('#chat-buttons').hidden = false
	$('#other-peer').hidden = true
	$('#my-peer').hidden = true
	conn.on('data', onData)
	conn.send({otherPeer: ownPeer})
}

export const getUserMedia = (constraint) => new Promise((res, rej) => {
	navigator.mediaDevices.getUserMedia(constraint).then(stream => {
		$('#other-peer').hidden = true
		res(stream)
	}).catch(err => {
		rej(err)
	})
})

export const onStream = (stream) => {
	$('#video').srcObject = stream
	$('#video').autoplay = true
	$('#video').hidden = false
}