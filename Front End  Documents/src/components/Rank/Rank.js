import React from 'react';

const Rank = ({ name, entries }) => {
    return(
    <div>
        <div className='white f2'>
            {`${name}, Your current image detection counting is...`}
        </div>
        <div className='f1 white'>
            {entries}
            <br></br>
        </div>
    </div>
    );
}

export default Rank;