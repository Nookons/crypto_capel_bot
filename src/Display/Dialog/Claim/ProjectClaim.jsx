import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import { IOSSlider } from "../../../Assets/Sliders";
import { Button } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import removeClaim from "../../../utils/Claim/RemoveClaim";

dayjs.extend(duration);

const ProjectClaim = ({ currentItem, user }) => {
    const [userDb, setUserDb] = useState(null);
    const [claimObj, setClaimObj] = useState({
        endClaim: '',
        id: 0,
        isHave: false,
        project: '',
        startClaim: '',
        updateTime: '',
        remainTime: 0,
        totalTime: 0,
    });
    const [isNeedClaim, setIsNeedClaim] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "users", "user_" + user.id), (doc) => {
            setUserDb(doc.data());
        });
        return () => unsub();
    }, [user.id]);

    useEffect(() => {
        if (userDb && userDb.claim) {
            userDb.claim.forEach(el => {
                if (el?.id === currentItem?.id) {
                    const endClaim = dayjs(el.endClaim);
                    const startClaim = dayjs(el.startClaim);
                    const totalTime = endClaim.diff(startClaim, 'second'); // Total time in seconds
                    const remainTime = endClaim.diff(dayjs(), 'second'); // Remaining time in seconds

                    setClaimObj({
                        endClaim: endClaim.format('YYYY-MM-DD HH:mm:ss'),
                        id: el.id,
                        isHave: true,
                        project: el.project,
                        startClaim: startClaim.format('YYYY-MM-DD HH:mm:ss'),
                        updateTime: dayjs(el.updateTime).format('YYYY-MM-DD HH:mm:ss'),
                        remainTime: !isNaN(remainTime) ? Math.max(remainTime, 0) : 0,
                        totalTime: !isNaN(totalTime) ? Math.max(totalTime, 0) : 0
                    });
                }
            });
        }
    }, [currentItem, userDb]);

    // Update remaining time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setClaimObj(prevClaimObj => {
                const newRemainTime = dayjs(prevClaimObj.endClaim).diff(dayjs(), 'second');
                return {
                    ...prevClaimObj,
                    remainTime: !isNaN(newRemainTime) ? Math.max(newRemainTime, 0) : 0
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [claimObj.endClaim]);

    useEffect(() => {
        if (claimObj.totalTime > 0 && claimObj.remainTime >= 0) {
            const newSliderValue = (claimObj.totalTime - claimObj.remainTime) / claimObj.totalTime * 100;
            if (newSliderValue >= 100) {
                const id = currentItem.id;
                setIsNeedClaim(true);
                removeClaim({ id, user }).then(r => console.log("removed"));
            }
        }
    }, [claimObj.remainTime, claimObj.totalTime]);

    if (!isNeedClaim && claimObj.isHave) {
        const sliderValue = (claimObj.totalTime > 0 && !isNaN(claimObj.remainTime)) ?
            ((claimObj.totalTime - claimObj.remainTime) / claimObj.totalTime * 100) : 0;

        return (
            <div>
                <p>Remaining Time: {dayjs.duration(claimObj.remainTime, 'seconds').humanize()}</p>
                <IOSSlider value={sliderValue} />
            </div>
        );
    }

    return null;
};

export default ProjectClaim;
