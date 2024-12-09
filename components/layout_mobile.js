import Head from 'next/head';
import styles from './layout_mobile.module.css';
import {Tabs} from "antd";
import {
    UserOutlined,
    CommentOutlined, HomeOutlined,
} from "@ant-design/icons";
import React, {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import HeaderPanelMobile from "./header_mobile";
import AIVoice from "@/components/AIVoice";
import MobileFramework from "@/components/MobileFramework";
import HomePage from "@/components/HomePage";
import DetailPage from "@/components/DetailPage";

export default function LayoutMobile({children, title, description, onRefresh, showTabs }) {
    const [availableIds, setAvailableIds] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [activeName, setActiveName] = useState("");
    const [activeTab, setActivTab] = useState('home');
    const [query, setQuery] = useState("");
    const [notify, setNotify] = useState("")
    const [start, setStart] = useState(false);
    const t = useTranslations('Login');

    const process_ws_message = (event) => {
        if (event.data.toString() !== 'pong') {
            setQuery(event.data.toString())
        }
    }
    const receive_notify = (message) => {
        setNotify(message)
    }

    const stop_record = (startStop) => {
        setStart(startStop)
    }

    useEffect(() => {
        const localInfoStr = localStorage.getItem("local_patos")
        if (localInfoStr === null) {
            toLogin()
        }else {
            const localInfo = JSON.parse(localInfoStr)
            setActiveId(localInfo.active_id);
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
                    <HomePage name={activeName} ctrlVoiceStart={stop_record} query={query} activeId={activeId}/>
                }
                {key === 'chat' &&
                    <MobileFramework notify={notify} ctrlVoiceStart={stop_record} query={query} name={activeName} activeId={activeId}/>
                }
                {/*{key === 'discovery' &&*/}
                {/*    <TownMobile ctrlVoiceStart={stop_record} query={query} name={activeName} id={activeId} onShowProgress={showProgressBar} />*/}
                {/*}*/}
                {key === 'mine' &&
                    <HeaderPanelMobile activeId={activeId}/>
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
                <meta name="viewport" content="width=device-width, user-scalable=0, interactive-widget=overlays-content, initial-scale=1"/>
            </Head>
            {
                <>
                    <AIVoice onReply={receive_notify} activeId={activeId} process_ws_message={process_ws_message} startStop={start}/>
                    {showTabs ?
                        <Tabs
                            destroyInactiveTabPane={true}
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
                        :
                        <DetailPage ctrlVoiceStart={stop_record} query={query} name={activeName} activeId={activeId}/>
                    }
                </>
            }
        </div>
    );
}
