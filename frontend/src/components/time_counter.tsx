import React, { useState, useEffect, useRef } from "react";

type TimeCounterProps = {
	style?: React.CSSProperties,
	prefix?: string,
	className: string,
	from: Date
};

const TimeCounter = ({ style, prefix = "", from, className }: TimeCounterProps) => {
	const [timeElapsed, setTimeElapsed] = useState<{
		years: number,
		months: number,
		days: number,
		hours: number,
		seconds: number,
		totalSeconds: number
	}>({ years: 0, months: 0, days: 0, hours: 0, seconds: 0, totalSeconds: 0 });
  
	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;
		
		const calculateTimeDifference = () => {
			const now = new Date();
			const diffMs = now.getTime() - from.getTime();
			
			const secondsTotal = Math.floor(diffMs / 1000);
			const minutesTotal = Math.floor(secondsTotal / 60);
			const hoursTotal = Math.floor(minutesTotal / 60);
			const daysTotal = Math.floor(hoursTotal / 24);
			
			const yearsTotal = Math.floor(daysTotal / 365);
			const monthsTotal = Math.floor((daysTotal % 365) / 30);
			
			const days = daysTotal % 30;
			const hours = hoursTotal % 24;
			const seconds = secondsTotal % 60;
			
			setTimeElapsed({
				years: yearsTotal,
				months: monthsTotal,
				days,
				hours,
				seconds,
				totalSeconds: secondsTotal
			});
			
			timeoutId = setTimeout(calculateTimeDifference, 50);
		};
		
		calculateTimeDifference();
		
		return () => clearTimeout(timeoutId);
	}, [from]);

	return (
		<div style={style} className={className}>
			{prefix && <span>{prefix} </span>}
			<span>{timeElapsed.years}y & {timeElapsed.months}mo ({timeElapsed.totalSeconds} secs)</span>
		</div>
	);
};

export default TimeCounter;