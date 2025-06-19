import { MotorcycleDetails } from "../interfaces/Motorcycles";

import '../style/BikeDetails.scss';

const BikeDetails = (props: { bikeModel: MotorcycleDetails | null, imgSrc: string | null, bikeFullName: string | null}) => {
    return (
        <div className="bikeDetails-container">
            <div className="bikeDetails-img">
                <img src={ props.imgSrc || "" } />
            </div>
            <div className="bikeDetails-data">
            <h2>{ `${props.bikeModel?.make} ${props.bikeModel?.model} - ${props.bikeModel?.year}` }</h2>
            <h3>Technical specifications</h3>
            {props.bikeModel ? Object.entries(props.bikeModel).map(([key, value]) => (
                <div key={key} className="bikeDetails-row">
                    <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value ?? 'N/A'}
                </div>
            )) : null}
            </div>
        </div>
    )
}

export default BikeDetails;