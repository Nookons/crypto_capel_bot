import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from "react-redux";
import MyButton from "../../../components/MyButton";
import startUserClaim from "../../../utils/User/UserClaimStart";
import { Backdrop, CircularProgress, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { ClaimSlider } from "../../../Assets/Sliders";
import styles from './UserClaim.module.css';

const useClaimTimer = (user) => {
    const [sliderData, setSliderData] = useState({
        value: 0,
        coin_value: 0.025000,
        remainTime: 0,
        totalTime: 0,
        totalCoins: 0.025000
    });

    useEffect(() => {
        if (user?.capel_claim) {
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
                const elapsedTime = totalTime - newRemainTime;
                const newCoinValue = (elapsedTime / totalTime) * sliderData.totalCoins;

                setSliderData(prevState => ({
                    ...prevState,
                    remainTime: Math.max(newRemainTime, 0),
                    coin_value: newCoinValue
                }));
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
        }
    }, [sliderData.remainTime]);

    return sliderData;
};

const UserClaim = () => {
    const user = useSelector(state => state.user);
    const [isClaimed, setIsClaimed] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);

    const sliderData = useClaimTimer(user);

    useEffect(() => {
        if (user?.capel_claim) {
            if (dayjs(user.capel_claim.endClaim).isAfter()) {
                setIsClaimed(true);
                setIsLoading(false);
            }
        } else {
            setTimeout(() => {
                setIsClaimed(false);
                setIsLoading(false);
            }, 250);
        }
    }, [user]);

    const onStartClaim = useCallback(async () => {
        try {
            setIsClaiming(true);
            const coin = sliderData.coin_value;
            const response = await startUserClaim({ user, coin });
            if (response === 200) {
                setIsClaimed(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsClaiming(false);
        }
    }, [sliderData.coin_value, user]);

    if (isLoading) {
        return <Skeleton sx={{ mb: "14px" }} variant="rectangular" width={"100%"} height={60} />;
    }

    if (!isClaimed) {
        return (
            <>
                <Backdrop sx={{ zIndex: 99 }} open={isClaiming}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <MyButton onClick={onStartClaim} disabled={isClaiming}>Забрати монетки</MyButton>
            </>
        );
    }

    return (
        <div className={styles.SliderBlock}>
            <ClaimSlider value={sliderData.value} />
            <article>{`Вже е ${sliderData.coin_value.toFixed(6)}`}</article>
        </div>
    );
};

export default UserClaim;
