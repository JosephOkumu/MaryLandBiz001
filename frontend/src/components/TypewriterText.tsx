import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TypewriterText = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isDeleting && index < text.length) {
                setDisplayText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            } else if (isDeleting && index > 0) {
                setDisplayText((prev) => prev.slice(0, -1));
                setIndex((prev) => prev - 1);
            } else if (!isDeleting && index === text.length) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && index === 0) {
                setIsDeleting(false);
            }
        }, isDeleting ? 50 : 150);

        return () => clearTimeout(timeout);
    }, [index, isDeleting, text]);

    return (
        <span className="text-[10px] md:text-xs font-bold tracking-wide uppercase text-primary">
            {displayText}
            <span className="animate-pulse ml-0.5">|</span>
        </span>
    );
};

export default TypewriterText;
