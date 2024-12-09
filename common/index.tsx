export const tokenAbi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"uint256","name":"totalSupply","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
export const tokenContractAddress = "0xD6311f9A6bd3a802263F4cd92e2729bC2C31Ed23"
export const recipientAddress = '0x40B92673B50d4cA94AAF38007fCf12B7D24abe48'
export const ticketRecipientAddress = '0x5C98D79e6Ce7299a2Ea84B2898eAF064038AA1f3'
export const metamaskDeepLink = 'https://metamask.app.link/send/pay-0xD6311f9A6bd3a802263F4cd92e2729bC2C31Ed23@56/transfer?address=0x40B92673B50d4cA94AAF38007fCf12B7D24abe48&uint256=2e7'
export const host = "icp.metapowermatrix.ai"
export const Web_Server = "https://"+ host
export const Streaming_Server = "wss://wschat.metapowermatrix.ai"
export const llm_Server = "wss://wschat.metapowermatrix.ai"
export const getApiServer = (port: number) => {
  // return Web_Server + ':' + port
  return Web_Server
}
export const getMQTTBroker = () => {
  return "wss://wschat.metapowermatrix.ai/mqtt"
}

export interface ChatMessage {
  sender: string,
  content: string
  type: string
}
export interface KolToken{
  id: string,
  name:string,
  token:string
}
export interface HotPro{
  id: string,
  name: string,
  subjects: string[]
}
export interface TopicInfo{
  id: string,
  title: string,
  tags: string[],
  cover: string,
  author: string
}
export interface PortalHotAi{
  id: string,
  name: string,
  talks: number,
  pros: string,
}
export interface KolInfo{
  id: string,
  name: string,
  followers: string[],
  avatar: string,
}
export interface PatoInfo {
  id: string,
  name: string,
  sn: number,
  registered_datetime: string,
  balance: number,
  tags: string[],
  avatar: string,
  cover: string,
  followers: []
  followings: []
}
export enum MessageCategory {
  Human = "human",
  Card = "card",
  Chat = "chat",
  Image = "image",
  Video = "video",
  Audio = "audio",
  File = "file"
}
export const api_url = {
  'portal': {
    'login': '/api/login',
    'register': '/api/register',
    'pato': {
      'info': '/api/pato/info',
      'topics': '/api/pato/topics',
      'post_topic': '/api/pato/submit/topic',
      'topic_comments': '/api/topic/chat/history',
      'topic_comment_embedding': '/api/topic/embedding'
    },
    'names': '/api/pato/names',
    'tags': '/api/pato/tags',
    'hots': '/api/pato/hots',
    'submitTags': '/api/pato/submit/tags',
    'retrieve': '/api/pato/retrieve',
    'image': {
      'upload': '/api/pato/upload/image',
    },
    'knowledge':{
      'upload': '/api/upload/knowledge',
      'summary': '/api/knowledge/summary',
      'query': '/api/knowledge/query'
    },
    'message':{
      'history': '/api/pato/messages',
      'archive': '/api/pato/archive',
      "hot_topics": '/api/kol/hot/topics',
      "topic_his": '/api/topic/chat/history'
    },
    'auth':{
      'refresh': '/api/pato/auth/refresh',
      'kol': '/api/pato/kol/auth/query',
      'info': '/api/pato/kol/info'
    },
    'town':{
      "kol_list":"/api/kol/kol/list",
      "becom_kol": "/api/kol/become/kol",
      "join_kol": "/api/kol/follow/kol",
    },
  },
  'account': {
    'wallet':{
      'deposit': '/api/deposit',
      'stake': '/api/stake',
      'subscription': '/api/sub',
      'pay': '/api/pay'
    },
  },
  'stats': {
    'active': '/api/stats/user/active',
  },
}
