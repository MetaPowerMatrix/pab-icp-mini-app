import React, {useEffect, useRef, useState} from 'react';
import { gsap } from 'gsap';
import styles from './HomePage.module.css';
import {
	HeartOutlined,
	MenuUnfoldOutlined, PlusOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import {useGSAP} from "@gsap/react";
import {PatoInfo, TopicInfo} from "@/common";
import commandDataContainer from "@/container/command";
import {Drawer, Switch} from "antd";
import Link from "next/link";
import { useRouter } from 'next/router';

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
	const [topics, setTopics] = useState<TopicInfo[]>([])
	const command = commandDataContainer.useContainer()
	const router = useRouter();

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
	const toTopic = () => {
			router.push('/topic');
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
					<Link href={"/detail"} ><div className={styles.notification}><PlusOutlined/></div></Link>
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
							<img src="images/ad-1.jpg" className={styles.video_thumbnail} alt={"img"}/>
							<div style={{padding: 15}}>
								<h3>比特币还可以买吗，太高了吧！！！</h3>
								<h5>#投资#BTC#DOGE</h5>
								<ul style={{height: 110, marginTop: 10, color: "gray"}}>
									<h5>A: 买！买！买！</h5>
									<h5>B: 谨慎</h5>
									<h5>C: 没钱</h5>
									<h5>D: 同问</h5>
								</ul>
								<button onClick={toTopic} className={styles.upgrade_btn}>发起话题</button>
							</div>
						</div>
					</div>
					<div>
						{
							topics.map((item, index) => (
								<div key={index} className="goods">
									<div className={styles.video_item}>
										<img src={item.cover} className={styles.video_thumbnail}/>
										<div className={styles.video_info}>
											<p>{item.title}</p>
											<h5>{item.tags.join('#')}</h5>
											<button>详情</button>
											<button>Like <HeartOutlined/></button>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
				<Drawer
					title="设置"
					placement="left"
					closable={false}
					onClose={onClose}
					open={open}
					width={220}
					key="left"
				>
					<div style={{display: "flex", justifyContent: "space-between"}}>
						<label>自动回复</label>
						<Switch defaultChecked onChange={(e) => { }} checkedChildren="开启" unCheckedChildren="关闭"/>
					</div>
				</Drawer>
		</div>
	)
};

export default HomePage;
