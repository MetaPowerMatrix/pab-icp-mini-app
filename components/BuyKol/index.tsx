import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Modal, Row} from "antd";
import {useTranslations} from "next-intl";
import {api_url, getApiServer, recipientAddress, tokenAbi, tokenContractAddress} from "@/common";
import commandDataContainer from "@/container/command";
import Web3 from "web3";

interface SubscriptionsPros {
	id: string,
	room_id: string,
	onClose: (token: string)=>void;
	buyWhat: string;
}
declare global {
	interface Window {
		ethereum: any;
	}
}

const BuyKolComponent: React.FC<SubscriptionsPros>  = ({id, onClose, buyWhat, room_id}) => {
	const t = useTranslations('others');
	const [amount, setAmount] = useState<number>(0.0)
	const [tips, setTips] = useState<string>('')
	const command = commandDataContainer.useContainer()

	useEffect(()=>{
		if (buyWhat === 'kol'){
			// setAmount(10000.0)
			setAmount(10.0) //测试数值
			setTips(t('shouldKol'))
		}
		if (buyWhat === 'follow'){
			setAmount(10.0) // 测试数值
			// setAmount(1000.0)
			setTips(t('buyTicket'))
		}
	})

	const transferToken = async (id: string, amount: number, web3: Web3) => {
		// const web3 = new Web3(window.ethereum)
		const accounts = await web3.eth.getAccounts();
		const myAddress = accounts[0];

		// The number of token decimals
		const decimals = 6; // This varies between tokens, ensure to set the correct value

		const tokenContract = new web3.eth.Contract(tokenAbi, tokenContractAddress, {from: myAddress});
		// const amountInWei = web3.utils.toWei(amount, 'ether');
		const value = amount * (10 ** decimals); // Adjust amount by token's decimals
		console.log("send token:", value)
		tokenContract.methods.transfer(recipientAddress, value).send({from: myAddress})
			.on('transactionHash', function(hash){
				console.log(`Transaction hash: ${hash}`);
			})
			.on('receipt', function(receipt){
				console.log('Transaction was confirmed.', buyWhat);
				if (buyWhat === 'kol') {
					Modal.success({
						content: t('buyKol_ok')
					})
					command.become_kol(id, myAddress).then((res) => {
						command.queryPatoKolToken(id).then((res)=>{
							onClose(res?.token ?? "")
						})
					})
				}
				if (buyWhat === 'follow') {
					Modal.success({
						content: t('buyFollow_ok')
					})
					command.join_kol(id, room_id).then((res) => {
						console.log(res)
					})
				}
			})
			.on('error', console.error); // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
	};

	async function connectToBsc() {
		const web3 = new Web3(window.ethereum)
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x38' }], // 0x38 is the hexadecimal representation of 56
			});
		} catch (error: any) {
			if (error.code === 4902) {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x38',
							chainName: 'Binance Smart Chain Mainnet',
							nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
							rpcUrls: ['https://bsc-dataseed.binance.org/'],
							blockExplorerUrls: ['https://bscscan.com/'],
						},
					],
				});
			}
		}

		const accounts = await web3.eth.getAccounts();
		for(var account of accounts)  {
			const balance = await web3.eth.getBalance(account);
			console.log(account, ":", balance);
		}

		return web3
	}
	const deposit = (id: string, amount: number, is_donation:boolean) => {
		connectToBsc().then((web3) => {
			transferToken(id, amount, web3).then((res) => {
				console.log(res)
			})
		})
	}
	const handleSubmit = () => {
		if (amount === 0.0){
			Modal.warning({
				content: t("requireAmount")
			})
		}else{
			deposit(id, amount, false)
		}
	};

		return(
			<>
				<div style={{textAlign: "center"}}>
					<h4>{tips}</h4>
					<Row>
						<Col span={20} style={{textAlign:"center", marginTop: 30}}>
							<Button htmlType="submit" onClick={()=>handleSubmit()}>
								<img alt={"pab"} className={"pab_logo"} src={"/images/pab.jpg"}/>{t("buyKol")}
							</Button>
						</Col>
						{/*<Col span={12} style={{textAlign:"center"}}>*/}
						{/*	<img className={"credit_card_logo"} alt={"credit card"} src={"/images/creditcard.png"} onClick={()=>{form.submit()}}/>*/}
						{/*</Col>*/}
					</Row>
				</div>
				<Divider type={"horizontal"}/>
				<Row>
					<Col span={12} style={{textAlign: "center"}}>
						<a target={"_blank"}
						   href={"https://pancakeswap.finance/swap?outputCurrency=0xD6311f9A6bd3a802263F4cd92e2729bC2C31Ed23&inputCurrency=0x55d398326f99059fF775485246999027B3197955"}>PAB购买地址</a>
					</Col>
					{/*<Col span={8} style={{textAlign: "center"}}>*/}
					{/*	<Popover*/}
					{/*		content={<Image width={246} height={336} onClick={() => alert(t('scan'))} src={"/images/wepay.png"}*/}
					{/*		                alt={"scan"}/>} title={t('scan')}>*/}
					{/*		<Button type="primary">{t('scan_btn')}</Button>*/}
					{/*	</Popover>*/}

					{/*</Col>*/}
					<Col span={12} style={{textAlign: "center"}}>
						<a target={"_blank"}
						   href={"https://bscscan.com/address/0xd6311f9a6bd3a802263f4cd92e2729bc2c31ed23"}>PAB合约地址</a>
					</Col>
				</Row>
			</>
		)
};

export default BuyKolComponent;
