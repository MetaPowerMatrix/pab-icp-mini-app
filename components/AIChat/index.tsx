import {useEffect, useState} from "react";
import {WebSocketManager} from "@/lib/WebsocketManager";
import {llm_Server} from "@/common";

declare global {
	interface Window {
		webkitAudioContext: any;
		AudioContext: any;
	}
}

const AIChat = ({activeId, process_ws_message, question, uri}
	                : { activeId:string, process_ws_message:(event: any)=>void, question: any, uri: string }) => {
	const [wsSocket, setWsSocket] = useState<WebSocketManager>();

	useEffect(() => {
		const socket = new WebSocketManager(llm_Server + uri, process_ws_message);
		setWsSocket(socket)

		return () => {
			if (wsSocket) {
				wsSocket.close();
			}
		};
	},[])

	useEffect(() => {
		// let message: aiChatMessage = {
		// 	role: activeId,
		// 	content: question
		// }
		let message = question
		wsSocket?.send(JSON.stringify(message))
	},[question])

	return (
		<></>
	)
}

export default AIChat
