// BlinkingText.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const ChangingColorText = ({ text, fontSize=16 }) => {
    const textRef = useRef([]);

    useEffect(() => {
        // Animate each character to change color
        textRef.current.forEach((char, i) => {
            gsap.to(char, {
                color: getRandomColor(), // Change to a random color
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 2, // Delay each character animation
                onRepeat: () => {
                    // Change color to a new random color on each repeat
                    gsap.set(char, { color: getRandomColor() });
                },
            });
        });
    }, []);

    return (
        <div>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    ref={(el) => (textRef.current[index] = el)}
                    style={{ display: 'inline-block', fontSize: fontSize }}
                >
          {char}
        </span>
            ))}
        </div>
    );
};

export default ChangingColorText;
