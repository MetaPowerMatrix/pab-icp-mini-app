import ImageDisplay from "./ImageDisplay";
import Prompt from "./Prompt";
import Actions from "./Actions";
import styles from './DetailPage.module.css';
import {HomeOutlined} from "@ant-design/icons";
import {Col, Row} from "antd";
import {useSwipe} from "../UseSwipe";
import Link from "next/link";

const DetailPage = () => {
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

    return (
        <div className={styles.content}>
            <Row style={{marginBottom: 20, padding: 5}} align={"middle"}>
                <Col span={2}><Link replace={true} scroll={true} href="/"><HomeOutlined/></Link></Col>
                <Col span={22} style={{textAlign: "center"}}><h3>Product Name</h3></Col>
            </Row>
            <ImageDisplay />
            <Prompt />
            <Actions />
        </div>
    )
}

export default DetailPage
