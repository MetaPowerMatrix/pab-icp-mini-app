import React, {useCallback, useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import styles from './MobileFramework.module.css';
import {
    AudioOutlined,
    PauseOutlined,
    SendOutlined,
    TagsOutlined, TeamOutlined
} from "@ant-design/icons";
import {Col, Modal, Popover, Row} from "antd";
import {useTranslations} from "next-intl";
import commandDataContainer from "../../container/command";
import {api_url, getApiServer, MessageCategory} from "@/common";
import TagsComponent from "@/components/tags";
import ChatListComponet from "@/components/ChatList";

interface AIReply {
    message: string,
    imageUrl: string,
    category: MessageCategory,
    status: string
}
const defaultReply: AIReply = {
    message: "...",
    imageUrl: "...",
    category: MessageCategory.Human,
    status: "enter"
}
const aiCharacterTags: string[] = ["情感", "历史", "游戏", "婚恋", "科技", "投资", "职业", "音乐", "助手"]

const MobileFramework = ({name, activeId, query, ctrlVoiceStart}:{name: string, activeId: string, query: string, ctrlVoiceStart: (startStop: boolean)=>void}) => {
    const headerRef = useRef(null);
    const listRef = useRef();
    const promptInputRef = useRef(null);
    const [stopped, setStopped] = useState<boolean>(true);
    const [queryText, setQueryText] = useState<string>(query)
    const [openPop, setOpenPop] = useState<boolean>(false)
    const [openTeam, setOpenTeam] = useState<boolean>(false)
    const [patos, setPatos] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedPatos, setSelectedPatos] = useState<string[]>([]);
    const [aiReplies, setAiReplies] = useState<AIReply[]>([]);
    const t = useTranslations('AIInstruct');
    const {confirm} = Modal;
    const command = commandDataContainer.useContainer()

    useEffect(() => {
        command.getTownHots().then((res) => {
            if (res !== null) {
                setPatos(res.map((item) => item.name))
            }
        })
        let ctx = gsap.context(() => {
            gsap.from(headerRef.current, { y: -50, opacity: 0, duration: 1 });
            gsap.from(promptInputRef.current, { y: 50, opacity: 0, duration: 1 });
        });
        return () => ctx.revert();
    }, []);

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
        setQueryText("")
        let reply: AIReply = {
            message: topic,
            imageUrl: topic,
            category: MessageCategory.Human,
            status: "enter"
        }
        setAiReplies((aiReplies) => [...aiReplies, reply])
        // @ts-ignore
        listRef.current?.addItem(reply)

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
                }else{
                    let reply: AIReply = {
                        message: data.content,
                        imageUrl: data.content,
                        category: MessageCategory.Card,
                        status: "enter"
                    }
                    setAiReplies((aiReplies) => [...aiReplies, reply])
                    // @ts-ignore
                    listRef.current?.addItem(reply)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(t('assist_fail'));
            });
    };
    const inputQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) =>{
        setQueryText(event.target.value)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpenPop(newOpen);
    };

    const handleOpenTeamChange = (newOpen: boolean) => {
        setOpenTeam(newOpen);
    };

    return (
      <>
          <div className={styles.content}>
              <header className={styles.app_header} ref={headerRef}>
                  {/*<h3>{name}</h3>*/}
                  {/*<button className={styles.get_pro}>读书</button>*/}
              </header>

              <div className={styles.input_section}>
                    <textarea value={queryText} placeholder="emm，我们聊些什么呢..." rows={4} ref={promptInputRef}
                              className={styles.prompt_input}
                              onChange={inputQuestion}
                    />
                  <div className={styles.style_options}>
                      <Row align="middle">
                          <Col span={2}>
                              {stopped ?
                                <AudioOutlined style={{color: "black", fontSize: 14}} onClick={() => stop_record()}/>
                                :
                                <PauseOutlined style={{color: "black", fontSize: 14, marginRight: 10}}
                                               onClick={() => stop_record()}/>
                              }
                          </Col>
                          <Col span={2}>
                              <Popover
                                placement={"bottomLeft"}
                                content={
                                    <div style={{width: 270}}>
                                        <TagsComponent presetTags={[]} tags={patos} myTags={(tags) => {
                                            setQueryText("@"+tags.join(" @"))
                                            setSelectedPatos(tags)
                                        }}/>
                                    </div>
                                }
                                trigger="click"
                                open={openTeam}
                                onOpenChange={handleOpenTeamChange}
                              >
                                  <TeamOutlined style={{color: "black", fontSize: 14}}/>
                              </Popover>
                          </Col>
                          <Col span={18}>
                              <Popover
                                placement={"bottomLeft"}
                                content={
                                    <div style={{width: 270}}>
                                        <TagsComponent presetTags={[]} tags={aiCharacterTags} myTags={(tags) => { setSelectedTags(tags) }}/>
                                    </div>
                                }
                                trigger="click"
                                open={openPop}
                                onOpenChange={handleOpenChange}
                              >
                                  <TagsOutlined style={{marginLeft: 10, fontWeight: "bold", color: "#eeb075", fontSize: 14}}/>
                                  {
                                      selectedTags.map((tag, index) => {
                                          return (
                                            <span key={index} style={{
                                                color: "#eeb075",
                                                fontSize: 12,
                                                marginLeft: 5
                                            }}>{tag}</span>
                                          )
                                      })
                                  }
                              </Popover>
                          </Col>
                          <Col span={2}>
                              <SendOutlined style={{color: "black", fontSize: 14, marginLeft: 10}}
                                            onClick={() => handleVoiceCommand(queryText, activeId)}/>
                          </Col>
                      </Row>
                  </div>
              </div>
          </div>
          <div className={styles.chatlist_container}>
              <ChatListComponet ref={listRef} />
          </div>
      </>
    );
};

export default MobileFramework;
