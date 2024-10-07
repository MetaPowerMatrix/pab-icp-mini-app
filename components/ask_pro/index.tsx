import React, {useEffect, useState} from "react";
import {Button, Col, Input, Modal, Row} from "antd";
import {
	AndroidOutlined,
	AudioFilled,
	ExclamationCircleFilled,
	PauseOutlined
} from "@ant-design/icons";
import {api_url, getApiServer} from "@/common";
import {useTranslations} from "next-intl";
import commandDataContainer from "@/container/command";

const AskProComponent = ({activeId, room_id, onReply, onShowProgress, query, ctrlVoiceStart}
   :{activeId:string, room_id:string, onReply: (reply:string)=>void,
	onShowProgress: (s: boolean)=>void, query: string, ctrlVoiceStart: (startStop: boolean)=>void}) =>
{
	const [queryText, setQueryText] = useState<string>("");
	const [stopped, setStopped] = useState<boolean>(true);
	const t = useTranslations('AIInstruct');
	const {confirm} = Modal;
	const command = commandDataContainer.useContainer()

	useEffect(() => {
		setQueryText(query)
	}, [query])

	const stop_record = () => {
		if (stopped){
			setStopped(false)
			ctrlVoiceStart(true)
		}else{
			setStopped(true)
			ctrlVoiceStart(false)
		}
	}
	const handleVoiceCommand = (topic: string, pro: string) => {
		const data = {id: activeId, message: topic, pro: pro};
		let url = getApiServer(80) + api_url.portal.interaction.instruct
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(data)
		})
			.then(response => response.json())
			.then(data => {
				if (data.code !== "200") {
					alert(t('assist_fail'));
				}
				onShowProgress(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				alert(t('assist_fail'));
				onShowProgress(false);
			});
	};

	const inputQuestion = (event: React.ChangeEvent<HTMLInputElement>) =>{
		setQueryText(event.target.value)
	}
	const callPato = (id: string, callid: string, topic: string) => {
		command.callPato(id, callid, topic).then((res) => {
			Modal.success({
				content: t("waitingCall"),
			});
		})
	}

	const handleAutoChat = (callid: string, first_message: string) => {
		if (callid === "" || first_message === ""){
			Modal.warning({
				content: t("requireId"),
			});
		}else{
			callPato(activeId, callid, first_message)
		}
	};

	return (
			<div>
				<Row align={"middle"}>
					<Col span={1} style={{marginRight:5}}>
						{
							stopped ?
								<AudioFilled style={{color: "black", fontSize: 18}} onClick={() => {
									confirm({
										icon: <ExclamationCircleFilled/>,
										content: t('startAsk'),
										okText: t('confirm'),
										cancelText: t('cancel'),
										onOk() {
											stop_record()
										}
									})
								}}/>
								:
								<PauseOutlined style={{color: "black", fontSize: 18, marginRight:15}} onClick={() => stop_record()}/>
						}
					</Col>
					<Col span={16}>
						<Input placeholder={t('command')} onChange={inputQuestion} value={queryText}/>
					</Col>
					<Col span={4}>
						<Button type={"primary"} style={{marginLeft: 5}}
						        onClick={() => handleVoiceCommand(query, room_id)}>{t('ask')}</Button>
					</Col>
					<Col span={2} style={{textAlign:"end"}}>
						<AndroidOutlined  style={{color: "black", fontSize: 18}} onClick={() => {
							confirm({
								icon: <ExclamationCircleFilled/>,
								content: t('startTalkWithPro'),
								okText: t('confirm'),
								cancelText: t('cancel'),
								onOk() {
									handleAutoChat(room_id, query)
								}
							})
						}}/>
					</Col>
				</Row>
			</div>
	)
}

export default AskProComponent;
