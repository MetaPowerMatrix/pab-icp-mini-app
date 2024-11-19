import React, {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import styles from './MobileFramework.module.css';
import {
    AudioOutlined, DiscordOutlined, FileImageOutlined,
    PauseOutlined, PlusOutlined, SaveOutlined, SearchOutlined,
    SendOutlined,
    TagsOutlined, TeamOutlined, UploadOutlined
} from "@ant-design/icons";
import {Button, Col, GetProp, Modal, Popover, Row, Tag, Upload, UploadFile, UploadProps} from "antd";
import commandDataContainer from "../../container/command";
import {api_url, ChatMessage, getApiServer, MessageCategory, PortalHotAi} from "@/common";
import TagsComponent from "@/components/tags";
import ChatListComponet from "@/components/ChatList";
import AIChat from "@/components/AIChat";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const PatosComponent = ({ patos, myTags, myIds, height=80 }
      :{patos: PortalHotAi[], myTags: (tags: string[])=>void, myIds: (tags: string[])=>void, height?: number}) =>{
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleTagChange = (tag: string, id: string, checked: boolean) => {
        const nextSelectedTags = checked
          ? [...selectedTags, tag]
          : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
        myTags(nextSelectedTags);

        const nextSelectedIds = checked
          ? [...selectedIds, id]
          : selectedIds.filter((t) => t !== id);
        setSelectedIds(nextSelectedIds);

        myIds(nextSelectedIds)
    };

    return (
      <>
          <div style={{ height: height, overflow: 'scroll', width: '100%' }}>
              {patos.map<React.ReactNode>((tag) => (
                <Tag.CheckableTag
                  key={tag.id}
                  checked={selectedTags.includes(tag.name)}
                  onChange={(checked) => handleTagChange(tag.name, tag.id, checked)}
                >
                    <h3 style={{ fontSize: 12, color: "#eeb075" }}>{tag.name}</h3>
                </Tag.CheckableTag>
              ))}
          </div>
      </>
    );
}

interface AIReply {
    sender: string,
    message: string,
    imageUrl: string,
    link: string,
    category: MessageCategory,
    status: string
}
const aiCharacterTags: string[] = ["情感", "历史", "游戏", "婚恋", "科技", "投资", "职业", "音乐", "助手"]

const MobileFramework = ({name, activeId, query, notify, ctrlVoiceStart}
       :{name: string, activeId: string, query: string, notify: string, ctrlVoiceStart: (startStop: boolean)=>void}) => {
    const headerRef = useRef(null);
    const listRef = useRef();
    const promptInputRef = useRef(null);
    const [stopped, setStopped] = useState<boolean>(true);
    const [queryText, setQueryText] = useState<string>(query)
    const [sendQuery, setSendQuery] = useState<any>('')
    const [openPop, setOpenPop] = useState<boolean>(false)
    const [openTeam, setOpenTeam] = useState<boolean>(false)
    const [patos, setPatos] = useState<PortalHotAi[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploaded, setUploaded] = useState<boolean>(false)
    const [imageUploaded, setImageUploaded] = useState<boolean>(false)
    const [selectedPatos, setSelectedPatos] = useState<string[]>([]);
    const [session, setSession] = useState<string>(uuidv4())
    const [aiReplies, setAiReplies] = useState<AIReply[]>([]);
    const [atIds, setAtIds] = useState<string[]>([])
    const [reply, setReply] = useState<AIReply>();
    const command = commandDataContainer.useContainer()

    useEffect(() => {
        command.getTownHots().then((res) => {
            if (res !== null) {
                setPatos(res)
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

    useEffect(() => {
        // @ts-ignore
        listRef.current?.addItem(reply)
    },[reply])

    useEffect(() => {
        if (notify.length > 0){
            let reply: AIReply = {
                sender: '',
                message: notify,
                imageUrl: '',
                link: '',
                category: MessageCategory.Chat,
                status: "enter"
            }
            console.log(reply)
            setAiReplies((aiReplies) => [...aiReplies, reply])
            setReply(reply)
        }
    },[notify])

    const stop_record = () => {
        if (stopped){
            setStopped(false)
            ctrlVoiceStart(true)
        }else{
            setStopped(true)
            ctrlVoiceStart(false)
        }
    }
    const inputQuestion = (event: React.ChangeEvent<HTMLTextAreaElement>) =>{
        setQueryText(event.target.value)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpenPop(newOpen);
    };

    const handleOpenTeamChange = (newOpen: boolean) => {
        setOpenTeam(newOpen);
    };
    const handleKnowledge= (uri: string) => {
        const formData = new FormData();
        if (fileList.length > 0){
            formData.append('file', fileList[0] as FileType);
        }
        formData.append('message', activeId);

        let url = getApiServer(80) + uri
        fetch(url, {
            method: 'POST',
            body: formData,
        })
          .then(response => response.json())
          .then(data => {
              let reply: AIReply = {
                  sender: '秘书',
                  message: data.content,
                  imageUrl: '',
                  link: '',
                  category: MessageCategory.Human,
                  status: "enter"
              }
              console.log(reply)
              setAiReplies((aiReplies) => [...aiReplies, reply])
              setReply(reply)

              setFileList([])
              setUploaded(false)
              setImageUploaded(false)
          })
          .catch((error) => {
              console.error('Error:', error);
          });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);

            setQueryText(file.name)
            return false;
        },
        fileList,
    };
    const saveMessageToIcp = () => {
        command.archive_session(activeId, session, JSON.stringify(aiReplies)).then(()=>{
            Modal.success({
                content: '对话已保存'
            })
        })
    }
    const playGame = () => {
        let question = {
            input: '猜猜我心里想了一个什么数',
            customer_info: 'luca， 男， 技术宅',
            atIds: [],
            autoReply: true,
            playGame: true
        }
        setSendQuery(question)
    }
    const sendMessageToAI = () => {
        if (fileList.length > 0){
            if (imageUploaded){
                handleKnowledge(api_url.portal.image.upload)
            }else if (uploaded){
                handleKnowledge(api_url.portal.knowledge.upload)
            }
        }else{
            let question = {
                input: queryText,
                customer_info: 'luca， 男， 技术宅',
                atIds: atIds,
                autoReply: true,
                playGame: false
            }
            setSendQuery(question)
        }
    }
    const sendQueryKnowledgeMessage = () => {
        command.query_knowledges(queryText).then((res) => {
            let reply: AIReply = {
                sender: '秘书',
                message: res,
                imageUrl: '',
                link: '',
                category: MessageCategory.Human,
                status: "enter"
            }
            setAiReplies((aiReplies) => [...aiReplies, reply])
            setReply(reply)
        })
    }
    const process_chat_message = (event: any) => {
        if (event.data.toString() !== 'pong' && event.data.toString() !== '数据格式错误'){
            // console.log(event.data.toString())
            let resp: [] = JSON.parse(event.data.toString())
            resp.forEach((message: any) => {
                if (message['role'] === "user"){
                    let reply: AIReply = {
                        sender: '我',
                        message: message['content'],
                        imageUrl: '',
                        link: '',
                        category: MessageCategory.Human,
                        status: "enter"
                    }
                    setAiReplies((aiReplies) => [...aiReplies, reply])
                    // @ts-ignore
                    listRef.current?.addItem(reply)
                }
                if (message['role'] === "assistant" && message['content'] !== null){
                    let reply: AIReply = {
                        sender: message['sender'],
                        message: message['content'],
                        imageUrl: '',
                        link: '',
                        category: MessageCategory.Card,
                        status: "enter"
                    }
                    setAiReplies((aiReplies) => [...aiReplies, reply])
                    // @ts-ignore
                    listRef.current?.addItem(reply)
                }
            })
        }
    }

    return (
      <>
          <div className={styles.content}>
              <header className={styles.app_header} ref={headerRef}/>

              <div className={styles.input_section}>
                    <textarea value={queryText} placeholder="emm，我们聊些什么呢..." rows={4} ref={promptInputRef}
                              className={styles.prompt_input}
                              onChange={inputQuestion}
                    />
                  <div className={styles.style_options}>
                      <Row align="middle">
                          <Col span={2}>
                              <SaveOutlined style={{color: "black", fontSize: 14}}
                                            onClick={saveMessageToIcp}/>
                          </Col>
                          <Col span={1}>
                              <Popover
                                placement={"bottomLeft"}
                                content={
                                    <div style={{width: 270}}>
                                        <PatosComponent patos={patos}
                                            myTags={(tags) => {
                                                setQueryText("@"+tags.join(" @"))
                                                setSelectedPatos(tags)
                                            }}
                                            myIds={(ids) => {
                                                setAtIds(ids)
                                            }}
                                        />
                                    </div>
                                }
                                trigger="click"
                                open={openTeam}
                                onOpenChange={handleOpenTeamChange}
                              >
                                  <TeamOutlined style={{color: "black", fontSize: 14}}/>
                              </Popover>
                          </Col>
                          <Col span={9}>
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
                              <DiscordOutlined style={{color: "black", fontSize: 14}}
                                            onClick={playGame}/>
                          </Col>
                          <Col span={2}>
                              <SearchOutlined style={{color: "black", fontSize: 14}}
                                            onClick={sendQueryKnowledgeMessage}/>
                          </Col>
                          <Col span={2}>
                              {stopped ?
                                <AudioOutlined style={{color: "black", fontSize: 14}} onClick={() => stop_record()}/>
                                :
                                <PauseOutlined style={{color: "black", fontSize: 14}}
                                               onClick={() => stop_record()}/>
                              }
                          </Col>
                          <Col span={2}>
                              <FileImageOutlined onClick={(e)=>{
                                  setImageUploaded(true); document.getElementById('upload-image')?.click();
                              }}/>
                              <Upload id="upload-image" maxCount={1} showUploadList={false} {...props}>
                                  <Button style={{display: "none"}}></Button>
                              </Upload>
                          </Col>
                          <Col span={2}>
                              <PlusOutlined onClick={(e)=>{
                                  setUploaded(true); document.getElementById('upload-input')?.click();
                              }}/>
                              <Upload id="upload-input" maxCount={1} showUploadList={false} {...props}>
                                  <Button style={{display: "none"}}></Button>
                              </Upload>
                          </Col>
                          <Col span={1}>
                              <SendOutlined style={{color: "black", fontSize: 14, marginLeft: 10}}
                                            onClick={sendMessageToAI}/>
                          </Col>
                      </Row>
                  </div>
              </div>
          </div>
          <div className={styles.chatlist_container}>
              <ChatListComponet ref={listRef} />
          </div>
          <AIChat uri={"/sales"} activeId={activeId} process_ws_message={process_chat_message} question={sendQuery}/>
      </>
    );
};

export default MobileFramework;
