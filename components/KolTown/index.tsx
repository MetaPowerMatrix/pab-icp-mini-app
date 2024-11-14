import React, {useEffect, useRef, useState} from "react";
import styles from "./KolTownComponent.module.css";
import {KolInfo, recipientAddress} from "@/common";
import commandDataContainer from "@/container/command";
import BuyKolComponent from "@/components/BuyKol";
import Waterfall from "@/components/Waterfall/react";
import ChangingColorText from "@/components/AniBanner";

const customStyleGrid = `#react-waterfall-grid-comps li>div {
	  overflow: hidden;
	  background: rgb(255, 255, 255);
	  transition: all 0.5s
	}
	#react-waterfall-grid-comps li>div:hover {
	  transform: translateY(-6px);
	  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
	  transition: all 0.3s
	}
	#react-waterfall-grid-comps li>div>img {
	  width: 100%;
	}`;

const RoomList = ({rooms, mine}:{rooms:KolInfo[], mine:boolean}) => {
	const images = [
		{ id: 1, url: 'images/yuanweihua.jpeg', title: '鸢尾花' },
		{ id: 2, url: 'images/chunxiao.jpg', title: "春晓" },
		{ id: 3, url: 'images/two-poets.png', title: '诗人' },
		{ id: 4, url: 'images/splash_image.jpg', title: '海底' },
		{ id: 5, url: 'images/background.jpeg', title: "异星" },
		{ id: 1, url: 'images/yuanweihua.jpeg', title: '鸢尾花' },
		{ id: 2, url: 'images/chunxiao.jpg', title: "春晓" },
		{ id: 3, url: 'images/two-poets.png', title: '诗人' },
		{ id: 4, url: 'images/splash_image.jpg', title: '海底' },
		{ id: 5, url: 'images/background.jpeg', title: "异星" },
	];
	const ulMaxHRef = useRef(0);

	return(
		<div
			style={{
				padding: 15,
				height: "600px",
				width: "410px",
				overflowY: "scroll"
			}}
			onScroll={(e) => {
				const scrollH = (e.target as HTMLElement).scrollTop;
				// 700 是一个自己把握的值即满足 scrollTop + height + 调节值 > ulMaxHRef.current
				// 因为不一定要滚动到在最底端才执行加载逻辑
				// 注意使用者应自己处理加载节流逻辑
				if (scrollH + 700 > ulMaxHRef.current) {
					console.log("滚动到底部执行加载逻辑，代替点击 loadmore 按钮");
				}
			}}>
			<Waterfall
				mode="grid"
				el="#react-waterfall-grid-comps"
				columnWidth={175}
				columnCount={2}
				columnGap={20}
				rowGap={20}
				customStyle={customStyleGrid}
				onChangeUlMaxH={(h: number) => (ulMaxHRef.current = h)}
			>
				{images.map((item, index) => {
					return (
						<li key={index} onClick={() =>{} }>
							<div style={{textAlign: "center"}}>
								<img src={item.url} alt="" />
								<span style={{color: "gray", fontSize: 14}}>{item.title}</span>
							</div>
						</li>
					);
				})}
			</Waterfall>
		</div>
	)
}

const KolTownComponent = ({activeId, name, onShowProgress, query, ctrlVoiceStart}: {
	activeId: string,
	name: string,
	onShowProgress: (s: boolean) => void,
	ctrlVoiceStart: (startStop: boolean)=>void;
	query: string;
}) => {
	const [roomList, setRoomList] = useState<KolInfo[]>([])
	const [myRoomList, setMyRoomList] = useState<KolInfo[]>([])
	const [reload, setReload] = useState<number>(0)
	const [roomId, setRoomId] = useState<string>('')
	const [showBuyKol, setShowBuyKol] = useState<boolean>(false)
	const [buyWhat, setBuyWhat] = useState<string>('kol')
	const [isKol, setIsKol] = useState<boolean>(false)
	const [queryText, setQueryText] = useState<string>("")
	const command = commandDataContainer.useContainer()

	useEffect(() => {
		command.getKolList().then((res) => {
			setRoomList(res)
			let mine: KolInfo[] =  []
			res.forEach((info) =>{
				if (info.id === activeId){
					setIsKol(true)
				}
				if (info.followers.includes(activeId)){
					mine.push(info)
				}
			})
			setMyRoomList(mine)
		})
	}, [reload, activeId])

	const inputQuestion = (event: React.ChangeEvent<HTMLInputElement>) =>{
		setQueryText(event.target.value)
	}

	return (
		<>
			<div className={styles.kol_town_container}>
				<div className={styles.kol_town_content}>
					<div className={styles.header_search}>
						<ChangingColorText text="这世界那么多有趣的人" />
						{/*<h3 className={styles.search_title}>{t('hot')}</h3>*/}
						<input value={queryText} placeholder={"搜索"}
						       className={styles.search_input}
						       onChange={inputQuestion}
						/>
					</div>
					<RoomList rooms={roomList} mine={false}/>
					<BuyKolComponent recipient={recipientAddress} id={activeId} room_id={roomId} buyWhat={buyWhat}
             onClose={()=> {
							 setReload(reload + 1)
							 setShowBuyKol(false)
						 }}
					/>
				</div>
			</div>
		</>
	)
}

export default KolTownComponent;
