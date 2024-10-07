import React, {useEffect, useState} from "react";
import {Button, Col, Modal, GetProp, Input, Row, Upload, UploadFile, UploadProps} from "antd";
import styles from "./SummaryComponent.module.css";
import {
	AudioOutlined, CheckOutlined, ExclamationCircleFilled,
	PauseOutlined,
	UploadOutlined
} from "@ant-design/icons";
import {api_url, getApiServer, PortalKnowledge, Streaming_Server} from "@/common";
import {WebSocketManager} from "@/lib/WebsocketManager";
import {useTranslations} from "next-intl";
import commandDataContainer from "@/container/command";
import {getOS} from "@/lib/utils";
import MyKnowledges from "@/components/MyKnowledges";
import QueryEmbeddingComponent from "@/components/query_embedding";

const SummaryComponent = ({activeId, onShowProgress, updateCounter}:{activeId:string, updateCounter:number, onShowProgress: (s: boolean)=>void}) => {
	const [transcriptFile, setTranscriptFile] = useState<string>("");
	const [stopped, setStopped] = useState<boolean>(true);
	const [recorder, setRecorder] = useState<MediaRecorder>();
	const [wsSocketRecorder, setWsSocketRecorder] = useState<WebSocketManager>();
	const [knowledge, setKnowledge] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [summarys, setSummarys] = useState<string[]>([]);
	const [isUploadRecord, setIsUploadRecord] = useState(true);
	const [uploaded, setUploaded] = useState<boolean>(false)
	const [showQueryDialog, setShowQueryDialog] = useState<boolean>(false)
	const [knowledges, setKnowledges] = useState<PortalKnowledge[]>([])
	const [knowledgeUpdated, setKnowledgeUpdated] = useState<number>(0)
	const [selectedBook, setSelectedBook]=  useState<string>('')
	const [selectedBookSig, setSelectedBookSig]=  useState<string>('')
	const [selectedBookOwner, setSelectedBookOwner]=  useState<string>(activeId)
	const command = commandDataContainer.useContainer()
	const t = useTranslations('AIInstruct');
	const {confirm} = Modal;

	type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

	useEffect(() => {
			initAudioStream().then(()=>{})
		// return () => {
		// 		recorder.
		// };
	}, [])

	useEffect(() =>{
		command.query_knowledges(activeId).then((res) => {
			setKnowledges(res)
		})
	}, [activeId, knowledgeUpdated, updateCounter])


	// Function to initialize audio recording and streaming
	const initAudioStream = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			handleAudioStream(stream);
		} catch (error) {
			console.error('Error accessing the microphone:', error);
		}
	};

	const process_recorder_message = (event: any) => {
		console.log(event.data.toString())
		if (event.data.toString() !== 'pong') {
			setTranscriptFile(event.data.toString())
		}
	}

	let chunks: BlobPart[] = [];
	const handleAudioStream = (stream: MediaStream) => {
		let options = {mimeType: 'audio/webm;codecs=pcm'};
		let OS = getOS()
		if (OS === 'iphone'|| OS === 'macosx'){
			options = {mimeType: 'audio/mp4;codecs=mp4a'}
		}
		const mediaRecorder = new MediaRecorder(stream, options);
		const socketRecorder = new WebSocketManager(Streaming_Server + "/recorder", process_recorder_message);

		setWsSocketRecorder(socketRecorder)
		setRecorder(mediaRecorder)

		mediaRecorder.ondataavailable = (event) => {
			console.log(event)
			if (event.data.size > 0) {
				chunks.push(event.data);
				// socket.send(event.data);
			}
		};
		mediaRecorder.onstop = () => {
			if (isUploadRecord){
				socketRecorder.send(new Blob(chunks, { 'type' : 'audio/webm' }));
			}else{
				// socket.send(new Blob(chunks, { 'type' : 'audio/webm' }));
			}
			console.log("send")
			chunks = [];
		};
		// mediaRecorder.start(2000); // Start recording, and emit data every 5s
	};

	const stop_record = () => {
		if (stopped){
			recorder?.start(1000)
			setStopped(false)
		}else{
			recorder?.stop()
			setStopped(true)
		}
	}
	const handleKnowledge= (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.preventDefault(); // Prevent the default form submission
		if (fileList.length <= 0 && transcriptFile === '' && knowledge === ''){
			Modal.warning({
				content: '请录制语音，上传文档或者输入链接!'
			})
			return
		}
		const formData = new FormData();
		if (fileList.length > 0){
			formData.append('file', fileList[0] as FileType);
		}
		formData.append('message', JSON.stringify({ id: activeId, link: knowledge, transcript: transcriptFile, shared: ''}));

		onShowProgress(true);
		let url = getApiServer(80) + api_url.portal.task.knowledge_embedding
		fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				if (data.code === "200") {
					setKnowledgeUpdated(knowledgeUpdated + 1)
					Modal.success({
						content: '文档上传成功，等待学习结果!'
					})
					setFileList([])
				}else{
					Modal.warning({
						content: '文档上传失败.'
					})
				}
				onShowProgress(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				Modal.warning({
					content: '文档上传失败.'
				})
				onShowProgress(false);
			});
	};

	const props: UploadProps = {
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			setFileList([...fileList, file]);
			setUploaded(true)
			return false;
		},
		fileList,
	};
	const knowledgeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setKnowledge(event.target.value)
	}

	const handleQuerySummary = (query_sigs: string[]) => {
		let newSummarys: string[] = []
		query_sigs.forEach((sig) => {
			command.query_summary(activeId, sig).then((res) => {
				console.log(res)
				if (res !== undefined){
					newSummarys.push(res)
					setSummarys((prev) => {
						prev = [...newSummarys]
						return prev
					})
					console.log(summarys)
				}
			})
		})
	}
	return (
		<div className={styles.summary_container_mobile}>
			<div className={styles.summary_content_mobile}>
				<Row style={{marginBottom: 10}}>
					<Col span={24}>
						<MyKnowledges activeId={activeId} onSelectName={
							(name, value, owner)=>{
								setSelectedBook(name)
								setSelectedBookSig(value)
								setSelectedBookOwner(owner)
								setShowQueryDialog(true)
							}
						} knowledges={knowledges}/>
					</Col>
				</Row>
				<Row align={"middle"}>
					<Col span={2}>
						{
							stopped ?
								<AudioOutlined style={{color: "black", fontSize: 18}} onClick={() =>{
									confirm({
										icon: <ExclamationCircleFilled />,
										content: t('startRecordingKnowledge'),
										okText: t('confirm'),
										cancelText: t('cancel'),
										onOk() {
											stop_record()
										}
									})
								}}/>
								:
								<PauseOutlined style={{color: "black", fontSize: 18}} onClick={() => stop_record()}/>
						}
					</Col>
					<Col span={3}>
						<>
							<Button icon={uploaded ? <CheckOutlined /> : <UploadOutlined/>} onClick={(e)=>{
								Modal.info({
									content: t('uploadKnowledge'),
									onOk(){
										document.getElementById('upload-input')?.click();
									}
								})
							}}></Button>
							<Upload id="upload-input" maxCount={1} showUploadList={false} {...props}>
								<Button style={{display: "none"}}  icon={<UploadOutlined/>}></Button>
							</Upload>
						</>
					</Col>
					<Col span={13}>
						<Input placeholder={t('linkKnowledge')} value={knowledge} onChange={knowledgeInput}/>
					</Col>
					<Col span={4} style={{textAlign: "end"}}>
						<Button type={"primary"} style={{marginLeft: 10}} onClick={(e) => handleKnowledge(e)}>{t('do_summary')}</Button>
					</Col>
				</Row>
				{/*<Row>*/}
				{/*		<TextArea style={{marginTop: 10}} placeholder={t('digest')} value={summarys.join('\n')} rows={20}/>*/}
				{/*</Row>*/}
				<QueryEmbeddingComponent owner={selectedBookOwner} onClose={()=>setShowQueryDialog(false)} visible={showQueryDialog} bookname={selectedBook} bookSig={selectedBookSig} activeId={activeId} onShowProgress={onShowProgress}/>
			</div>
		</div>
	)
}

export default SummaryComponent;
