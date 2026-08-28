import { useEffect, useState } from "react";

function TestPage() {
    const [time, setTime] = useState(new Date().toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"}));

    useEffect(() => {

        const timerId = setInterval(() => {
            setTime(new Date().toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"}));
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <>
            {time}
        </>
    )
}
export default TestPage;