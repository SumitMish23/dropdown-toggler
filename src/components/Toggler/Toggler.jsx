import { useEffect, useState } from "react";
import { dateArr, strategyArr } from "../../api/Data.js";
import './Toggler.scss'
import { useMemo } from "react";
import { ReactComponent as YourSvg } from '../../assets/Down-arrow.svg';
const Home = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [strategyArray, setStrategyArr] = useState(strategyArr);
    const [dateArray, setDateArr] = useState(dateArr);
    const [cardData, setCardData] = useState({});
    const togglerView = useMemo(() => strategyArr.map(({ View }) => View), [strategyArr]);

    useEffect(() => {
        updateCardData('Bullish', dateArray[0]);
    }, []);

    const updateCardData = (tab, date) => {
        setActiveTab('Bullish');
        setSelectedDate(date);
        const strategy = strategyArray[0]['Value'][dateArr[0]];
        setCardData(rearrangeCardData(strategy));
    };


    function handleActiveTab(value) {
        setActiveTab(value);
        setSelectedDate(dateArr[0]);
        const firstData = (strategyArray.filter(({ View }) => View == value).map(({ Value }) => Value)[0][selectedDate]);
        if (!firstData) {
            setCardData([]);
            return;
        }
        let cardData = rearrangeCardData(firstData);
        setCardData(cardData);
    };

    function rearrangeCardData(cardDataArr) {
        let cardData = {};
        for (let index = 0; index < cardDataArr.length; index++) {
            if (cardData[cardDataArr[index]]) {
                cardData[cardDataArr[index]]++;
            } else {
                cardData[cardDataArr[index]] = 1;
            };

        };
        return cardData;
    }

    function handleDateChange(date) {
        setSelectedDate(date);
        setIsDateOpen(false);
        let cardDataArr = strategyArray.find(({ View }) => View == activeTab).Value[date];
        if (!cardDataArr) {
            setCardData([]);
            return;
        };

        let cardData = rearrangeCardData(cardDataArr);
        setCardData(cardData)
    };

    return <>
        <div className="home-container">
            {/* Toggler for changing the views */}
            <div className="toggle-container">
                {togglerView.map((value, index) => {
                    return (
                        <div key={index} onClick={(e) => handleActiveTab(value)} className={`${activeTab == value ? 'active-tab' : ''} toggle-container__tabs`}>
                            {value}
                        </div>
                    )
                })}
            </div>
            {/* Rendering the dates based on selected toggler */}

            <div className="date-dropdown" >
                <div className={`date-dropdown--header ${isDateOpen ? 'dropdown-active' : ''}`} onClick={() => setIsDateOpen(!isDateOpen)}>
                    <span>{selectedDate}</span> <YourSvg />
                </div>
                <div className={`date-dropdown--body ${isDateOpen ? 'dropdown-active' : ''}`} >
                    {
                        isDateOpen && dateArray.map((value, index) => {
                            if(value === selectedDate) return;
                            return <li className="date-dropdown--list" key={index} onClick={() => handleDateChange(value)}>{value}</li>
                        })
                    }
                </div>

            </div>

            {/* Rendering Cards based on selected toggler */}
            <div className="card-container">
            {Object.keys(cardData).length ? Object.entries(cardData).map(([key, value]) => {
                return (
                   <div key={key} className="card-container__list">
                   
                            <div className="card-container__list--value">{key}</div>
                            <div className="card-container__list--strategy"> {value} { value > 1 ? 'strategies' : 'strategy'}</div>
                    </div>
                 
                )
            }) : <p className="card-container__none">There are no strategies for <br/> <b>{selectedDate}</b> in {activeTab}</p>}
            </div>
         
        </div>
    </>
};
export default Home;