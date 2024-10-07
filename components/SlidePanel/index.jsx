import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './SlidePanel.module.css';
import {CloseCircleOutlined, CloseOutlined} from "@ant-design/icons";
import QRCodeComponent from "../QRCode"; // For basic styling

const SlidingPanel = ({children, isOpen, onClose, activeId}) => {
    const panelRef = useRef(null);

    useEffect(() => {
        // Initial setup: hide the panel by positioning it below the viewport
        gsap.set(panelRef.current, { y: '100%' });
    }, []);

    useEffect(() => {
        // Slide up to show the panel
        if (isOpen) {
            gsap.to(panelRef.current, { y: '10%', duration: 0.5, ease: 'power3.inOut' });
        } else {
            // Slide down to hide the panel
            gsap.to(panelRef.current, { y: '100%', duration: 0.5, ease: 'power3.inOut' });
        }
    }, [isOpen]);

    return (
        <div className={styles.sliding_panel} ref={panelRef}>
            <CloseOutlined onClick={onClose} />
            <div style={{textAlign:"center", justifyContent: "center"}}>
                {children}
            </div>
        </div>
    );
};

export default SlidingPanel;
