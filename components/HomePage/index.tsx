import React, {useEffect, useRef, useState} from 'react';
import { gsap } from 'gsap';
import styles from './HomePage.module.css';
import {
	AudioOutlined,
	HeartOutlined,
	MenuUnfoldOutlined, PauseOutlined,
	PlusOutlined,
	SearchOutlined, SendOutlined, UnorderedListOutlined,
} from "@ant-design/icons";
import {useGSAP} from "@gsap/react";
import {PatoInfo} from "@/common";
import commandDataContainer from "@/container/command";
import {Avatar, Col, Drawer, List, Row} from "antd";
import SlidePanel from "@/components/SlidePanel";
import AIChat from "@/components/AIChat";

// Define types for ref elements
interface HomePageProps {
	activeId: string;
	query: string;
	ctrlVoiceStart: (startStop: boolean)=>void;
}
interface ChatMessage {
	sender: string,
	content: string
	type: string
}

const HomePage: React.FC<HomePageProps> = ({activeId, query, ctrlVoiceStart}) => {
	const upgradeRef = useRef<HTMLDivElement>(null);
	const trendingVideoRef = useRef<HTMLDivElement>(null);
	const [openPanel, setOpenPanel] = useState<boolean>(false)
	const [avatar, setAvatar] = useState('/images/notlogin.png')
	const [userInfo, setUserInfo] = useState<PatoInfo>();
	const [open, setOpen] = useState(false);
	const [stopped, setStopped] = useState<boolean>(true);
	const [queryText, setQueryText] = useState<string>(query)
	const [sendQuery, setSendQuery] = useState<string>('')
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const command = commandDataContainer.useContainer()
	const images = [
		{ id: 1, url: 'images/ad-1.webp', title: '鸢尾花' },
		{ id: 2, url: 'images/ad-2.webp', title: "春晓" },
		{ id: 3, url: 'images/ad-3.webp', title: '诗人' },
		{ id: 4, url: 'images/splash_image.jpg', title: '海底' },
		{ id: 5, url: 'images/background.jpeg', title: "异星" },
		{ id: 1, url: 'images/ad-1.webp', title: '鸢尾花' },
		{ id: 2, url: 'images/ad-2.webp', title: "春晓" },
		{ id: 3, url: 'images/ad-3.webp', title: '诗人' },
		{ id: 4, url: 'images/splash_image.jpg', title: '海底' },
		{ id: 5, url: 'images/background.jpeg', title: "异星" },
	];

	useEffect(() => {
		command.getPatoInfo(activeId).then((res): void => {
			if ( res !== null){
				setUserInfo(res);
				setAvatar(res.avatar)
			}
		})
	},[activeId]);

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
	const inputQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) =>{
		setQueryText(event.target.value)
	}
	const process_chat_message = (event: any) => {
		if (event.data.toString() !== 'pong' && event.data.toString() !== '数据格式错误'){
			// console.log(event.data.toString())
			let resp: [] = JSON.parse(event.data.toString())
			let msgs: ChatMessage[] = []
			resp.forEach((message: any) => {
				if (message['role'] === "assistant" && message['content'] !== null){
					let msg: ChatMessage = {
						sender: message['sender'],
						content: message['content'],
						type:'text'
					}
					msgs.push(msg)
				}
			})
			setMessages([...messages, ...msgs])
		}
	}

	useGSAP(() => {
		// Animate elements when the page loads using GSAP
		if (upgradeRef.current) {
			gsap.from(upgradeRef.current, { y: 30, opacity: 0, duration: 2 });
			gsap.from(trendingVideoRef.current, { y: 50, opacity: 0, duration: 2 });
		}
	}, []);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<div className={styles.home_container}>
			<div className={styles.header}>
				<div style={{display: "flex"}}>
					<h4><MenuUnfoldOutlined onClick={()=>showDrawer()}/></h4>
					<h4>{userInfo?.name ?? '登陆'}</h4>
				</div>
				<div style={{display: "flex"}}>
					<div className={styles.search}><SearchOutlined/></div>
					<div className={styles.notification}><PlusOutlined onClick={()=>setOpenPanel(true)}/></div>
				</div>
				</div>

				<div>
					<div className={styles.trending_video} ref={trendingVideoRef}>
						<h5 className={styles.category_text}>全部</h5>
						<h5 className={styles.category_text}>投资</h5>
						<h5 className={styles.category_text}>情感</h5>
						<h5 className={styles.category_text}>科技</h5>
						<h5 className={styles.category_text}>教育</h5>
						<h5 className={styles.category_text}>...</h5>
					</div>
				</div>
				<div style={{overflow: "scroll", height: "95%"}}>
					<div className={styles.upgrade_section} ref={upgradeRef}>
						<div className={styles.upgrade_content}>
							<img src={images[0].url} className={styles.video_thumbnail} alt={"img"}/>
							<div style={{padding: 15}}>
								<h3>准备杀入A股</h3>
								<h5>不知道结局如何，有建议不</h5>
								<ul style={{height: 110, marginTop: 10, color: "gray"}}>
									<h5>A: 勇敢</h5>
									<h5>B: just do it</h5>
									<h5>C: 找死</h5>
									<h5>D: 搬个板凳看</h5>
								</ul>
								<button className={styles.upgrade_btn}>聊聊</button>
							</div>
						</div>
					</div>
					<div>
						{
							[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
								<div key={index} className="goods">
									<div className={styles.video_item}>
										<img src={images[index].url} className={styles.video_thumbnail}/>
										<div className={styles.video_info}>
											<p>周杰伦的歌好听吗</p>
											<button>说说</button>
											<button>Like <HeartOutlined/></button>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
				<Drawer
					title="频道"
					placement="left"
					closable={false}
					onClose={onClose}
					open={open}
					width={220}
					height={680}
					style={{backgroundColor: "black"}}
					key="left"
					className={styles.drawer}
				>
					<h3>搜索</h3>
					<h3>会员</h3>
					<h3>客服</h3>
				</Drawer>
			<SlidePanel activeId={activeId} isOpen={openPanel} onClose={() => setOpenPanel(false)}>
				<Row align={"middle"} style={{width:"100%"}}>
					<Col span={22}>
						<textarea value={queryText} placeholder="那么，说说你的想法..." rows={2}
						          className={styles.prompt_input}
						          onChange={inputQuestion}
						/>
					</Col>
					<Col span={1} style={{paddingTop: 10}}>
						<div>
							{stopped ?
								<AudioOutlined style={{color: "black", fontSize: 14}} onClick={() => stop_record()}/>
								:
								<PauseOutlined style={{color: "black", fontSize: 14}}
								               onClick={() => stop_record()}/>
							}
						</div>
						<div>
							<SendOutlined style={{color: "black", fontSize: 14}}
							              onClick={() => setSendQuery(queryText)}/>
						</div>
					</Col>
				</Row>
				<AIChat activeId={activeId} process_ws_message={process_chat_message} question={sendQuery}/>
				<div style={{height: 370, marginTop:10, overflow: "scroll"}}>
					<List
						itemLayout="vertical"
						size="small"
						dataSource={messages}
						renderItem={(item, index) => (
							<List.Item key={index}>
								<List.Item.Meta
									avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
									title={<a href="https://ant.design">{item.sender}</a>}
									description="#assistan"
								/>
								{item.content}
							</List.Item>
						)}
					/>
				</div>
			</SlidePanel>
		</div>
	)
};

export default HomePage;
