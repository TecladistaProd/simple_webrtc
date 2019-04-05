import Peer from 'peerjs'

import './main.sass'

import $ from './src/query'

import { message } from './src/handleTemplates'

import { onData, onOpen, getUserMedia, onStream } from './src/functions'

const peer = new Peer({
	/*key: 'lwjd5qra8257b9'*/
	config: {
		'iceServers': [
			// {'urls':'stun:stun01.sipphone.com'},
			// {'urls':'stun:stun.ekiga.net'},
			// {'urls':'stun:stun.fwdnet.net'},
			// {'urls':'stun:stun.ideasip.com'},
			// {'urls':'stun:stun.iptel.org'},
			// {'urls':'stun:stun.rixtelecom.se'},
			// {'urls':'stun:stun.schlund.de'},
			// {'urls':'stun:stun.l.google.com:19302'},
			// {'urls':'stun:stun1.l.google.com:19302'},
			// {'urls':'stun:stun2.l.google.com:19302'},
			// {'urls':'stun:stun3.l.google.com:19302'},
			{'urls':'stun:stun4.l.google.com:19302'},
			{'urls':'stun:stunserver.org'}
			// {'urls':'stun:stun.softjoys.com'},
			// {'urls':'stun:stun.voiparound.com'},
			// {'urls':'stun:stun.voipbuster.com'},
			// {'urls':'stun:stun.voipstunt.com'},
			// {'urls':'stun:stun.voxgratia.org'},
			// {'urls':'stun:stun.xten.com'}
		]
	}
})

let [conn, call, ownPeer] = [null, null, null]

document.otherPeer = null

peer.on('open', id => {
	let params = [...new URL(location.href).searchParams]

	if(params.length < 1){
		$('#my-peer').innerText = `Click here to copy your connection link to send to someone`
		$('#my-peer').dataset.url = `${location.href}?peerId=${id}`
	} else {
		document.otherPeer = params[0][1]
		$('#chat-connect').click()
	}

  	ownPeer = id
	
	peer.on('call', (cl) => {
		call = cl
		call.on('stream', onStream)
		getUserMedia({audio: true, video: true}).then(stream => {
			call.answer(stream)
		})
	})

	peer.on('connection', con => {
		conn = con
		conn.on('open', onOpen.bind(null, conn, ownPeer))
	})
})

$('#chat-connect').addEventListener('click', e=> {
	
	document.otherPeer = document.otherPeer || $('#other-peer').value
	$('#other-peer').hidden = true

	conn = peer.connect(document.otherPeer)

	conn.on('open', onOpen.bind(null, conn, ownPeer))

})

$('#chat-buttons button').addEventListener('click', e=> {
	console.log('oi')
	let val = $('#message').value
	$('#message').value = ''
	if(val === ''){
		return $('#message').placeholder = 'Please type a message'
	}
	conn.send(val)
	$('.chat').innerHTML += message({cl: 'message my', body: val})
})

$('#video-connect').addEventListener('click', () => {
	getUserMedia({audio: true, video: true}).then(stream => {
		document.otherPeer = document.otherPeer || $('#other-peer').value
		$('#other-peer').hidden = true

		call = peer.call(document.otherPeer, stream)
		call.on('stream', onStream)
	})
})

$('#sendfile button').addEventListener('click', () => {
	let file = $('#file').files[0]
	conn.send({
		file,
		fileName: file.name,
		fileType: file.type
	})
})

$('#my-peer').addEventListener('click', (e) => {
	e.preventDefault()
	let done = true
	if('clipboard' in navigator){
		navigator.clipboard.writeText($('#my-peer').dataset.url).catch(err => done=false)
	} else {
		done = false
	}
	if(!done){
		let textA = document.createElement('textarea')
		textA.value = $('#my-peer').dataset.url
		textA.style.opacity = 0
		$('#my-peer').appendChild(textA)
		textA.focus()
		textA.select()
		document.execCommand('copy')
		textA.blur()
		$('#my-peer').removeChild(textA)
	}
})