import flag_idn from '../assets/icon_Indonesia.png'
import flag_chn from '../assets/icon_China.png'
import flag_gmn from '../assets/icon_Germany.png'
import flag_kor from '../assets/icon_Korea.png'
import flag_fra from '../assets/icon_France.png'
import flag_usa from '../assets/icon_UnitedStates.png'
import flag_uk from '../assets/icon_UnitedKingdom.png'
import flag_jp from '../assets/icon_Japan.png'

function BackgroundFlag() {
    return (
        <ul className="indonesia">
                <img src={flag_idn} alt=""/>
                <img src={flag_chn} alt=""/>
                <img src={flag_gmn} alt=""/>
                <img src={flag_kor} alt=""/>
                <img src={flag_jp} alt=""/>
                <img src={flag_fra} alt=""/>
                <img src={flag_usa} alt=""/>
                <img src={flag_uk} alt=""/>
                <img src={flag_idn} alt=""/>
                <img src={flag_uk} alt=""/>
            </ul>
    );
}

export default BackgroundFlag;