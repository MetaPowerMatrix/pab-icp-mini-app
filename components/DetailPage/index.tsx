import styles from './DetailPage.module.css';
import {AudioOutlined, ArrowLeftOutlined, PauseOutlined, SendOutlined} from "@ant-design/icons";
import {Avatar, List} from "antd";
import {useSwipe} from "../UseSwipe";
import AIChat from "../AIChat";
import React, {useEffect, useState} from "react";
import {ChatMessage} from "@/common";
import { useRouter } from 'next/router';

interface DetailPageProps {
    activeId: string;
    name: string
    query: string;
    ctrlVoiceStart: (startStop: boolean)=>void;
}

const DetailPage: React.FC<DetailPageProps>  = ({activeId, name, query, ctrlVoiceStart}) => {
    const [stopped, setStopped] = useState<boolean>(true);
    const [queryText, setQueryText] = useState<string>(query)
    const [sendQuery, setSendQuery] = useState<string>('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const router = useRouter();

    useEffect(() => {
        setQueryText(query)
    }, [query])

    const stop_record = () => {
        if (stopped) {
            setStopped(false)
            ctrlVoiceStart(true)
        } else {
            setStopped(true)
            ctrlVoiceStart(false)
        }
    }
    const inputQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQueryText(event.target.value)
    }
    const process_chat_message = (event: any) => {
        if (event.data.toString() !== 'pong' && event.data.toString() !== '数据格式错误') {
            console.log(event.data.toString())
            let resp: [] = JSON.parse(event.data.toString())
            let msgs: ChatMessage[] = []
            resp.forEach((message: any) => {
                if (message['role'] === "assistant" && message['content'] !== null) {
                    let msg: ChatMessage = {
                        sender: message['sender'],
                        content: message['content'],
                        type: 'text'
                    }
                    msgs.push(msg)
                }
            })
            setMessages([...messages, ...msgs])
        }
    }

    useSwipe({
        onSwipeUp: () => {
            console.log("Swiped Up!");
            // Add your up swipe handling logic here
        },
        onSwipeDown: () => {
            console.log("Swiped Down!");
            // Add your down swipe handling logic here
        },
    });

    const toHome = () => {
        router.push('/home');
    };

    return (
        <div className={styles.content}>
            <ArrowLeftOutlined onClick={toHome}  style={{margin:10, fontSize: 16}}/>
            <div className={styles.input_section}>
                <textarea value={queryText} placeholder="那么，说说你的想法..." rows={3}
                          className={styles.prompt_input}
                          onChange={inputQuestion}
                />
                <div className={styles.action_bar}>
                    {stopped ?
                      <AudioOutlined style={{fontSize: 18}} onClick={() => stop_record()}/>
                      :
                      <PauseOutlined style={{fontSize: 18}}
                                     onClick={() => stop_record()}/>
                    }
                    <SendOutlined style={{fontSize: 18, marginLeft: 10}}
                                  onClick={() => setSendQuery(queryText)}/>
                </div>
            </div>

            <div style={{height: 470, marginTop: 10, overflow: "scroll"}}>
                <List
                  itemLayout="vertical"
                  size="small"
                  dataSource={messages}
                  renderItem={(item, index) => (
                    <List.Item key={index} style={{color: "white"}}>
                        <List.Item.Meta
                          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}/>}
                          title={<><a style={{color: "white"}}>{item.sender}</a><span
                            style={{color: "white"}}>(Assistant)</span></>}
                        />
                        {item.content}
                    </List.Item>
                  )}
                />
            </div>
          <AIChat uri={"/topic"} activeId={activeId} process_ws_message={process_chat_message}
                  question={sendQuery}/>
        </div>
)
}

export default DetailPage
