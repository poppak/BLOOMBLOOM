import React, { useState, useEffect } from 'react';
import {Row} from "react-bootstrap";

    const addLeadingZero = (value) => {
        return value < 10 ? `0${value}` : `${value}`;
    };

    const Timer = ({targetDate}) => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = {};

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                timeLeft = {
                    days: addLeadingZero(days),
                    hours: addLeadingZero(hours),
                    minutes: addLeadingZero(minutes),
                    seconds: addLeadingZero(seconds)
                };
            }

            return timeLeft;
        };

        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

        useEffect(() => {
            const timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearTimeout(timer);
        });

        return (
            <Row style={{textAlign:"center"}}>
                <span className="mb-3" style={{fontWeight: 200, fontSize: '18px'}}>закроется через</span>
                <div style={{width:'20%', marginLeft: '10%'}}>
                    <div style={{fontWeight: 200, fontSize: '16px'}}>
                        Дни
                    </div>
                    <div style={{color: '#f3a0d5'}}>{timeLeft.days}</div>
                </div>
                <div style={{width:'20%', borderLeft: '1px solid #f3a0d5'}}>
                    <div style={{fontWeight: 200, fontSize: '16px'}}>
                        Часы
                    </div>
                    <div style={{color: '#f3a0d5'}}>{timeLeft.hours}</div>
                </div>
                <div style={{width:'20%', borderLeft: '1px solid #f3a0d5'}}>
                    <div style={{fontWeight: 200, fontSize: '16px'}}>
                        Минуты
                    </div>
                    <div style={{color: '#f3a0d5'}}>{timeLeft.minutes}</div>
                </div>

                <div style={{width:'20%', borderLeft: '1px solid #f3a0d5'}}>
                    <div style={{fontWeight: 200, fontSize: '16px'}}>
                        Секунды
                    </div>
                    <div style={{color: '#f3a0d5'}}>{timeLeft.seconds}</div>
                </div>
            </Row>

        );
    };
export default Timer;