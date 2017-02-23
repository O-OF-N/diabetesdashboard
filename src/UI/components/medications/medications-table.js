import React from 'react';
import './medications.css';

const buildRows = (data, comments) => (
    <tr>
        <td className="order-details"><span className="medication">{data.ingredients.name}</span>
            <span className="text">{data.dosage}</span>
            {comments ? <span className="text"><br />{'Comments: '.concat(data.comments)}</span> : null}</td>
        <td className="date data-type-date">{dateFormat(data.date)}</td>
    </tr>
);

const dateFormat = date => new Date(date).toLocaleString();

const MedicationsTable = ({data, title, comments}) => (<table className="table-base table-striped">
    <caption className="caption"><h5 className="caption-header">{title}</h5></caption>
    <MedicationsHeader />
    <MedicationBody data={data} comments={comments} />
</table>);

const MedicationBody = ({data, comments}) => (
    <tbody>
        {data.map(d => buildRows(d, comments))}
    </tbody>
);

const MedicationsHeader = () => (
    <thead>
        <tr>
            <th scope="col" className="left">Medication Order Details </th>
            <th scope="col" className="right">Date </th>
        </tr>
    </thead >
);

export default MedicationsTable;
