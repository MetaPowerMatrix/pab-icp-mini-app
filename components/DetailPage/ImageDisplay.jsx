import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './DetailPage.module.css';
import {useGSAP} from "@gsap/react"; // Add custom styles for positioning

const ImageDisplay = () => {
    const mainImageRef = useRef(null);
    const thumbnailRefs = useRef([]);

    useGSAP(() => {
        // GSAP animation for image entry
        gsap.from(mainImageRef.current, { opacity: 0, duration: 1, y: 20 });
        gsap.from(thumbnailRefs.current, { opacity: 0, stagger: 0.2, duration: 0.8, y: 10 });
    }, []);

    return (
        <div className={styles.image_display}>
            <img ref={mainImageRef} className={styles.main_image} src="https://via.placeholder.com/300" alt="Main Artwork" />
            <div className={styles.thumbnails}>
                {["thumb1", "thumb2", "thumb3","thumb1", "thumb2"].map((img, index) => (
                    <img
                        key={index}
                        ref={el => (thumbnailRefs.current[index] = el)}
                        className={styles.thumbnail}
                        src={`https://via.placeholder.com/100?text=${img}`}
                        alt="Thumbnail"
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageDisplay;
