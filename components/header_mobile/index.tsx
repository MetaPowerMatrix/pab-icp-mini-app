import {Button, Card, Col, Descriptions, Divider, Flex, Modal, Popover, Row, Timeline} from "antd";
import utilStyles from "@/styles/utils.module.css";
import {
	EditOutlined,
	GoldFilled,
	QrcodeOutlined, ShareAltOutlined,
	TagsOutlined, UploadOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import commandDataContainer from "@/container/command";
import {useTranslations} from "next-intl";
import {PatoInfo} from "@/common";
import styles from './HeaderPanelMobile.module.css'
import SubscriptionsComponent from "@/components/Subscriptions";
import QRCodeComponent from "@/components/QRCode";
import Meta from "antd/es/card/Meta";
import TagsComponent from "@/components/tags";
import SlidePanel from "@/components/SlidePanel";

const HeaderPanelMobile = ({activeId, onChangeId, onShowProgress}:
   {activeId:string,
	   onShowProgress: (s: boolean)=>void,
	   onChangeId: (s: boolean)=>void,
	 }) =>
{
	const [userInfo, setUserInfo] = useState<PatoInfo>();
	const command = commandDataContainer.useContainer()
	const [showSubscription, setShowSubscription] = useState<boolean>(false)
	const [openPanel, setOpenPanel] = useState<boolean>(false)
	const [avatar, setAvatar] = useState('/images/notlogin.png')
	const [cover, setCover] = useState<string|undefined>(undefined)
	const [myTags, setMyTags] = useState<string[]>([]);
	const [openPop, setOpenPop] = useState<boolean>(false)
	const [predefinedTags, setPredefinedTags] = useState<string[]>([])
	const t = useTranslations('Login');

	const awardHead = ()=>{
		return(
			<>
				<GoldFilled style={{fontWeight: "bold", color: "black", fontSize: 14}}/>
				<span style={{marginLeft: 5, fontWeight: "bold", color: "black", fontSize: 12}}>我的勋章</span>
			</>
		)
	}

	const relationshipHead = (title: string)=>{
		return(
			<>
				<ShareAltOutlined style={{fontWeight: "bold", color: "black", fontSize: 14}}/>
				<span style={{marginLeft: 5, fontWeight: "bold", color: "black", fontSize: 12}}>{title}</span>
			</>
		)
	}

	const pad = function(src: Number, size: number) {
		let s = String(src);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	};
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			console.log('Text copied to clipboard');
		} catch (err) {
			console.error('Failed to copy text to clipboard: ', err);
		}
	};

	useEffect(()=>{
		command.getPredefinedTags().then((resp)=>{
			setPredefinedTags(resp)
		})
	}, [])

	useEffect(() => {
		command.getPatoInfo(activeId).then((res): void => {
			if ( res !== null){
				setUserInfo(res);
				setAvatar(res.avatar)
				setCover(res.cover)
				setMyTags(res.tags)
			}
		})
	},[activeId]);

	const handleSubmitTags = () => {
		onShowProgress(true)
		command.submit_pato_tags(myTags, activeId).then((resp)=>{
			setAvatar(resp)
			onShowProgress(false)
		})
	};
	const handleOpenChange = (newOpen: boolean) => {
		setOpenPop(newOpen);
	};

	return (
		<header className={styles.header_panel_mobile_container}>
			<div className={styles.header_user} style={{
				backgroundImage: cover ? `url(${cover})` : undefined,
				backgroundSize: "cover",
			}}
			>
				<Row align={"middle"}>
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
						{/*<h5>{t("RegisteredTime")}: {userInfo?.registered_datetime}</h5>*/}
						{/*<h5>{t("SN")}: {pad(userInfo === undefined ? 0 : userInfo.sn, 5).toString()}</h5>*/}

						{/*<a onClick={() => {*/}
						{/*	copyToClipboard(userInfo?.id ?? '')*/}
						{/*	Modal.success({*/}
						{/*		content: ("已复制ID")*/}
						{/*	})*/}
						{/*}}>{userInfo?.id === undefined ? '' : userInfo?.id.substring(0, 14) + '...' + userInfo?.id.substring(28, 36)}</a>*/}
					</Col>
					<Col span={5} style={{textAlign: "end"}}>
						<QrcodeOutlined style={{fontSize: 36}} onClick={()=>setOpenPanel(true)}/>
					</Col>
				</Row>
			</div>

			<div className={styles.header_panel_mobile_info}>
				<Card bodyStyle={{padding: 5}} style={{
					marginLeft: 20,
					marginRight: 20,
					top: 105,
					zIndex: 3,
					position: "absolute",
					height: 555,
					width: 370,
					overflow: "scroll",
					backgroundImage: "linear-gradient(to bottom, #eee, #fff)"
				}}>
					<div>
						<TagsOutlined style={{fontWeight: "bold", color: "#eeb075", fontSize: 14}}/>
						<span style={{marginLeft: 5, fontWeight: "bold", color: "black", fontSize: 12}}>我的标签</span>

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
							<EditOutlined style={{marginLeft: 20, color: "black", marginRight: 10}}/>
						</Popover>

						<UploadOutlined onClick={handleSubmitTags} style={{marginLeft: 10, color: "black", marginRight: 10}}/>
					</div>
					<div style={{padding: 20}}>
						<TagsComponent presetTags={myTags} height={100} tags={myTags} myTags={(tags) => {
							setMyTags(tags)
						}}/>
					</div>
					<Divider/>
					<div className={styles.info_container}>
						<Meta title={awardHead()}/>
						<div>
							<span>AAA</span><span>BBB</span><span>CCC</span><span>DDD</span>
						</div>
					</div>
					<div className={styles.info_container}>
						<Meta title={relationshipHead("我的粉丝")}/>
						<div>
							<span>AAA</span><span>BBB</span><span>CCC</span><span>DDD</span>
						</div>
					</div>
					<div className={styles.info_container}>
						<Meta title={relationshipHead("我的关注")}/>
						<div>
							<span>AAA</span><span>BBB</span><span>CCC</span><span>DDD</span>
						</div>
					</div>
					<Row style={{padding: 10}}>
						<Col span={24}>
							<Button style={{width: "100%", borderRadius:25, backgroundColor: "white", color:"black"}} onClick={() => onChangeId(false)}>切换账号</Button>
						</Col>
					</Row>
				</Card>
			</div>
			<SlidePanel activeId={activeId} isOpen={openPanel} onClose={() => setOpenPanel(false)}>
				<QRCodeComponent id={activeId}/>
			</SlidePanel>
			<SubscriptionsComponent mobile={false} id={activeId} onClose={() => setShowSubscription(false)}
			                        visible={showSubscription} onShowProgress={onShowProgress}/>
		</header>
	)
}

export default HeaderPanelMobile
