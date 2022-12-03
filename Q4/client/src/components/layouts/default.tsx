import React from 'react'

const DefaultLayout = (props: { children: React.ReactChild }) => 
{
    return (
        <div className="mainContent" id="mainContent">
           {props.children}
        </div>
    );
};

export default DefaultLayout