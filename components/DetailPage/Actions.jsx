import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './DetailPage.module.css'
import {useGSAP} from "@gsap/react";
import {Col, Row} from "antd";

const Actions = () => {
    const buttonsRef = useRef([]);

    useGSAP(() => {
        buttonsRef.current.forEach((btn, index) => {
            gsap.from(btn, { opacity: 0, delay: index * 0.2, duration: 0.5 });
        });
    }, []);

    return (
        <div className={styles.actions}>
            <Row>
                {['购买', '售卖'].map((action, index) => (
                    <Col key={index} span={12} style={{textAlign: "center"}}>
                        <button
                            ref={el => (buttonsRef.current[index] = el)}
                            className={styles.action_button}
                        >
                            {action}
                        </button>
                    </Col>
                ))}
            </Row>
            <Row>
                {['知识', '更多图', '识别'].map((action, index) => (
                    <Col key={index} span={8} style={{textAlign: "center"}}>
                        <button
                            ref={el => (buttonsRef.current[index] = el)}
                            className={styles.action_button}
                        >
                            {action}
                        </button>
                    </Col>
                ))}
            </Row>
            {['直播'].map((action, index) => (
                <button
                    key={index}
                    ref={el => (buttonsRef.current[index] = el)}
                    className={styles.finalize_btn}
                >
                    {action}
                </button>
            ))}
        </div>
    );
};

export default Actions;
