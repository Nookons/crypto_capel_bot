import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import MyButton from "../../../components/MyButton";
import startUserClaim from "../../../utils/User/UserClaimStart";
import {Backdrop, CircularProgress, Skeleton} from "@mui/material";
import dayjs from "dayjs";
import { ClaimSlider } from "../../../Assets/Sliders";
import styles from './UserClaim.module.css'

const UserClaim = () => {
    const user = useSelector(state => state.user);

    const [isClaimed, setIsClaimed] = useState(true);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(user.capel_claim) {
            if(dayjs(user.capel_claim.endClaim).isAfter()) {
                setIsClaimed(true);
                setIsLoading(false);
            }
        } else {
            setTimeout(() => {
                setIsClaimed(false);
                setIsLoading(false)
            }, 250)
        }
    }, []);

    const [isClaiming, setIsClaiming] = useState(false);

    const [sliderData, setSliderData] = useState({
        value: 0,
        coin_value: 0.025000,
        remainTime: 0,
        totalTime: 0,
        totalCoins: 0.025000 // total coins to be earned at the end of the period
    });

    useEffect(() => {
        if (user && user.capel_claim) {
            const endClaim = dayjs(user.capel_claim.endClaim);
            const startClaim = dayjs(user.capel_claim.startClaim);
            const totalTime = endClaim.diff(startClaim, 'second');
            const remainTime = endClaim.diff(dayjs(), 'second');

            setSliderData({
                totalTime,
                remainTime,
                value: 0,
                coin_value: 0,
                totalCoins: 0.025000
            });

            const timer = setInterval(() => {
                const newRemainTime = endClaim.diff(dayjs(), 'second');
                setIsLoading(false)

                setSliderData(prevState => {
                    const newRemainTimeClamped = Math.max(newRemainTime, 0);
                    const elapsedTime = totalTime - newRemainTimeClamped;
                    const newCoinValue = (elapsedTime / totalTime) * prevState.totalCoins;

                    return {
                        ...prevState,
                        remainTime: newRemainTimeClamped,
                        coin_value: newCoinValue
                    };
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [user]);

    useEffect(() => {
        if (sliderData.totalTime > 0 && sliderData.remainTime >= 0) {
            const newSliderValue = ((sliderData.totalTime - sliderData.remainTime) / sliderData.totalTime) * 100;
            setSliderData(prevState => ({
                ...prevState,
                value: newSliderValue
            }));

            if (newSliderValue >= 100) {
                setIsClaimed(false);
            }
        }
    }, [sliderData.remainTime]);

    const onStartClaim = async () => {
        try {
            const coin = sliderData.coin_value
            setIsClaiming(true);

            const response = await startUserClaim({user, coin});

            if (response === 200) {
                setIsClaimed(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsClaiming(false);
        }
    };

    if (isLoading) {
        return <Skeleton sx={{mb: "14px"}} variant="rectangular" width={"100%"} height={60}/>
    }

    if (!isClaimed) {
        return (
            <>
                <Backdrop sx={{ zIndex: 99 }} open={isClaiming}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <MyButton click={onStartClaim} disabled={isClaiming}>Забрати монетки</MyButton>
            </>
        );
    }

    return (
        <div className={styles.SliderBlock} >
            <ClaimSlider value={sliderData.value} />
            <article>{`${sliderData.coin_value.toFixed(6)}`}</article>
        </div>
    );
};

export default UserClaim;
