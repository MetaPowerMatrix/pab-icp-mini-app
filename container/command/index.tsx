import { createContainer } from 'unstated-next'
import {
  api_url,
  ChatMessage,
  getApiServer,
  HotPro, KolInfo,
  KolToken,
  PatoInfo,
  PortalHotAi,
} from '@/common'

const useCommand = () => {
  const create_pato = async (name: string): Promise<string> => {
    let id = ""
    let data = {name: name, gender: 0, personality: ''}
    let url = getApiServer(80) + api_url.portal.register
    console.log("register url: ",url)
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      // console.log(dataJson)
      if (dataJson.code === '200'){
        id = dataJson.content
      }
      // let data = JSON.parse(dataJson.content)
    }
    return id
  }
  const submit_pato_tags = async (tags: string[], id: string): Promise<string> => {
    let url = getApiServer(80) + api_url.portal.submitTags + "/" + id
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(tags)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      if (dataJson.code === '200'){
        return dataJson.content
      }
    }
    return '/images/chunxiao.jpg'
  }
  const getPredefinedTags = async () => {
    let url = getApiServer(80) + api_url.portal.tags
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let tags: string[] = JSON.parse(dataJson.content)
        return tags
      }
    }catch (e) {
      console.log(e)
    }
    return []
  }
  const getTopicHots = async () => {
    let url = getApiServer(80) + api_url.portal.message.hot_topics
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let topics: string[] = JSON.parse(dataJson.content)
        return topics
      }
    }catch (e) {
      console.log(e)
    }
    return []
  }
  const getPatoInfo = async (id: string) => {
    if (id === "") return null
    let url = getApiServer(80) + api_url.portal.pato + "/" + id
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let patoinfo: PatoInfo = JSON.parse(dataJson.content)
        return patoinfo
      }
    }catch (e) {
      console.log(e)
    }
    return null
  }
  const login = (id: string) => {
    let url = getApiServer(80) + api_url.portal.login + "/" + id
    fetch(`${url}`,).then(async (response)=> {
      if (response.ok) {
        let dataJson = await response.json()
        console.log(dataJson)
      }
    }).catch((e) => console.log(e))
  }
  const get_topic_chat_his = async (id: string, topic: string, town: string) => {
    let data = {id: id, topic: topic, town: town}
    let url = getApiServer(80) + api_url.portal.message.topic_his
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      let data: string[] = JSON.parse(dataJson.content)
      return data
    }
    return []
  }
  const get_pato_names = async (ids: string[]) => {
    let url = getApiServer(80) + api_url.portal.names
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(ids)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      if (dataJson.content !== ''){
        let data: HotPro[] = JSON.parse(dataJson.content)
        return data
      }
    }
    return []
  }
  const archive_session = async (id: string, session: string, date: string) => {
    let data = {id: id, session: session, date: date}
    let url = getApiServer(80) + api_url.portal.message.archive
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      if (dataJson.code === '200'){
        return true
      }
      // let data = JSON.parse(dataJson.content)
    }
    return false
  }
  const deposit_metapower = async (id: string, amount: number, is_donation: boolean) => {
    let data = {id: id, amount: amount, is_donation: is_donation}
    let url = getApiServer(80) + api_url.account.wallet.deposit
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      console.log(dataJson)
      // let data = JSON.parse(dataJson.content)
    }
  }
  const stake_metapower = async (id: string, amount: number, is_donation: boolean) => {
    let data = {id: id, amount: amount, is_donation: is_donation}
    let url = getApiServer(80) + api_url.account.wallet.stake
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      console.log(dataJson)
      // let data = JSON.parse(dataJson.content)
    }
  }
  const getPatoHistoryMessages = async (id: string, date: string) => {
    if (id === "" || date === "") return null
    let url = getApiServer(80) + api_url.portal.message.history + "/" + id + "/" + date
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let patoMessages: ChatMessage[] = JSON.parse(dataJson.content)
        return patoMessages
      }
    } catch (e) {
      console.log(e)
    }
    return []
  }
  const log_user_activity = async (id: string, page: string, action: string) => {
    let data = {id: id, page: page, action: action}
    let url = getApiServer(80) + api_url.stats.active
    let response = await fetch(
      `${url}`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      let dataJson = await response.json()
      console.log(dataJson)
    }
  }
  const getTownHots = async () => {
    let url = getApiServer(80) + api_url.portal.hots
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let hots: PortalHotAi[] = JSON.parse(dataJson.content)
        return hots
      }
    } catch (e) {
      console.log(e)
    }
    return []
  }
  const getKolList = async () => {
    let url = getApiServer(80) + api_url.portal.town.kol_list
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let hots: KolInfo[] = JSON.parse(dataJson.content)
        return hots
      }
    } catch (e) {
      console.log(e)
    }
    return []
  }
  const refreshPatoAuthToken = async (id: string) => {
    if (id === "") return null
    let url = getApiServer(80) + api_url.portal.auth.refresh + "/" + id
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let token = dataJson.content
        return token
      }
    } catch (e) {
      console.log(e)
    }
    return null
  }
  const query_summary = async (id: string, sig: string) => {
    if (id === "") return null
    let url = getApiServer(80) + api_url.portal.knowledge.summary + "/" + id + "/" + sig
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let summary = dataJson.content
        return summary
      }
    } catch (e) {
      console.log(e)
    }
    return null
  }
  const query_knowledges = async (id: string) => {
    if (id === "") return null
    let url = getApiServer(80) + api_url.portal.knowledge.query + "/" + id
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let knowLedges: string = dataJson.content
        return knowLedges
      }
    } catch (e) {
      console.log(e)
    }
    return null
  }
  const become_kol = async (id: string, from: string) => {
    let url = getApiServer(80) + api_url.portal.town.becom_kol + "/" + id + "/" + from
    try {
      let response = await fetch(`${url}`,)
    } catch (e) {
      console.log(e)
    }
  }
  const join_kol = async (follower:string, id: string, from: string) => {
    let url = getApiServer(80) + api_url.portal.town.join_kol + "/" + follower + "/" + id + "/" + from
    try {
      let response = await fetch(`${url}`,)
    } catch (e) {
      console.log(e)
    }
  }
  const retrieve_pato_by_bame = async (name: string) => {
    if (name === "") return []
    let url = getApiServer(80) + api_url.portal.retrieve + "/" + name
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        let patos: HotPro[] = JSON.parse(dataJson.content)
        return patos
      }
    } catch (e) {
      console.log(e)
    }
    return []
  }
  const queryPatoKolToken = async (id: string | null) => {
    if (id === null) return undefined
    let url = getApiServer(80) + api_url.portal.auth.kol + "/" + id
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        if (dataJson.code === '200'){
          let kolToken: KolToken = JSON.parse(dataJson.content)
          return kolToken
        }
      }
    } catch (e) {
      console.log(e)
    }
    return undefined
  }
  const queryPatoByKolToken = async (token: string | null) => {
    if (token === null) return []
    let url = getApiServer(80) + api_url.portal.auth.info + "/" + token
    try {
      let response = await fetch(`${url}`,)
      if (response.ok) {
        let dataJson = await response.json()
        return dataJson.content.split(',')
      }
    } catch (e) {
      console.log(e)
    }
    return []
  }
  return { login, create_pato, getPatoInfo, getPatoHistoryMessages, deposit_metapower, archive_session, stake_metapower,
    refreshPatoAuthToken, queryPatoByKolToken, queryPatoKolToken, query_summary, query_knowledges, getKolList,
    getTopicHots, get_topic_chat_his, log_user_activity, retrieve_pato_by_bame, become_kol, join_kol, get_pato_names,
    getPredefinedTags, submit_pato_tags, getTownHots
  }
}

let CommandDataContainer = createContainer(useCommand)
export default CommandDataContainer
