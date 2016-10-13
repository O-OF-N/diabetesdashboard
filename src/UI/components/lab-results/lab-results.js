import React from 'react';
import LabResultsHeader from './lab-results-header';
import LabResultsBody from './lab-results-body';
import {connect} from 'react-redux';

const LabResults = ({labs}) => {
    const style = { border: '1px solid', width: '50%', height: '100%', float: 'left' };
    return (
        <div style = {style}>
            <h3>Labs</h3>
            <LabResultsHeader/>
            <div id="div-lab-body">
                {
                    labs.map((l, i) => <LabResultsBody key={i} {...l.toJS() }/>)
                }
            </div>
        </div>
    )
};
export default connect(state => ({
    labs: state.labObject.labs
}))(LabResults);
