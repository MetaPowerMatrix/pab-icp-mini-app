import React, {useEffect, useRef, useState} from 'react';
import { gsap } from 'gsap';
import styles from './HomePage.module.css';
import {
	FireOutlined,
	HeartOutlined,
	MenuUnfoldOutlined,
	MoreOutlined,
	NotificationOutlined,
	SearchOutlined,
	UserOutlined
} from "@ant-design/icons";
import ChangingColorText from "@/components/AniBanner";
import {useGSAP} from "@gsap/react";
import {PatoInfo} from "@/common";
import commandDataContainer from "@/container/command";
import {Drawer} from "antd";

// Define types for ref elements
interface HomePageProps {
	activeId: string;
}

const HomePage: React.FC<HomePageProps> = ({activeId}) => {
	const upgradeRef = useRef<HTMLDivElement>(null);
	const trendingVideoRef = useRef<HTMLDivElement>(null);
	const [avatar, setAvatar] = useState('/images/notlogin.png')
	const [userInfo, setUserInfo] = useState<PatoInfo>();
	const [open, setOpen] = useState(false);
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
					<div className={styles.notification}><UserOutlined/></div>
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
					{/* Trending Video Section */}
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
					width={200}
					style={{backgroundColor: "black"}}
					key="left"
					className={styles.drawer}
				>
					<h3>首页</h3>
					<h3>聊天</h3>
					<h3>我的</h3>
				</Drawer>
			</div>
	)};

	export default HomePage;
