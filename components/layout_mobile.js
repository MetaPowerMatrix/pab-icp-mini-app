import Head from 'next/head';
import styles from './layout_mobile.module.css';
import {Tabs} from "antd";
import {
    UserOutlined,
    ShopOutlined,
    CommentOutlined, HomeOutlined,
} from "@ant-design/icons";
import React, {useEffect, useState} from 'react';
import ModalLogin from "@/components/login";
import {useTranslations} from 'next-intl';
import ProgressBarComponent from "@/components/ProgressBar";
import HeaderPanelMobile from "./header_mobile";
import TownMobile from "@/components/town";
import commandDataContainer from "@/container/command";
import AIVoice from "@/components/AIVoice";
import MobileFramework from "@/components/MobileFramework";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/components/HomePage";

export default function LayoutMobile({children, title, description, onChangeId, onRefresh }) {
    const [availableIds, setAvailableIds] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [activeId, setActiveId] = useState("");
    const [activeName, setActiveName] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActivTab] = useState('home');
    const [query, setQuery] = useState("");
    const [start, setStart] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    const t = useTranslations('Login');
    const command = commandDataContainer.useContainer()

    const showProgressBar = (show) => {
        setLoading(show)
    }
    const changeLoginState = (status) =>{
        setIsLogin(status);
    }

    const process_ws_message = (event) => {
        if (event.data.toString() !== 'pong') {
            setQuery(event.data.toString())
        }
    }

    const stop_record = (startStop) => {
        setStart(startStop)
    }

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(false)
        }, 3000)
    }, [])

    useEffect(() => {
        const localInfoStr = localStorage.getItem("local_patos")
        if (localInfoStr === null) {
            setIsLogin(false);
        }else {
            const localInfo = JSON.parse(localInfoStr)
            setActiveId(localInfo.active_id);
            onChangeId(localInfo.active_id);
            setIsLogin(true);
            const ids = localInfo.ids;
            const idsMap = ids.map((id) => {
                const id_name = id.split(":")
                if (id_name.length > 1){
                    if (id_name[0] === localInfo.active_id){
                        setActiveName(id_name[1])
                    }
                    return {label: id.split(":")[1], value: id.split(":")[0]};
                }
            });
            // console.log(idsMap)
            idsMap.forEach((item) => {
                if (item.value === activeId) {
                    onRefresh(item.label)
                }
            });
            idsMap.unshift({label:'请选择',value:'tips'})
            setAvailableIds(idsMap);
            // command.log_user_activity(localInfo.active_id, "home", "login").then(()=>{})
        }
    },[activeId]);

    useEffect(() => {
        if (activeId !== ''){
            const currentUrl = window.location.search;
            const searchParams = new URLSearchParams(currentUrl);
            const paramName = 'to';
            const to_page = searchParams.get(paramName);
            console.log(to_page);
            if (to_page === 'kol'){
                setActivTab("town")
            }
            if (to_page === 'accept' && isLogin){
                const back = searchParams.get('back')
                window.location.href = decodeURI(back);
            }
        }
    }, [activeId])

    const tabs =[
        {label: '首页', key:"home", icon: <HomeOutlined/>},
        {label: t('messages'), key:"chat", icon: <CommentOutlined/>},
        // {label: t("discovery"), key:"discovery", icon: <ShopOutlined/>},
        {label: t("mine"), key:"mine", icon: <UserOutlined />}
    ]

    const content = (key) => {
        return(
            <>
                {key === 'home' &&
                    <HomePage activeId={activeId}/>
                }
                {key === 'chat' &&
                    <MobileFramework ctrlVoiceStart={stop_record} query={query} name={activeName} activeId={activeId}/>
                }
                {key === 'discovery' &&
                    <TownMobile ctrlVoiceStart={stop_record} query={query} name={activeName} id={activeId} onShowProgress={showProgressBar} />
                }
                {key === 'mine' &&
                    <HeaderPanelMobile
                        onShowProgress={showProgressBar}
                        activeId={activeId} onChangeId={changeLoginState}
                    />
                }
            </>
        )
    }

    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="description" content={description}/>
                <meta name="og:title" content={title}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            {
                showSplash ? <SplashScreen /> :
                    isLogin ?
                            <>
                                <AIVoice activeId={activeId} process_ws_message={process_ws_message} startStop={start}/>
                                <Tabs
                                    destroyInactiveTabPane={false}
                                    tabBarGutter={80}
                                    tabBarStyle={{backgroundColor: 'black', marginTop: 0}}
                                    centered
                                    size={"small"}
                                    type={"line"}
                                    animated={true}
                                    tabPosition="bottom"
                                    activeKey={activeTab}
                                    onChange={(key)=>setActivTab(key)}
                                    items={tabs.map((tab) => {
                                        return {
                                            label: tab.label,
                                            key: tab.key,
                                            children: content(tab.key),
                                            icon:tab.icon
                                        };
                                    })}
                                />
                            </>
                            :
                            null
            }

            <ProgressBarComponent visible={loading} steps={15} />
            <ModalLogin mobile={true} isOpen={!isLogin} tips={t} options={availableIds}
                onClose={(id) => {
                    setIsLogin(true)
                    if (id !== '') {
                        setActiveId(id)
                        const localInfoStr = localStorage.getItem("local_patos")
                        if (localInfoStr !== null) {
                            let localInfo = JSON.parse(localInfoStr)
                            localInfo.active_id = id
                            localStorage.setItem("local_patos", JSON.stringify(localInfo))
                            setActiveId(localInfo.active_id);
                        }
                    }
                }}
            />
        </div>
    );
}
