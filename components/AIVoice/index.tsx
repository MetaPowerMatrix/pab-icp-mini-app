import {useEffect, useState} from "react";
import {WebSocketManager} from "@/lib/WebsocketManager";
import mqtt from "mqtt";
import {getMQTTBroker, Streaming_Server} from "@/common";
import {getOS} from "@/lib/utils";

declare global {
	interface Window {
		webkitAudioContext: any;
		AudioContext: any;
	}
}

const AIVoice = ({activeId, process_ws_message, startStop}:{ activeId:string, process_ws_message:(event: any)=>void, startStop:boolean }) => {
	const [recorder, setRecorder] = useState<MediaRecorder>();
	const [wsSocket, setWsSocket] = useState<WebSocketManager>();
	const [client, setClient] = useState<mqtt.MqttClient | null>(null);

	useEffect(() => {
		initAudioStream().then(()=>{})
		const mqttClient = mqtt.connect(getMQTTBroker());
		mqttClient.on("connect", () => {
			console.log("Instruct Connected to MQTT broker");
		});
		mqttClient.on("error", (err) => {
			// console.error("Error connecting to MQTT broker:", err);
		});
		setClient(mqttClient);

		return () => {
			mqttClient.end(); // Clean up the connection on component unmount
			recorder?.stream.getTracks().forEach(track => track.stop());
		};
	}, []);

	useEffect(() => {
		if (client) {
			const topic_instruct_voice = activeId+"/instruct/voice";
			const topic_instruct = activeId+"/instruct";

			// Handler for incoming messages
			const onMessage = (topic: string, message: Buffer) => {
				if (topic === topic_instruct){
					console.log("receive answer: ", message.toString())
					// onReply(message.toString())
				}else{
					console.log("receive audio: ", message.toString())
					playAudioWithWebAudioApi(message.toString())
				}
			};

			// Subscribe to the topic
			client.subscribe([topic_instruct,topic_instruct_voice], (err) => {
				if (!err) {
					console.log("Subscribed to topic: ", [topic_instruct,topic_instruct_voice]);
					client.on('message', onMessage);
				}
			});
			// Return a cleanup function to unsubscribe and remove the message handler
			return () => {
				if (client) {
					client.unsubscribe([topic_instruct,topic_instruct_voice]);
					client.removeListener('message', onMessage);
				}
			};
		}
	}, [client]); // Re-run this effect if the `client` state changes

	useEffect(() => {
		console.log("voice start stop changed ",startStop)
		stop_record()
	},[startStop])

	async function playAudioWithWebAudioApi(url: string): Promise<void> {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			const response = await fetch(url);
			const arrayBuffer = await response.arrayBuffer();
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

			const source = audioContext.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(audioContext.destination);
			source.start();

		} catch (error) {
			console.error('Error playing audio with Web Audio API:', error);
		}
	}

	const initAudioStream = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			handleAudioStream(stream);
		} catch (error) {
			console.error('Error accessing the microphone:', error);
		}
	};

	// const process_ws_message = (event: any) => {
	// 	if (event.data.toString() !== 'pong') {
	// 		setQuery(event.data.toString())
	// 	}
	// }

	let chunks: BlobPart[] = [];
	const handleAudioStream = (stream: MediaStream) => {
		let options = {mimeType: 'audio/webm;codecs=pcm'};
		let OS = getOS()
		if (OS === 'iphone' || OS === 'macosx'){
			options = {mimeType: 'audio/mp4;codecs=mp4a'}
		}
		const mediaRecorder = new MediaRecorder(stream, options);
		const socket = new WebSocketManager(Streaming_Server + "/up", process_ws_message);

		setWsSocket(socket)
		setRecorder(mediaRecorder)

		mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				chunks.push(event.data);
				// socket.send(event.data);
			}
		};
		mediaRecorder.onstop = () => {
			socket.send(new Blob(chunks, { 'type' : 'audio/webm' }));
			console.log("send")
			chunks = [];
		};
		// mediaRecorder.start(2000); // Start recording, and emit data every 5s
	};

	const stop_record = () => {
		if (startStop){
			recorder?.start(1000)
			// setStopped(false)
		}else{
			recorder?.stop()
			// setStopped(true)
		}
	}

	return (
		<></>
	)
}

export default AIVoice
