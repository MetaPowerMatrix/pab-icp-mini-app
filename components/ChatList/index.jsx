import React, {
    forwardRef, useCallback, useImperativeHandle,
    useRef,
    useState
} from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import AiReplyComponent from "../AiReply";
import styles from './ChatList.module.css';

gsap.registerPlugin(Flip);

const ChatListComponent = forwardRef((props, ref) => {
    const el = useRef();
    const q = gsap.utils.selector(el);
    const [layout, setLayout] = useState(() => ({
        items: []
    }));

    const removeItems = useCallback(
        () => {
            setLayout((prev) => ({
                state: Flip.getState(q(".box")),
                items: prev.items
            }));
        },
        [q]
    );

    // useEffect(() => {
    //     let ctx = gsap.context(() => {
    //         gsap.from(".answer", {
    //             opacity: 0,
    //             stagger: 0.2,
    //             x: 200,
    //             duration: 1,
    //             delay: 1
    //         });
    //         // gsap.from(".question", {
    //         //     opacity: 0,
    //         //     stagger: 0.2,
    //         //     x: -200,
    //         //     duration: 1,
    //         //     delay: 1
    //         // });
    //     });
    //     return () => ctx.revert();
    // }, [aiReplies]);

    useGSAP(
        () => {
            if (!layout.state) return;

            // Flip.from returns a timeline
            const timeline = Flip.from(layout.state, {
                absolute: false,
                ease: "power1.inOut",
                targets: q(".box"),
                scale: true,
                simple: true,
                onEnter: (elements) => {
                    return gsap.fromTo(
                        elements,
                        {
                            opacity: 0,
                            scale: 0
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            delay: 0.2,
                            duration: 0.3
                        }
                    );
                },
            });

            // remove the exiting items from the DOM after the animation is done
            timeline.add(() => removeItems());
        },
        {
            dependencies: [layout, q]
        }
    );

    useImperativeHandle(ref, () => ({
        addItem(item){
            if (item !== undefined){
                setLayout({
                    state: Flip.getState(q(".box")),
                    items: [...layout.items, item]
                });
            }
        }
    }));

    return (
        <div ref={el} className="boxes">
            <div style={{height: 468, overflow: "scroll"}}>
                {layout.items.map((item, index) => (
                    <div
                        id={`box-${index}`}
                        key={index}
                        className={`box`}
                        style={{margin: 10}}
                    >
                        <AiReplyComponent message={item.message} imageUrl={item.imageUrl} category={item.category}/>
                    </div>
                ))}
            </div>
        </div>
    );

    ChatListComponent.displayName = "ChatListComponent";
})

export default ChatListComponent;
