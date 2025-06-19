import '../style/NoDataFound.scss';

type Props = {
  removeFilters: () => void;
};

const NoDataFound: React.FC<Props> = ({ removeFilters }) => {

    return (
        <div className="nodata-container">
            <h3>We haven't found any motorcycle.</h3>
            <span>Please try with different filters.</span>
            <button onClick={removeFilters}>Remove filters</button>
        </div>
    )
}

export default NoDataFound;