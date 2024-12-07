import styles from './DetailPage.module.css';
import {
    AudioOutlined,
    ArrowLeftOutlined,
    PauseOutlined,
    SendOutlined,
    UnorderedListOutlined, PushpinOutlined
} from "@ant-design/icons";
import {Avatar, List} from "antd";
import {useSwipe} from "../UseSwipe";
import AIChat from "../AIChat";
import React, {useEffect, useState} from "react";
import {api_url, ChatMessage} from "@/common";
import commandDataContainer from "@/container/command";
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
    const [showMyTopics, setShowMyTopics] = useState(false)
    const [myTopics, setMytopics] = useState<string[][]>([])
    const [topicComments, setTopicComments] = useState<string[][]>([])
    const router = useRouter();
    const command = commandDataContainer.useContainer()

    useEffect(() => {
        setQueryText(query)
    }, [query])

    const getTopicCommnets = () => {

    }

    const switchMyTopics = () =>{
        if (showMyTopics){
            setShowMyTopics(false)
        }else{
            command.getJsonObject(api_url.portal.pato.topics + "/" + activeId).then((res) => {
                if (res !== null) {
                    setMytopics(res)
                }
            })
            setShowMyTopics(true)
        }
    }

    const submit_topic = () => {
        let topic = [queryText, new Date().toLocaleDateString()]
        command.postJsonObject(api_url.portal.pato.post_topic + "/" + activeId, topic).then((res) => {
            if (res !== null) {
                console.log(res)
            }
        })
    }
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
            <div style={{display: "flex", justifyContent: "space-between", marginBottom:5}}>
                <ArrowLeftOutlined onClick={toHome}  className={styles.header_icon}/>
                <UnorderedListOutlined onClick={switchMyTopics} className={styles.header_icon}/>
            </div>
            {
                !showMyTopics ?
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
                                        onClick={submit_topic}/>
                      </div>
                  </div>
                  :
                  <div className={styles.my_topics_section}>
                      <List
                        itemLayout="vertical"
                        size="small"
                        dataSource={myTopics}
                        renderItem={(item, index) => (
                          <List.Item key={index} onClick={getTopicCommnets}>
                              <div style={{display: "flex", justifyContent: "space-between"}}>
                                  <div>
                                      <PushpinOutlined/><span className={styles.topic_item}>{item[0]}</span>
                                  </div>
                                  <div>
                                      <span className={styles.topic_item}>{item[1]}</span>
                                  </div>
                              </div>
                          </List.Item>
                        )}
                      />
                  </div>
            }

            <div style={{height: 470, marginTop: 10, overflow: "scroll"}}>
                <List
                  itemLayout="vertical"
                  size="small"
                  dataSource={messages}
                  renderItem={(item, index) => (
                  <List.Item key={index} style={{color: "white"}}>
                      <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}/>}
                        title={<><a style={{color: "white"}}>{item.sender}</a></>}
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
