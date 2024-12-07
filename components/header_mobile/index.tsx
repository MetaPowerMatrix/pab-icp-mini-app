import {Button, Card, Col, Divider, Popover, Row} from "antd";
import utilStyles from "@/styles/utils.module.css";
import {
	EditOutlined,
	GoldFilled, PlusOutlined,
	QrcodeOutlined, ShareAltOutlined,
	TagsOutlined, UploadOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import commandDataContainer from "@/container/command";
import {useTranslations} from "next-intl";
import {KolInfo, PatoInfo, PortalHotAi} from "@/common";
import styles from './HeaderPanelMobile.module.css'
import QRCodeComponent from "@/components/QRCode";
import Meta from "antd/es/card/Meta";
import TagsComponent from "@/components/tags";
import SlidePanel from "@/components/SlidePanel";
import KOLListComponent from "@/components/KOL";
import {doMd5Sum} from "@/lib/utils";
import ProgressBarComponent from "@/components/ProgressBar";
import {useRouter} from "next/router";

const awardHead = ()=>{
	return(
		<>
			<GoldFilled style={{fontWeight: "bold", color: "white", fontSize: 14}}/>
			<span style={{marginLeft: 5, fontWeight: "bold", color: "white", fontSize: 12}}>我的勋章</span>
		</>
	)
}

const relationshipHead = (title: string)=>{
	return(
		<>
			<ShareAltOutlined style={{fontWeight: "bold", color: "white", fontSize: 14}}/>
			<span style={{marginLeft: 5, fontWeight: "bold", color: "white", fontSize: 12}}>{title}</span>
		</>
	)
}
const HeaderPanelMobile = ({activeId}: {activeId:string}) =>
{
	const [userInfo, setUserInfo] = useState<PatoInfo>();
	const command = commandDataContainer.useContainer()
	const [openPanel, setOpenPanel] = useState<boolean>(false)
	const [avatar, setAvatar] = useState('/images/notlogin.png')
	const [cover, setCover] = useState<string|undefined>(undefined)
	const [myTags, setMyTags] = useState<string[]>([]);
	const [openPop, setOpenPop] = useState<boolean>(false)
	const [predefinedTags, setPredefinedTags] = useState<string[]>([])
	const [isKol, setIsKol] = useState<boolean>(false)
	const [token, setToken] = useState<string>("")
	const [reload, setReload] = useState<number>(0)
	const [kols, setKols] = useState<KolInfo[]>([])
	const [myKol, setMyKol] = useState<KolInfo|undefined>(undefined)
	const [followers, setFollowers] = useState<string[][]>([])
	const [followings, setFollowings] = useState<string[][]>([])
	const [popContent, setPopContent] = useState<string>("become_kol")
	const [loading, setLoading] = useState(false);
	const t = useTranslations('Login');
	const router = useRouter();

	useEffect(()=>{
		command.getPredefinedTags().then((resp)=>{
			setPredefinedTags(resp)
		})
		// command.queryPatoKolToken(activeId).then((res)=>{
		// 	console.log("confirm kol token", res)
		// })
	}, [])

	useEffect(() => {
		command.getPatoInfo(activeId).then((res): void => {
			if ( res !== null){
				setUserInfo(res);
				setAvatar(res.avatar)
				setCover(res.cover)
				setMyTags(res.tags)
				setFollowers(res.followers)
				setFollowings(res.followings)
			}
		})
		command.queryPatoKolToken(activeId).then((res)=>{
			if (res && res.token !== ""){
				setToken(res.token)
				setIsKol(true)
			}
		})
		command.getKolList().then((res) =>{
			res.forEach((info) =>{
				setKols(res)
				if (info.id === activeId) {
					setMyKol(info)
				}
			})
		})
	},[activeId, reload]);

	const handleSubmitTags = () => {
		setLoading(true)
		let session = doMd5Sum(activeId + Date.now().toLocaleString())
		command.submit_pato_tags(myTags, activeId, session).then((resp)=>{
			// setAvatar(resp)
			setTimeout(()=>{
				setLoading(false)
				setReload(reload+1)
			}, 20000)
		})
	};
	const handleOpenChange = (newOpen: boolean) => {
		setOpenPop(newOpen);
	};

	const toSwitch = () => {
		router.push('/switch');
	};

	return (
		<header className={styles.header_panel_mobile_container}>
			<div className={styles.header_user} style={{
				backgroundImage: cover ? `url(${cover})` : undefined,
				backgroundSize: "contain",
			}}
			>
					<Row style={{backgroundColor: "#00000080", padding: 5}}>
						<Col span={5} style={{textAlign: "center"}}>
							<img
								src={avatar}
								className={utilStyles.borderCircle}
								height={72}
								width={72}
								alt={userInfo?.name ?? ''}
							/>
						</Col>
						<Col span={13}>
							<h5 className={utilStyles.headingLg}>
								{userInfo?.name}
							</h5>
							<h5>{t("Balance")}: {userInfo?.balance.toString()}</h5>
						</Col>
						<Col span={5} style={{textAlign: "end"}}>
							<QrcodeOutlined style={{fontSize: 36}} onClick={()=> {
								setPopContent("become_kol")
								setOpenPanel(true)
							}}/>
						</Col>
					</Row>
			</div>

			<div className={styles.header_panel_mobile_info}>
				<Card bodyStyle={{padding: 5}} style={{
					margin: 20,
					zIndex: 3,
					height: 460,
					overflow: "scroll",
					backgroundColor: "#212121",
					opacity: "0.9",
					border: 0
					// backgroundImage: "linear-gradient(to bottom, #eee, #fff)"
				}}>
					<div>
						<TagsOutlined style={{fontWeight: "bold", color: "white", fontSize: 14}}/>
						<span style={{marginLeft: 5, fontWeight: "bold", color: "white", fontSize: 12}}>我的标签</span>

						<Popover
							placement={"bottom"}
							content={
								<div style={{width: 340}}>
									<TagsComponent height={300} presetTags={myTags} tags={predefinedTags} myTags={(tags) => {
										setMyTags(tags)
									}}/>
								</div>
							}
							trigger="click"
							open={openPop}
							onOpenChange={handleOpenChange}
						>
							<EditOutlined style={{marginLeft: 20, color: "white", marginRight: 10}}/>
						</Popover>

						<UploadOutlined onClick={handleSubmitTags} style={{marginLeft: 10, color: "white", marginRight: 10}}/>
					</div>
					<div style={{padding: 20}}>
						<TagsComponent presetTags={myTags} height={67} tags={myTags} myTags={(tags) => {
							setMyTags(tags)
						}}/>
					</div>
					<div className={styles.info_container}>
						<Meta title={awardHead()}/>
						<div>
							{isKol && <span style={{color: "#eeb075"}}>KOL</span>}
						</div>
					</div>
					<div className={styles.info_container}>
						<Meta title={relationshipHead("我的粉丝")}/>
						<div style={{marginRight: 10, overflow: "hidden"}}>
							{
									followers.map((follower, index) => {
										return (
											<span key={index} style={{color: "#eeb075", fontSize: 12, marginLeft: 5}}>{follower[1]}</span>
										)
									})
							}
						</div>
					</div>
					<div className={styles.info_container}>
						<Meta title={relationshipHead("我的关注")}/>
						<div style={{marginRight: 10, overflow: "hidden"}}>
							{
								followings.map((following, index) => {
									return (
										<span key={index} style={{color: "#eeb075", fontSize: 12, marginLeft: 5}}>{following[1]}</span>
									)
								})
							}
						</div>
						<div>
							<PlusOutlined onClick={()=>{
								setPopContent("follow")
								setOpenPanel(true)
							}}/>
						</div>
					</div>
					<Row style={{padding: 8}}>
						<Col span={24}>
							<Button style={{width: "100%", borderRadius:25, backgroundColor: "white", color:"black"}} onClick={toSwitch}>切换账号</Button>
						</Col>
					</Row>
				</Card>
			</div>
			<ProgressBarComponent visible={loading} steps={15}/>
			<SlidePanel activeId={activeId} isOpen={openPanel} onClose={() => setOpenPanel(false)}>
				{
					popContent === "become_kol" &&
            <QRCodeComponent id={activeId} isKol={isKol} token={token} onBuyToken={(token)=>{
							setReload(reload+1); if (token !== ""){ setIsKol(true); setToken(token) }
						}}/>
				}
				{
					popContent === "follow" &&
						<KOLListComponent activeId={activeId} onClose={(token)=>{}} kols={kols}/>
				}
			</SlidePanel>
		</header>
	)
}

export default HeaderPanelMobile
